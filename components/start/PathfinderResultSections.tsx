"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ClassificationSummary,
  ResourceRecommendation,
  ResultAction,
} from "@/lib/start/resultCopy";

export function PathfinderUrgentActions({ actions }: { actions: ResultAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="pathfinder-urgent-actions">
      <Card className="border-primary/30 bg-primary/7">
        <CardHeader>
          <p className="eyebrow-label text-primary">Higher risk</p>
          <CardTitle id="pathfinder-urgent-actions" className="text-2xl tracking-tight">
            Do this first
          </CardTitle>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            When retaliation or urgent support may be in the picture, lower exposure before trying
            to explain everything at once.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {actions.map((action) => (
            <PathfinderActionLink action={action} key={action.href} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export function PathfinderPrimaryRecommendation({
  recommendation,
}: {
  recommendation: ResourceRecommendation;
}) {
  return (
    <Card className="border-primary/25 bg-card/92">
      <CardHeader>
        <p className="eyebrow-label text-primary">Start here</p>
        <CardTitle className="text-3xl tracking-tight">{recommendation.title}</CardTitle>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {recommendation.reason}
        </p>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg" className="w-full justify-between sm:w-auto">
          <Link aria-label={`Open ${recommendation.title}`} href={recommendation.href as Route}>
            Read this first
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function PathfinderSignals({ signals }: { signals: ClassificationSummary[] }) {
  return (
    <Card className="bg-card/88">
      <CardHeader>
        <p className="eyebrow-label text-muted-foreground">Signals</p>
        <CardTitle className="text-2xl tracking-tight">What the pathfinder noticed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {signals.map((signal) => (
          <div key={signal.id} className="border-l-2 border-primary/45 py-1 pl-4">
            <p className="font-semibold leading-6">{signal.label}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{signal.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PathfinderMeaningCard({ body }: { body: string }) {
  return (
    <Card className="h-full bg-card/85">
      <CardHeader>
        <CardTitle className="text-xl">What this result does not mean</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

export function PathfinderGuideRecommendations({
  resources,
}: {
  resources: ResourceRecommendation[];
}) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="pathfinder-recommended-guides">
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle id="pathfinder-recommended-guides" className="text-2xl">
            Read next
          </CardTitle>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            These pages explain the nearby risks, work-mode mechanics, or status questions behind
            the result.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {resources.map((resource) => (
            <PathfinderGuideLink key={resource.href} resource={resource} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function PathfinderActionLink({ action }: { action: ResultAction }) {
  return (
    <Link
      className="interactive-card block rounded-xl border border-primary/25 bg-background/78 p-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      href={action.href as Route}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold leading-6 text-foreground">{action.label}</span>
        <ArrowRight aria-hidden="true" className="mt-1 size-4 flex-none text-primary" />
      </span>
      <span className="mt-2 block leading-6">{action.description}</span>
    </Link>
  );
}

function PathfinderGuideLink({ resource }: { resource: ResourceRecommendation }) {
  return (
    <Link
      className="interactive-card block rounded-xl border border-border bg-background/72 p-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      href={resource.href as Route}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold leading-6 text-foreground">{resource.title}</span>
        <ArrowRight aria-hidden="true" className="mt-1 size-4 flex-none text-primary" />
      </span>
      <span className="mt-2 block leading-6">{resource.reason}</span>
    </Link>
  );
}
