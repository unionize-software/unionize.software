"use client";

import Link from "next/link";
import type { Route } from "next";

import { ResultCard } from "@/components/start/ResultCard";
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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-primary">
          Start Here results
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {result.likelyPath}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{result.whyThisPath}</p>
        <div className="flex flex-wrap gap-2">
          {result.classifications.map((classification) => (
            <Badge key={classification} variant="outline">
              {classification}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ResultCard title="What not to do" items={result.whatNotToDo} />
        <ResultCard title="What to do in the next 72 hours" items={result.next72Hours} />
        <ResultCard title="Relevant guides" items={result.relevantResources.map((resource) => resource.title)} />
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl">Relevant resources</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {result.relevantResources.map((resource) => (
            <Button asChild key={resource.href} variant="outline">
              <Link href={resource.href as Route}>{resource.title}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>

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
