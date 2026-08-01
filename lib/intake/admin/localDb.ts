import Database from "better-sqlite3";
import { ensureUnionizeHomeDir, getIntakeSqlitePath } from "./localPaths";

export type IntakeStatus = "new" | "triaged" | "closed" | "expired";

export type LocalIntakeRow = {
  id: string;
  s3_key: string;
  ciphertext: string;
  public_key_id: string;
  urgency: string;
  coarse_region: string | null;
  work_type: string | null;
  received_at: string;
  expires_at: string;
  status: IntakeStatus;
  source: string;
};

export async function openLocalIntakeDb() {
  await ensureUnionizeHomeDir();
  const dbPath = getIntakeSqlitePath();
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
  source TEXT NOT NULL DEFAULT 'aws'
);

CREATE INDEX IF NOT EXISTS idx_intakes_status ON intakes(status);
CREATE INDEX IF NOT EXISTS idx_intakes_received_at ON intakes(received_at);
CREATE INDEX IF NOT EXISTS idx_intakes_urgency ON intakes(urgency);
`);

  return db;
}

export function upsertIntake(db: Database.Database, row: Omit<LocalIntakeRow, "status" | "source"> & Partial<Pick<LocalIntakeRow, "status" | "source">>) {
  const stmt = db.prepare(`
INSERT INTO intakes (
  id, s3_key, ciphertext, public_key_id, urgency, coarse_region, work_type,
  received_at, expires_at, status, source
)
VALUES (
  @id, @s3_key, @ciphertext, @public_key_id, @urgency, @coarse_region, @work_type,
  @received_at, @expires_at, COALESCE(@status, 'new'), COALESCE(@source, 'aws')
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
`);

  stmt.run(row);
}

export function listIntakes(db: Database.Database, opts: {
  status?: string;
  urgency?: string;
  region?: string;
  workType?: string;
  since?: string;
  limit?: number;
}) {
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (opts.status) {
    clauses.push("status = @status");
    params.status = opts.status;
  }
  if (opts.urgency) {
    clauses.push("urgency = @urgency");
    params.urgency = opts.urgency;
  }
  if (opts.region) {
    clauses.push("coarse_region = @region");
    params.region = opts.region;
  }
  if (opts.workType) {
    clauses.push("work_type = @workType");
    params.workType = opts.workType;
  }
  if (opts.since) {
    clauses.push("received_at >= @since");
    params.since = opts.since;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.max(1, Math.min(500, opts.limit ?? 50));
  params.limit = limit;

  const stmt = db.prepare(`
SELECT id, urgency, coarse_region, work_type, received_at, expires_at, status
FROM intakes
${where}
ORDER BY received_at DESC
LIMIT @limit
`);

  return stmt.all(params) as Array<Pick<LocalIntakeRow, "id" | "urgency" | "coarse_region" | "work_type" | "received_at" | "expires_at" | "status">>;
}

export function getIntakeById(db: Database.Database, id: string) {
  const stmt = db.prepare(`SELECT * FROM intakes WHERE id = ?`);
  return stmt.get(id) as LocalIntakeRow | undefined;
}

export function setIntakeStatus(db: Database.Database, id: string, status: IntakeStatus) {
  const stmt = db.prepare(`UPDATE intakes SET status = ? WHERE id = ?`);
  stmt.run(status, id);
}
