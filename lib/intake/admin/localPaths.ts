import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

export function getUnionizeHomeDir() {
  return path.join(os.homedir(), ".unionize");
}

export function getIntakeSqlitePath() {
  return path.join(getUnionizeHomeDir(), "intakes.sqlite");
}

export async function ensureUnionizeHomeDir() {
  const dir = getUnionizeHomeDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}
