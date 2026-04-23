import { NextResponse } from "next/server";

import { createPublicServerSupabaseClient, isPublicSupabaseConfigured } from "@/lib/db/client";
import {
  getIntakeExpiryDate,
  INTAKE_RATE_LIMIT_WINDOW_MS,
  MAX_INTAKE_REQUEST_BYTES,
  MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
} from "@/lib/intake/config";
import { getConfiguredIntakePublicKeyId } from "@/lib/intake/publicKey";
import { intakeApiSchema, forbiddenPlaintextKeys } from "@/lib/intake/schema";
import { logOperationalEvent } from "@/lib/security/noPiiLogging";
import { takeRateLimit } from "@/lib/security/rateLimit";

function hasForbiddenPlaintextKeys(payload: Record<string, unknown>) {
  const payloadKeys = Object.keys(payload).map((key) => key.toLowerCase().replace(/[^a-z]/g, ""));
  return payloadKeys.some((key) => forbiddenPlaintextKeys.includes(key));
}

function jsonNoStore(body: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...init?.headers,
    },
  });
}

function getRequestOrigin(request: Request) {
  return request.headers.get("origin");
}

function getRequestHostOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!host) {
    return null;
  }

  const proto =
    request.headers.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${host}`;
}

function getAllowedOrigins(request: Request) {
  const origins = new Set<string>();
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestHostOrigin = getRequestHostOrigin(request);

  if (configuredSiteUrl) {
    try {
      origins.add(new URL(configuredSiteUrl).origin);
    } catch {
      // Ignore malformed optional env input and fall back to request-derived origins.
    }
  }

  if (requestHostOrigin) {
    origins.add(requestHostOrigin);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://127.0.0.1:3000");
    origins.add("http://localhost:3000");
  }

  return origins;
}

function hasAllowedOrigin(request: Request) {
  const origin = getRequestOrigin(request);

  if (!origin) {
    return false;
  }

  return getAllowedOrigins(request).has(origin);
}

function getClientAddress(request: Request) {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];

  return candidates.find((candidate) => Boolean(candidate)) ?? null;
}

function getClientRateLimitKey(request: Request) {
  const address = getClientAddress(request);

  if (address) {
    return `intake:${address}`;
  }

  const origin = getRequestOrigin(request) ?? "unknown-origin";
  const userAgent = request.headers.get("user-agent")?.slice(0, 80) ?? "unknown-agent";

  return `intake:${origin}:${userAgent}`;
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    logOperationalEvent("intake_rejected_origin");
    return jsonNoStore({ error: "Requests must come from an allowed site origin." }, { status: 403 });
  }

  const rateLimit = takeRateLimit({
    key: getClientRateLimitKey(request),
    limit: MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
    windowMs: INTAKE_RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    logOperationalEvent("intake_rate_limited");
    return jsonNoStore(
      { error: "Too many intake attempts from this connection. Please wait and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)).toString(),
        },
      },
    );
  }

  const declaredContentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);

  if (Number.isFinite(declaredContentLength) && declaredContentLength > MAX_INTAKE_REQUEST_BYTES) {
    return jsonNoStore({ error: "Encrypted intake payload is too large." }, { status: 413 });
  }

  let rawBody = "";

  try {
    rawBody = await request.text();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  if (!rawBody) {
    return jsonNoStore({ error: "Request body is required." }, { status: 400 });
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_INTAKE_REQUEST_BYTES) {
    return jsonNoStore({ error: "Encrypted intake payload is too large." }, { status: 413 });
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonNoStore({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Expected a JSON object." }, { status: 400 });
  }

  if (hasForbiddenPlaintextKeys(body as Record<string, unknown>)) {
    logOperationalEvent("intake_rejected_plaintext_keys", {
      keys: Object.keys(body as Record<string, unknown>),
    });

    return jsonNoStore(
      { error: "Plaintext PII fields are not allowed in the intake API payload." },
      { status: 400 },
    );
  }

  const parsed = intakeApiSchema.safeParse(body);

  if (!parsed.success) {
    return jsonNoStore({ error: "Encrypted intake payload is invalid." }, { status: 400 });
  }

  const configuredKeyId = getConfiguredIntakePublicKeyId();

  if (configuredKeyId && parsed.data.public_key_id !== configuredKeyId) {
    logOperationalEvent("intake_rejected_unknown_key_id");
    return jsonNoStore({ error: "Unknown organizer public key identifier." }, { status: 400 });
  }

  if (!isPublicSupabaseConfigured()) {
    return jsonNoStore({ error: "Intake storage is not configured." }, { status: 503 });
  }

  const id = crypto.randomUUID();
  const expiresAt = getIntakeExpiryDate();
  const supabase = createPublicServerSupabaseClient();
  const intakeRecord = {
    id,
    ciphertext: parsed.data.ciphertext,
    public_key_id: parsed.data.public_key_id,
    urgency: parsed.data.urgency,
    coarse_region: parsed.data.coarse_region ?? null,
    work_type: parsed.data.work_type ?? null,
    status: "new",
    expires_at: expiresAt.toISOString(),
  };

  const { error } = await supabase.from("encrypted_intakes").insert(intakeRecord);

  if (error) {
    logOperationalEvent("intake_insert_failed", {
      id,
      code: error.code ?? "unknown",
      urgency: parsed.data.urgency,
    });

    return jsonNoStore({ error: "Encrypted intake could not be stored." }, { status: 500 });
  }

  logOperationalEvent("intake_inserted", {
    id,
    urgency: parsed.data.urgency,
    coarse_region: parsed.data.coarse_region ?? null,
    work_type: parsed.data.work_type ?? null,
  });

  return jsonNoStore({ id, expires_at: expiresAt.toISOString() }, { status: 201 });
}
