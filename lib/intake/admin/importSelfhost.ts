import path from "node:path";

import Database from "better-sqlite3";

import { openLocalIntakeDb, upsertIntake } from "./localDb";

type SelfhostRow = {
  id: string;
  s3_key: string;
  ciphertext: string;
  public_key_id: string;
  urgency: string;
  coarse_region: string | null;
  work_type: string | null;
  received_at: string;
  expires_at: string;
  status: string;
  source: string;
};

export async function importSelfhostIntakes(opts: { dataDir: string; limit?: number }) {
  const limit = Math.max(1, Math.min(500, opts.limit ?? 200));
  const selfhostDbPath = path.join(opts.dataDir, "intakes.sqlite");
  const selfDb = new Database(selfhostDbPath, { readonly: true, fileMustExist: true });

  const rows = selfDb
    .prepare(
      `
SELECT id, s3_key, ciphertext, public_key_id, urgency, coarse_region, work_type,
       received_at, expires_at, status, source
FROM intakes
ORDER BY received_at DESC
LIMIT ?
`,
    )
    .all(limit) as SelfhostRow[];

  const localDb = await openLocalIntakeDb();

  function isIntakeStatus(value: string): value is "new" | "triaged" | "closed" | "expired" {
    return value === "new" || value === "triaged" || value === "closed" || value === "expired";
  }

  localDb.transaction(() => {
    for (const row of rows) {
      upsertIntake(localDb, {
        id: row.id,
        s3_key: row.s3_key,
        ciphertext: row.ciphertext,
        public_key_id: row.public_key_id,
        urgency: row.urgency,
        coarse_region: row.coarse_region,
        work_type: row.work_type,
        received_at: row.received_at,
        expires_at: row.expires_at,
        status: isIntakeStatus(row.status) ? row.status : "new",
        source: row.source || "selfhost",
      });
    }
  })();

  return { imported: rows.length, selfhostDbPath };
}
