import type { GuideSearchIndexDocument } from "@/lib/content/getGuides";

export const resourcesSearchIndexPath = "/search/resources-index.json";

export type GuideSearchIndexPayload = {
  generatedAt: string;
  guides: GuideSearchIndexDocument[];
};

export function isGuideSearchIndexPayload(value: unknown): value is GuideSearchIndexPayload {
  if (!value || typeof value !== "object" || !("guides" in value) || !("generatedAt" in value)) {
    return false;
  }

  const payload = value as { generatedAt?: unknown; guides?: unknown };

  return typeof payload.generatedAt === "string" && Array.isArray(payload.guides);
}
