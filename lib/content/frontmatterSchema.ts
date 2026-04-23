import { z } from "zod";

export const guideFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  jurisdiction: z.string().min(1),
  legal_scope: z.string().min(1),
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  review_status: z.string().min(1),
  risk_level: z.string().min(1),
});

export const staticPageFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  eyebrow: z.string().min(1),
  description: z.string().min(1),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
export type StaticPageFrontmatter = z.infer<typeof staticPageFrontmatterSchema>;

