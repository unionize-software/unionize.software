import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getGuides } from "@/lib/content/getGuides";
import { resourcesSearchIndexPath } from "@/lib/content/searchIndex";
import { buildWikiSections } from "@/lib/content/wiki";
import { ResourceSearch } from "@/components/content/ResourceSearch";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResourcesPage() {
  const guides = await getGuides();
  const wikiSections = buildWikiSections(guides);
  const guideCount = guides.length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Wiki"
        title="A worker-organizing wiki built to help people get oriented and get steadier."
        description="Browse by issue, work mode, worker status, or campaign stage. The point is to help workers understand what they are looking at, compare notes more carefully, and make a better next move."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-foreground/15 bg-card/90">
          <CardHeader>
            <Badge className="w-fit">How to use this</Badge>
            <CardTitle className="text-2xl tracking-tight">
              Start with the page that sounds most like your actual problem.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              If workers are dealing with surveillance, layoffs, burnout, promotions, exclusion, or
              contractor confusion, begin there.
            </p>
            <p>
              Then open the work-mode and campaign-stage pages so the tactic matches the workplace
              you actually have, not the one you wish you had.
            </p>
            <p>
              If a coworker thinks software workers are too scattered, too well paid, or too
              professional to organize, the evidence pages are the right place to slow that claim
              down.
            </p>
            <p>
              Use checklists and reference pages when you need something shorter, calmer, and easier
              to share with one trusted coworker.
            </p>
            <p>
              If the main U.S. private-sector lane does not fit because the workplace is public-sector,
              outside the United States, or split across unclear statuses, start with the off-ramp pages
              instead of forcing the wrong frame.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Wiki map
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              Built as open reference, checklists, and stage-by-stage guidance.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The wiki is organized by issue, work mode, worker status, campaign stage, and quick
              checklists. That makes it easier to move from &quot;what is happening?&quot; to
              &quot;what do we do next?&quot; without jumping straight to a dramatic move.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-primary/15 bg-background/70 p-4">
                <p className="text-2xl font-semibold text-foreground">{guideCount}</p>
                <p className="mt-1 text-sm">guides and checklists</p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-background/70 p-4">
                <p className="text-2xl font-semibold text-foreground">{wikiSections.length}</p>
                <p className="mt-1 text-sm">browse sections</p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-background/70 p-4">
                <p className="text-2xl font-semibold text-foreground">0</p>
                <p className="mt-1 text-sm">tracking scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Search the wiki"
          headingLevel={2}
          title="Search across guides without sending the query anywhere."
          description="Use search when you know the problem but not the page name. Results come from a static local index, so the query stays on the site."
        />
        <ResourceSearch guides={guides} searchIndexPath={resourcesSearchIndexPath} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="bg-card/90">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Browse by section
              </Badge>
              <CardTitle className="text-xl tracking-tight">
                Jump straight to the right shelf.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {wikiSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="interactive-card block rounded-2xl border border-border bg-background/70 px-4 py-4"
                >
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {section.guides.length} pages
                  </p>
                  <span className="card-action-line mt-4 text-primary">
                    Jump to section
                    <ArrowRight className="size-4" />
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/80">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Page types
              </Badge>
              <CardTitle className="text-xl tracking-tight">
                Use the shortest page that does the job.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Playbooks</span> explain the
                problem, the organizing angle behind it, and what kind of next move the page is
                good for.
              </p>
              <p>
                <span className="font-semibold text-foreground">Checklists</span> are for moments
                when people need a calmer, faster reference.
              </p>
              <p>
                <span className="font-semibold text-foreground">Reference pages</span> help when
                worker status, exclusions, or labor terms are unclear.
              </p>
              <p>
                <span className="font-semibold text-foreground">Evidence pages</span> are for
                moments when workers need numbers, history, and a sober case for why collective
                bargaining can matter in software.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {wikiSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <Card className="bg-card/92">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="w-fit">
                      {section.guides.length} pages
                    </Badge>
                    <p className="eyebrow-label text-muted-foreground">
                      {section.id.replace(/-/g, " ")}
                    </p>
                  </div>
                  <CardTitle className="text-3xl tracking-tight">{section.title}</CardTitle>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {section.description}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {section.guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      className="interactive-card block rounded-2xl border border-border bg-background/72 p-5"
                      href={`/resources/${guide.slug}`}
                    >
                      <p className="font-semibold text-foreground">{guide.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {guide.excerpt}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                        {guide.category}
                      </p>
                      <span className="card-action-line mt-4 text-primary">
                        Open guide
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
