import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HubActionLink = {
  href: Route;
  title: string;
  description: string;
  cta?: string;
  meta?: string;
};

type HubInfoCard = {
  title: string;
  description: string;
};

type HubPageSection<T> = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: readonly T[];
  columns?: 1 | 2 | 3;
};

type HubPageNote = {
  badge?: string;
  title: string;
  description: string;
  tone?: "accent" | "ink";
};

export type HubPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  overview: {
    badge?: string;
    title: string;
    body: readonly string[];
  };
  startHere: {
    badge?: string;
    title: string;
    description?: string;
    links: readonly HubActionLink[];
    columns?: 1 | 2 | 3;
  };
  ideaSection?: HubPageSection<HubInfoCard>;
  laneSection?: HubPageSection<HubInfoCard>;
  relatedSection?: HubPageSection<HubActionLink>;
  note?: HubPageNote;
};

const gridColumns = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
} as const;

function HubPageLinks({
  links,
  columns = 2,
}: {
  links: readonly HubActionLink[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <div className={cn("grid gap-4", gridColumns[columns])}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="interactive-card block rounded-2xl border border-border bg-background/72 p-5"
        >
          <p className="font-semibold text-foreground">{link.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{link.description}</p>
          {link.meta ? (
            <p className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/80">
              {link.meta}
            </p>
          ) : null}
          <span className="card-action-line mt-4 text-primary">
            {link.cta ?? "Open page"}
            <ArrowRight className="size-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function HubInfoGrid({
  items,
  columns = 3,
}: {
  items: readonly HubInfoCard[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <div className={cn("grid gap-4", gridColumns[columns])}>
      {items.map((item) => (
        <Card key={item.title} className="bg-card/88">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {item.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HubSectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="eyebrow-label text-primary">{eyebrow}</p> : null}
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function HubPage({
  eyebrow,
  title,
  description,
  overview,
  startHere,
  ideaSection,
  laneSection,
  relatedSection,
  note,
}: HubPageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" aria-current="page">
          {eyebrow}
        </span>
      </nav>

      <SectionHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <Card className="border-foreground/15 bg-card/90">
          <CardHeader>
            <Badge className="w-fit">{overview.badge ?? "How to use this section"}</Badge>
            <CardTitle className="text-2xl tracking-tight">{overview.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            {overview.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              {startHere.badge ?? "Start here"}
            </Badge>
            <CardTitle className="text-2xl tracking-tight">{startHere.title}</CardTitle>
            {startHere.description ? (
              <CardDescription className="text-base">{startHere.description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            <HubPageLinks links={startHere.links} columns={startHere.columns ?? 1} />
          </CardContent>
        </Card>
      </div>

      {ideaSection ? (
        <section className="space-y-5">
          <HubSectionIntro
            eyebrow={ideaSection.eyebrow}
            title={ideaSection.title}
            description={ideaSection.description}
          />
          <HubInfoGrid items={ideaSection.items} columns={ideaSection.columns ?? 3} />
        </section>
      ) : null}

      {laneSection ? (
        <section className="space-y-5">
          <HubSectionIntro
            eyebrow={laneSection.eyebrow}
            title={laneSection.title}
            description={laneSection.description}
          />
          <HubInfoGrid items={laneSection.items} columns={laneSection.columns ?? 3} />
        </section>
      ) : null}

      {relatedSection ? (
        <section className="space-y-5">
          <HubSectionIntro
            eyebrow={relatedSection.eyebrow}
            title={relatedSection.title}
            description={relatedSection.description}
          />
          <HubPageLinks links={relatedSection.items} columns={relatedSection.columns ?? 2} />
        </section>
      ) : null}

      {note ? (
        <Card
          className={cn(
            note.tone === "ink" ? "paper-panel-ink" : "border-primary/20 bg-card/90",
          )}
        >
          <CardHeader>
            <Badge
              variant="outline"
              className={cn(
                "w-fit",
                note.tone === "ink"
                  ? "border-secondary-foreground/30 text-secondary-foreground"
                  : "",
              )}
            >
              {note.badge ?? "Note"}
            </Badge>
            <CardTitle
              className={cn(
                "text-2xl tracking-tight",
                note.tone === "ink" ? "text-secondary-foreground" : "",
              )}
            >
              {note.title}
            </CardTitle>
            <CardDescription
              className={cn(
                "text-base",
                note.tone === "ink" ? "text-secondary-foreground/82" : "",
              )}
            >
              {note.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}
