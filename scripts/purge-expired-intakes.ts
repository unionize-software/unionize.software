import {
  getIntakePurgeCutoffDate,
  getIntakeRetentionPolicy,
} from "../lib/intake/config";
import { createServiceRoleSupabaseClient } from "../lib/db/client";

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

async function main() {
  const supabase = createServiceRoleSupabaseClient();
  const dryRun = hasFlag("--dry-run");
  const now = new Date();
  const nowIso = now.toISOString();
  const purgeCutoffIso = getIntakePurgeCutoffDate(now).toISOString();
  const { retentionDays, purgeGraceDays } = getIntakeRetentionPolicy();

  const { data: expiringRows, error: expiringError } = await supabase
    .from("encrypted_intakes")
    .select("id")
    .lte("expires_at", nowIso)
    .is("deleted_at", null);

  if (expiringError) {
    throw new Error(`Unable to query expiring intakes: ${expiringError.message}`);
  }

  const { data: purgeRows, error: purgeError } = await supabase
    .from("encrypted_intakes")
    .select("id")
    .lte("deleted_at", purgeCutoffIso);

  if (purgeError) {
    throw new Error(`Unable to query purgeable intakes: ${purgeError.message}`);
  }

  if (dryRun) {
    console.log(
      `Dry run: ${expiringRows.length} intakes would be soft-deleted and ${purgeRows.length} intakes would be hard-deleted.`,
    );
    console.log(`Retention window: ${retentionDays} days. Purge grace: ${purgeGraceDays} days.`);
    return;
  }

  if (expiringRows.length > 0) {
    const { error: softDeleteError } = await supabase
      .from("encrypted_intakes")
      .update({
        deleted_at: nowIso,
        status: "expired",
      })
      .in(
        "id",
        expiringRows.map((row) => row.id),
      );

    if (softDeleteError) {
      throw new Error(`Unable to soft-delete expired intakes: ${softDeleteError.message}`);
    }
  }

  if (purgeRows.length > 0) {
    const { error: hardDeleteError } = await supabase
      .from("encrypted_intakes")
      .delete()
      .in(
        "id",
        purgeRows.map((row) => row.id),
      );

    if (hardDeleteError) {
      throw new Error(`Unable to hard-delete expired intakes: ${hardDeleteError.message}`);
    }
  }

  console.log(
    `Soft-deleted ${expiringRows.length} expired intakes and hard-deleted ${purgeRows.length} older soft-deleted intakes.`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Unable to purge expired encrypted intakes.",
  );
  process.exit(1);
});
