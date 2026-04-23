import { z } from "zod";

import {
  guideCollectionIds,
  guidePageTypes,
  guideSourceStatuses,
} from "@/lib/content/contentModel";

export const guideFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  page_type: z.enum(guidePageTypes),
  jurisdiction: z.string().min(1),
  legal_scope: z.string().min(1),
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  review_status: z.string().min(1),
  risk_level: z.string().min(1),
  source_status: z.enum(guideSourceStatuses),
  when_to_use: z.string().min(1),
  not_for: z.string().min(1),
  collections: z.array(z.enum(guideCollectionIds)).nonempty(),
  related_slugs: z.array(z.string().min(1)).default([]),
});

export const staticPageFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  eyebrow: z.string().min(1),
  description: z.string().min(1),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
export type StaticPageFrontmatter = z.infer<typeof staticPageFrontmatterSchema>;
