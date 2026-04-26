"use client";

import Link from "next/link";

import { ResultCard } from "@/components/start/ResultCard";
import {
  PathfinderGuideRecommendations,
  PathfinderMeaningCard,
  PathfinderPrimaryRecommendation,
  PathfinderSignals,
  PathfinderUrgentActions,
} from "@/components/start/PathfinderResultSections";
import { useStartWizardSession } from "@/components/start/StartWizardProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <p className="max-w-3xl rounded-xl border border-border bg-card/78 px-4 py-3 text-sm leading-6 text-muted-foreground">
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

      <PathfinderUrgentActions actions={result.urgentActions} />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
        <PathfinderPrimaryRecommendation recommendation={result.primaryRecommendation} />
        <PathfinderSignals signals={result.classificationSummaries} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard title="What to do in the next 72 hours" items={result.next72Hours} />
        <ResultCard title="What not to do" items={result.whatNotToDo} />
        <PathfinderMeaningCard body={result.whatThisDoesNotMean} />
      </div>

      <PathfinderGuideRecommendations resources={relatedResources} />

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
