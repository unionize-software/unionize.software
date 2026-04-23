import {
  guideCollectionDefinitions,
  type GuideCollectionId,
} from "@/lib/content/contentModel";
import type { GuideListDocument } from "@/lib/content/getGuides";

type WikiSectionDefinition = {
  id: GuideCollectionId;
  title: string;
  description: string;
};

export type WikiSection = WikiSectionDefinition & {
  guides: GuideListDocument[];
};

const wikiSectionDefinitions: WikiSectionDefinition[] = Object.entries(guideCollectionDefinitions).map(
  ([id, section]) => ({
    id: id as GuideCollectionId,
    title: section.title,
    description: section.description,
  }),
);

export function buildWikiSections(guides: GuideListDocument[]): WikiSection[] {
  return wikiSectionDefinitions
    .map((section) => ({
      ...section,
      guides: guides.filter((guide) => guide.collections.includes(section.id)),
    }))
    .filter((section) => section.guides.length > 0);
}

export function getWikiSectionsForGuide(guides: GuideListDocument[], slug: string) {
  return buildWikiSections(guides).filter((section) =>
    section.guides.some((guide) => guide.slug === slug),
  );
}

export function getRelatedGuidesForGuide(
  guides: GuideListDocument[],
  slug: string,
  limit = 4,
) {
  const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const guide = guidesBySlug.get(slug);

  if (!guide) {
    return [];
  }

  const explicitRelatedSlugs = guide.related_slugs.filter((relatedSlug) => relatedSlug !== slug);
  const fallbackRelatedSlugs = getWikiSectionsForGuide(guides, slug)
    .flatMap((section) => section.guides.map((sectionGuide) => sectionGuide.slug))
    .filter((relatedSlug) => relatedSlug !== slug);

  const relatedSlugs = [...explicitRelatedSlugs, ...fallbackRelatedSlugs]
    .filter((relatedSlug, index, allSlugs) => allSlugs.indexOf(relatedSlug) === index)
    .slice(0, limit);

  return relatedSlugs
    .map((relatedSlug) => guidesBySlug.get(relatedSlug))
    .filter((guide): guide is GuideListDocument => Boolean(guide));
}
