import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import {
  guidePageTypeLabels,
  guideSourceKindLabels,
  guideSourceStatusLabels,
} from "@/lib/content/contentModel";
import { renderMdx } from "@/lib/content/mdx";
import { getGuideBySlug, getGuides, getGuideSlugs } from "@/lib/content/getGuides";
import { extractGuideHeadings, guideHasSourcesSection } from "@/lib/content/guideStructure";
import { getGuideResourceTags } from "@/lib/content/resourceTags";
import { getRelatedGuidesForGuide, getWikiSectionsForGuide } from "@/lib/content/wiki";
import { GuideLinkCard } from "@/components/content/GuideLinkCard";
import { GuideUseNote } from "@/components/content/GuideUseNote";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamicParams = false;

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const guides = await getGuides();
  const content = await renderMdx(guide.body);
  const wikiSections = getWikiSectionsForGuide(guides, guide.slug);
  const relatedGuides = getRelatedGuidesForGuide(guides, guide.slug);
  const resourceTags = getGuideResourceTags(guide.slug);
  const headings = extractGuideHeadings(guide.body).filter((heading) => heading.id !== "sources");
  const hasSourcesSection = guideHasSourcesSection(guide.body);
  const hasStructuredSources = guide.sources.length > 0;
  const hasAnySources = hasStructuredSources || hasSourcesSection;
  const primarySection = wikiSections[0];
  const pageType = guidePageTypeLabels[guide.page_type];
  const sourceStatus = guideSourceStatusLabels[guide.source_status];
  const formattedReviewDate = formatReviewDate(guide.last_reviewed);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/resources" className="breadcrumb-link">
            Wiki home
          </Link>
          {primarySection ? (
            <>
              <span className="text-muted-foreground">/</span>
              <Link href={`/resources#${primarySection.id}`} className="breadcrumb-link">
                {primarySection.title}
              </Link>
            </>
          ) : null}
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground" aria-current="page">
            {guide.title}
          </span>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{pageType}</Badge>
          <Badge variant="outline">{guide.category}</Badge>
          {resourceTags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.label}
            </Badge>
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="display-title max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {guide.title}
          </h1>
          <p className="max-w-3xl text-[1.08rem] leading-8 text-foreground/82 sm:text-[1.15rem]">
            {guide.excerpt}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 meta-line">
            <span>{guide.jurisdiction}</span>
            <span>Last reviewed {formattedReviewDate}</span>
            <span>{guide.review_status.replace(/-/g, " ")}</span>
            <span>{guide.risk_level} risk</span>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{guide.legal_scope}</p>
        </div>
      </div>

      <GuideUseNote
        formattedReviewDate={formattedReviewDate}
        legalScope={guide.legal_scope}
        notFor={guide.not_for}
        riskLevel={guide.risk_level}
        sourceStatus={sourceStatus}
        whenToUse={guide.when_to_use}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <Card className="bg-card/92">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="w-fit">
                {pageType}
              </Badge>
              {primarySection ? (
                <p className="eyebrow-label text-muted-foreground">{primarySection.title}</p>
              ) : null}
            </div>
            <CardTitle className="text-2xl tracking-tight">Read the page, then use the rail.</CardTitle>
          </CardHeader>
          <CardContent>
            <article data-prose className="max-w-none">
              {content}
            </article>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="bg-card/90">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Page facts
              </Badge>
              <CardTitle className="text-xl tracking-tight">Use this page as reference, not as a script.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Page type</p>
                <p>{pageType}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Category</p>
                <p>{guide.category}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Risk level</p>
                <p>{guide.risk_level}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Jurisdiction</p>
                <p>{guide.jurisdiction}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">When to use</p>
                <p>{guide.when_to_use}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Not for</p>
                <p>{guide.not_for}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Last reviewed</p>
                <p>{formattedReviewDate}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Review status</p>
                <p>{guide.review_status}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Source footing</p>
                <p>{sourceStatus}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Source list</p>
                <p>
                  {hasStructuredSources
                    ? `${guide.sources.length} structured source${guide.sources.length === 1 ? "" : "s"}`
                    : hasSourcesSection
                      ? "Listed in page body"
                      : "Not yet added to this page"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Legal scope</p>
                <p>{guide.legal_scope}</p>
              </div>
            </CardContent>
          </Card>

          {headings.length > 0 || hasAnySources ? (
            <Card className="bg-card/82">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  On this page
                </Badge>
                <CardTitle className="text-xl tracking-tight">On this page</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">
                  Jump to the section you need instead of skimming the whole page cold.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="toc-link"
                    data-depth={heading.depth}
                  >
                    <span className="toc-link-bullet" />
                    <span className="text-sm leading-6">{heading.title}</span>
                  </a>
                ))}
                {hasAnySources ? (
                  <a href="#sources" className="toc-link" data-depth={2}>
                    <span className="toc-link-bullet" />
                    <span className="text-sm leading-6">Sources</span>
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {hasStructuredSources ? (
            <Card className="bg-card/80" id="sources">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Sources
                </Badge>
                <CardTitle className="text-xl tracking-tight">Source footing</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">
                  These are the pages this guide leans on for its dated claims and legal footing.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {guide.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    rel="noreferrer"
                    target="_blank"
                    className="interactive-card block rounded-xl border border-border bg-background/72 px-4 py-4 text-sm text-muted-foreground"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{guideSourceKindLabels[source.kind]}</Badge>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground/80">
                        {source.publisher}
                      </span>
                    </div>
                    <p className="mt-3 font-semibold leading-6 text-foreground">{source.title}</p>
                    {source.note ? <p className="mt-2 leading-6">{source.note}</p> : null}
                    <span className="card-action-line mt-4 text-primary">
                      Open source
                      <ArrowRight className="size-4" />
                    </span>
                  </a>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {wikiSections.length > 0 ? (
            <Card className="bg-card/80">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Appears in
                </Badge>
                <CardTitle className="text-xl tracking-tight">Wiki sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {wikiSections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/resources#${section.id}`}
                    className="interactive-card block rounded-xl border border-border bg-background/72 px-4 py-4 text-sm text-muted-foreground"
                  >
                    <p className="font-semibold text-foreground">{section.title}</p>
                    <p className="mt-1">{section.description}</p>
                    <span className="card-action-line mt-4 text-primary">
                      Browse section
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {relatedGuides.length > 0 ? (
            <Card className="bg-card/80">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Keep reading
                </Badge>
                <CardTitle className="text-xl tracking-tight">Related pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedGuides.map((relatedGuide) => (
                  <GuideLinkCard
                    actionLabel="Read related guide"
                    description={relatedGuide.excerpt}
                    href={`/resources/${relatedGuide.slug}`}
                    key={relatedGuide.slug}
                    pageType={relatedGuide.page_type}
                    title={relatedGuide.title}
                  />
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
