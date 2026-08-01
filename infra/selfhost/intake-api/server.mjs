import http from "node:http";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const forbiddenPlaintextKeys = [
  "name",
  "email",
  "phone",
  "employer",
  "context",
  "message",
  "address",
  "nameoralias",
  "personalemail",
  "personalphone",
];

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z]/g, "");
}

function hasForbiddenPlaintextKeys(payload) {
  const keys = Object.keys(payload).map(normalizeKey);
  return keys.some((k) => forbiddenPlaintextKeys.includes(k));
}

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(res, statusCode, body, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

async function readBody(req, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > maxBytes) {
      throw Object.assign(new Error("too_large"), { code: "too_large" });
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function getExpiresAt() {
  const days = Number.parseInt(process.env.INTAKE_TTL_DAYS ?? "30", 10);
  const now = Date.now();
  return new Date(now + Math.max(1, days) * 24 * 60 * 60 * 1000);
}

function openDb(dbPath) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
CREATE TABLE IF NOT EXISTS intakes (
  id TEXT PRIMARY KEY,
  s3_key TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  public_key_id TEXT NOT NULL,
  urgency TEXT NOT NULL,
  coarse_region TEXT,
  work_type TEXT,
  received_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'selfhost'
);
CREATE INDEX IF NOT EXISTS idx_intakes_received_at ON intakes(received_at);
CREATE INDEX IF NOT EXISTS idx_intakes_status ON intakes(status);
`);
  return db;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

const port = Number.parseInt(process.env.PORT ?? "3010", 10);
const dataDir = process.env.DATA_DIR ?? "/data";
const dbPath = path.join(dataDir, "intakes.sqlite");
const objectsDir = path.join(dataDir, "ciphertext", "intakes");

await ensureDir(objectsDir);
const db = openDb(dbPath);

const server = http.createServer(async (req, res) => {
  try {
    const origin = req.headers.origin ?? "";
    const allowedOrigins = getAllowedOrigins();
    const cors = origin && allowedOrigins.includes(origin) ? buildCorsHeaders(origin) : {};

    if (req.method === "OPTIONS" && req.url === "/intake") {
      if (!origin || !allowedOrigins.includes(origin)) {
        res.writeHead(403, cors);
        res.end("");
        return;
      }
      res.writeHead(204, cors);
      res.end("");
      return;
    }

    if (req.method !== "POST" || req.url !== "/intake") {
      json(res, 404, { error: "Not found" }, cors);
      return;
    }

    if (!origin || !allowedOrigins.includes(origin)) {
      json(res, 403, { error: "Requests must come from an allowed site origin." }, cors);
      return;
    }

    const maxBytes = Number.parseInt(process.env.MAX_INTAKE_REQUEST_BYTES ?? "16384", 10);
    let raw;
    try {
      raw = await readBody(req, maxBytes);
    } catch (e) {
      if (e && e.code === "too_large") {
        json(res, 413, { error: "Encrypted intake payload is too large." }, cors);
        return;
      }
      throw e;
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      json(res, 400, { error: "Invalid JSON payload." }, cors);
      return;
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      json(res, 400, { error: "Expected a JSON object." }, cors);
      return;
    }

    if (hasForbiddenPlaintextKeys(body)) {
      json(res, 400, { error: "Plaintext PII fields are not allowed in the intake API payload." }, cors);
      return;
    }

    const ciphertext = typeof body.ciphertext === "string" ? body.ciphertext : "";
    const public_key_id = typeof body.public_key_id === "string" ? body.public_key_id : "";
    const urgency = typeof body.urgency === "string" ? body.urgency : "low";
    const coarse_region = typeof body.coarse_region === "string" ? body.coarse_region : null;
    const work_type = typeof body.work_type === "string" ? body.work_type : null;

    if (!ciphertext || !public_key_id) {
      json(res, 400, { error: "Encrypted intake payload is invalid." }, cors);
      return;
    }

    const configuredKeyId = process.env.CONFIGURED_PUBLIC_KEY_ID;
    if (configuredKeyId && public_key_id !== configuredKeyId) {
      json(res, 400, { error: "Unknown organizer public key identifier." }, cors);
      return;
    }

    const id = crypto.randomUUID();
    const expiresAt = getExpiresAt();
    const receivedAt = new Date().toISOString();
    const objectPath = path.join(objectsDir, `${id}.json`);

    const record = {
      id,
      ciphertext,
      public_key_id,
      urgency,
      coarse_region,
      work_type,
      expires_at: expiresAt.toISOString(),
      received_at: receivedAt,
    };

    await fs.writeFile(objectPath, JSON.stringify(record), "utf8");

    db.prepare(
      `
INSERT INTO intakes (
  id, s3_key, ciphertext, public_key_id, urgency, coarse_region, work_type,
  received_at, expires_at, status, source
)
VALUES (
  @id, @s3_key, @ciphertext, @public_key_id, @urgency, @coarse_region, @work_type,
  @received_at, @expires_at, 'new', 'selfhost'
)
ON CONFLICT(id) DO UPDATE SET
  s3_key = excluded.s3_key,
  ciphertext = excluded.ciphertext,
  public_key_id = excluded.public_key_id,
  urgency = excluded.urgency,
  coarse_region = excluded.coarse_region,
  work_type = excluded.work_type,
  received_at = excluded.received_at,
  expires_at = excluded.expires_at
`,
    ).run({
      id,
      s3_key: objectPath,
      ciphertext,
      public_key_id,
      urgency,
      coarse_region,
      work_type,
      received_at: receivedAt,
      expires_at: expiresAt.toISOString(),
    });

    json(res, 201, { id, expires_at: expiresAt.toISOString() }, cors);
  } catch (error) {
    json(res, 500, { error: error instanceof Error ? error.message : "Server error" });
  }
});

server.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`selfhost intake API listening on 0.0.0.0:${port}`);
});
