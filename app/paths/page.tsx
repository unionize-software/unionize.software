import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { ReadingPathList } from "@/components/content/ReadingPathList";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readingPaths } from "@/lib/content/readingPaths";

export default function PathsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground" aria-current="page">
          Paths
        </span>
      </nav>

      <SectionHeader
        eyebrow="Worker reading paths"
        title="Choose the route that matches the pressure workers are actually under."
        description="The wiki is useful only if people can find the right first pages. These paths turn the guide library into a few concrete routes through safety, status, issue guides, and next-step checklists."
      />

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <Card className="border-foreground/15 bg-card/90">
          <CardHeader>
            <Badge className="w-fit">How to read a path</Badge>
            <CardTitle className="text-2xl tracking-tight">
              The order matters: safety, facts, status, then tactics.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Start with the first page even if the issue guide looks more interesting. A worker
              under pressure usually needs to lower exposure and preserve facts before choosing a
              public move.
            </p>
            <p>
              Then move through the issue guide, status check, or campaign-stage page that matches
              the workplace. The path is not a script. It is a way to avoid skipping the boring
              parts that make later decisions safer.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Safety first
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              If you are unsure, begin with the safety basics page.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              It covers the shared floor for personal devices, personal accounts, clean notes, and
              avoiding easy pretexts for discipline.
            </p>
            <Button asChild size="lg" className="w-full justify-between sm:w-auto">
              <Link href={"/resources/safety-basics" as Route}>
                Open safety basics
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Paths"
          headingLevel={2}
          title="Use the smallest route that fits the situation."
          description="A stressed worker should not have to reverse-engineer the whole wiki. Pick a path, read the first two or three pages, then decide whether the situation needs more care."
        />
        <ReadingPathList paths={readingPaths} />
      </section>
    </div>
  );
}
