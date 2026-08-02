import crypto from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

const intakeSchema = z.object({
  ciphertext: z.string().min(1),
  public_key_id: z.string().min(1),
  urgency: z.enum(["low", "medium", "high"]).default("low"),
  coarse_region: z.string().optional(),
  work_type: z.string().optional(),
});

const forbiddenPlaintextKeys = [
  "name",
  "email",
  "phone",
  "employer",
  "context",
  "message",
  "address",
];

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z]/g, "");
}

function hasForbiddenPlaintextKeys(payload) {
  const keys = Object.keys(payload).map(normalizeKey);
  return keys.some((k) => forbiddenPlaintextKeys.includes(k));
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function isAllowedOrigin(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return allowed.includes(origin);
}

function getExpiresAt() {
  const days = Number.parseInt(process.env.INTAKE_TTL_DAYS ?? "30", 10);
  const now = Date.now();
  return new Date(now + Math.max(1, days) * 24 * 60 * 60 * 1000);
}

const s3 = new S3Client({});
const dynamo = new DynamoDBClient({});

export async function handler(event) {
  const origin = event.headers?.origin ?? event.headers?.Origin ?? "";
  const cors = origin && isAllowedOrigin(origin) ? buildCorsHeaders(origin) : {};

  if (event.requestContext?.http?.method === "OPTIONS") {
    if (!origin || !isAllowedOrigin(origin)) {
      return { statusCode: 403, headers: cors, body: "" };
    }
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (!origin || !isAllowedOrigin(origin)) {
    return json(403, { error: "Requests must come from an allowed site origin." }, cors);
  }

  if (!event.body) {
    return json(400, { error: "Request body is required." }, cors);
  }

  const maxBytes = Number.parseInt(process.env.MAX_INTAKE_REQUEST_BYTES ?? "16384", 10);
  let rawBody = event.body;

  if (event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, "base64").toString("utf8");
  }

  if (Buffer.byteLength(rawBody, "utf8") > maxBytes) {
    return json(413, { error: "Encrypted intake payload is too large." }, cors);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "Invalid JSON payload." }, cors);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json(400, { error: "Expected a JSON object." }, cors);
  }

  if (hasForbiddenPlaintextKeys(body)) {
    return json(400, { error: "Plaintext PII fields are not allowed in the intake API payload." }, cors);
  }

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { error: "Encrypted intake payload is invalid." }, cors);
  }

  const configuredKeyId = process.env.CONFIGURED_PUBLIC_KEY_ID;
  if (configuredKeyId && parsed.data.public_key_id !== configuredKeyId) {
    return json(400, { error: "Unknown organizer public key identifier." }, cors);
  }

  const id = crypto.randomUUID();
  const expiresAt = getExpiresAt();

  const tableName = process.env.INTAKE_TABLE_NAME;
  const bucketName = process.env.CIPHERTEXT_BUCKET_NAME;
  if (!tableName || !bucketName) {
    return json(503, { error: "Intake storage is not configured." }, cors);
  }

  const s3Key = `intakes/${id}.json`;
  const record = {
    id,
    ciphertext: parsed.data.ciphertext,
    public_key_id: parsed.data.public_key_id,
    urgency: parsed.data.urgency,
    coarse_region: parsed.data.coarse_region ?? null,
    work_type: parsed.data.work_type ?? null,
    expires_at: expiresAt.toISOString(),
  };

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: JSON.stringify(record),
      ContentType: "application/json",
      CacheControl: "no-store",
    }),
  );

  await dynamo.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: id },
        s3_key: { S: s3Key },
        public_key_id: { S: parsed.data.public_key_id },
        urgency: { S: parsed.data.urgency },
        coarse_region: parsed.data.coarse_region ? { S: parsed.data.coarse_region } : { NULL: true },
        work_type: parsed.data.work_type ? { S: parsed.data.work_type } : { NULL: true },
        status: { S: "new" },
        expires_at: { S: expiresAt.toISOString() },
        expires_at_epoch: { N: String(Math.floor(expiresAt.getTime() / 1000)) },
      },
    }),
  );

  return json(201, { id, expires_at: expiresAt.toISOString() }, cors);
}
