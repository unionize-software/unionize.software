import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EvidencePageCard = {
  href: Route;
  title: string;
  description: string;
};

const evidencePages = [
  {
    href: "/resources/software-worker-scale-and-leverage" as Route,
    title: "Workforce scale and leverage",
    description:
      "How many software workers there are in the United States and worldwide, what the official numbers do and do not measure, and why that matters strategically.",
  },
  {
    href: "/resources/why-software-workers-have-been-slow-to-unionize" as Route,
    title: "Why tech stayed weakly unionized",
    description:
      "A sober account of professional identity, entrepreneurial culture, fragmentation, and the conditions that kept worker identity weak for so long.",
  },
  {
    href: "/resources/what-collective-bargaining-can-change-for-software-workers" as Route,
    title: "What bargaining can change",
    description:
      "What the evidence says unions can change about wages, benefits, workplace rules, equality, and leverage, translated into software-worker terms.",
  },
] as const satisfies ReadonlyArray<EvidencePageCard>;

const evidenceStats = [
  {
    value: "1,693,800",
    label: "software developer jobs in the United States in 2024",
    source: "BLS",
  },
  {
    value: "48.4M",
    label: "developers worldwide, using SlashData's Q3 2025 estimate",
    source: "industry estimate",
  },
  {
    value: "3.7%",
    label: "union membership rate in U.S. computer and mathematical occupations in 2025",
    source: "BLS",
  },
] as const;

export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Evidence"
        title="A labor argument should rest on facts, not mythology."
        description="These pages exist for the moments when someone says software workers are too small, too scattered, too professional, or too comfortable to organize. The record is more useful than that."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-foreground/15 bg-card/90">
          <CardHeader>
            <Badge className="w-fit">How to use this section</Badge>
            <CardTitle className="text-2xl tracking-tight">
              Start here when a campaign needs context, not just instinct.
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              These pages are dated, sourced, and written to help workers puncture lazy assumptions.
              They are not here to turn statistics into chest-thumping. They are here to make
              strategy steadier.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Use the workforce page when people talk as if software work were a tiny niche.
            </p>
            <p>
              Use the history page when coworkers assume tech never organized because it could not,
              rather than because real obstacles kept worker identity thin.
            </p>
            <p>
              Use the bargaining page when someone asks what a union would materially change beyond
              slogans.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Three anchor facts
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              The workforce is large, strategically placed, and still under-organized.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {evidenceStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-primary/15 bg-background/76 p-4">
                <p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.label}</p>
                <p className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/80">
                  {stat.source}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {evidencePages.map((page) => (
          <Link key={page.href} href={page.href} className="block">
            <Card className="interactive-card h-full bg-card/88">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Evidence page
                </Badge>
                <CardTitle className="text-3xl tracking-tight">{page.title}</CardTitle>
                <CardDescription className="text-base">{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <span className="card-action-line text-primary">
                  Open page
                  <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <Card className="border-primary/20 bg-card/90">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Method note
          </Badge>
          <CardTitle className="text-2xl tracking-tight">
            Official counts and industry estimates are not the same thing.
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            The U.S. numbers in this section come from the Bureau of Labor Statistics. The global
            number is an industry estimate from SlashData, and the page says so plainly. When a
            number is approximate, dated, or narrower than the whole workforce, the copy should say
            that out loud.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
