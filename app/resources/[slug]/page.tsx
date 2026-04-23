import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { renderMdx } from "@/lib/content/mdx";
import { getGuideBySlug, getGuides, getGuideSlugs } from "@/lib/content/getGuides";
import { getGuideResourceTags } from "@/lib/content/resourceTags";
import { getRelatedGuidesForGuide, getWikiSectionsForGuide } from "@/lib/content/wiki";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamicParams = false;

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

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/resources" className="underline-offset-4 hover:text-foreground hover:underline">
            Wiki home
          </Link>
          <span>/</span>
          <span>{guide.title}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{guide.category}</Badge>
          <Badge variant="outline">{guide.jurisdiction}</Badge>
          <Badge variant="outline">{guide.review_status}</Badge>
          <Badge variant="outline">Reviewed {guide.last_reviewed}</Badge>
          {resourceTags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.label}
            </Badge>
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
            {guide.title}
          </h1>
          <p className="text-lg text-muted-foreground">{guide.legal_scope}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <Card className="bg-card/92">
          <CardHeader>
            <CardTitle>Guide</CardTitle>
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
                Page details
              </Badge>
              <CardTitle className="text-xl tracking-tight">Use this page as reference, not as a script.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Risk level</p>
                <p>{guide.risk_level}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Jurisdiction</p>
                <p>{guide.jurisdiction}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Last reviewed</p>
                <p>{guide.last_reviewed}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Review status</p>
                <p>{guide.review_status}</p>
              </div>
            </CardContent>
          </Card>

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
                    className="interactive-card block rounded-2xl border border-border bg-background/72 px-4 py-4 text-sm text-muted-foreground"
                  >
                    <p className="font-semibold text-foreground">{section.title}</p>
                    <p className="mt-1">{section.description}</p>
                    <span className="card-action-line mt-4 text-primary">
                      Open section
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
                  <Link
                    key={relatedGuide.slug}
                    href={`/resources/${relatedGuide.slug}`}
                    className="interactive-card block rounded-2xl border border-border bg-background/72 px-4 py-4 text-sm text-muted-foreground"
                  >
                    <p className="font-semibold text-foreground">{relatedGuide.title}</p>
                    <p className="mt-1">{relatedGuide.excerpt}</p>
                    <span className="card-action-line mt-4 text-primary">
                      Open guide
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
