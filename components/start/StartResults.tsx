"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { ResultCard } from "@/components/start/ResultCard";
import { useStartWizardSession } from "@/components/start/StartWizardProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResourceRecommendation, ResultAction } from "@/lib/start/resultCopy";

function ActionLink({ action }: { action: ResultAction }) {
  return (
    <Link
      className="interactive-card block rounded-2xl border border-primary/25 bg-background/78 p-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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

function GuideRecommendationLink({
  resource,
  label,
}: {
  resource: ResourceRecommendation;
  label?: string;
}) {
  return (
    <Link
      className="interactive-card block rounded-2xl border border-border bg-background/72 p-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      href={resource.href as Route}
    >
      {label ? (
        <span className="eyebrow-label mb-2 block text-primary">{label}</span>
      ) : null}
      <span className="flex items-start justify-between gap-3">
        <span className="font-semibold leading-6 text-foreground">{resource.title}</span>
        <ArrowRight aria-hidden="true" className="mt-1 size-4 flex-none text-primary" />
      </span>
      <span className="mt-2 block leading-6">{resource.reason}</span>
    </Link>
  );
}

export function StartResults() {
  const { session, clearSession } = useStartWizardSession();

  if (!session) {
    return (
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">There is no saved result here.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This page only works right after the Start Here flow. If you refresh or open it directly,
            the result disappears by design.
          </p>
          <Button asChild>
            <Link href="/start">Run Start Here</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { result } = session;
  const relatedResources = result.relevantResources.filter(
    (resource) => resource.href !== result.primaryRecommendation.href,
  );

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-primary">
          Start Here results
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {result.likelyPath}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{result.whyThisPath}</p>
        <p className="max-w-3xl rounded-2xl border border-border bg-card/78 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {result.resultSafetyNote}
        </p>
        <div className="flex flex-wrap gap-2">
          {result.classificationSummaries.map((classification) => (
            <Badge key={classification.id} variant="outline">
              {classification.label}
            </Badge>
          ))}
        </div>
      </div>

      {result.urgentActions.length > 0 ? (
        <Card className="border-primary/30 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Higher risk
            </Badge>
            <CardTitle className="text-2xl tracking-tight">Do this first</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              When retaliation or urgent support may be in the picture, the safer move is to lower
              exposure before trying to explain everything at once.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            {result.urgentActions.map((action) => (
              <ActionLink action={action} key={action.href} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
        <Card className="border-primary/25 bg-card/92">
          <CardHeader>
            <Badge className="w-fit">Start with this page</Badge>
            <CardTitle className="text-3xl tracking-tight">
              {result.primaryRecommendation.title}
            </CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {result.primaryRecommendation.reason}
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full justify-between sm:w-auto">
              <Link
                aria-label={`Open ${result.primaryRecommendation.title}`}
                href={result.primaryRecommendation.href as Route}
              >
                Open recommended guide
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/88">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Signals
            </Badge>
            <CardTitle className="text-2xl tracking-tight">What the pathfinder noticed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.classificationSummaries.map((classification) => (
              <div key={classification.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="font-semibold leading-6">{classification.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {classification.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard title="What to do in the next 72 hours" items={result.next72Hours} />
        <ResultCard title="What not to do" items={result.whatNotToDo} />
        <Card className="h-full bg-card/85">
          <CardHeader>
            <CardTitle className="text-xl">What this result does not mean</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">{result.whatThisDoesNotMean}</p>
          </CardContent>
        </Card>
      </div>

      {relatedResources.length > 0 ? (
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-2xl">Recommended guides</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              These are secondary pages that explain the nearby risks, work-mode mechanics, or
              legal-status questions behind the result.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {relatedResources.map((resource) => (
              <GuideRecommendationLink key={resource.href} resource={resource} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/start">Run again</Link>
        </Button>
        <Button
          onClick={() => {
            clearSession();
          }}
          type="button"
          variant="outline"
        >
          Clear result
        </Button>
      </div>
    </div>
  );
}
