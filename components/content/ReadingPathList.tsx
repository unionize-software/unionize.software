import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import type { ReadingPath } from "@/lib/content/readingPaths";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReadingPathList({ paths }: { paths: readonly ReadingPath[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {paths.map((path) => (
        <Card key={path.id} id={path.id} className="bg-card/92">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="w-fit">
                Reading path
              </Badge>
              <p className="eyebrow-label text-muted-foreground">{path.steps.length} steps</p>
            </div>
            <CardTitle className="text-2xl tracking-tight">{path.title}</CardTitle>
            <p className="text-sm leading-7 text-muted-foreground">{path.description}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="border-l-2 border-primary/45 py-1 pl-4">
              <p className="text-sm font-semibold text-foreground">Use when</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{path.useWhen}</p>
            </div>
            <ol className="space-y-3">
              {path.steps.map((step, index) => (
                <li key={step.href}>
                  <Link
                    href={step.href as Route}
                    className="interactive-card group grid gap-3 rounded-[8px] border border-border bg-background/72 p-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full border border-primary/25 bg-primary/8 font-[family-name:var(--font-mono)] text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                        {step.label}
                      </span>
                      <span className="mt-1 block font-semibold leading-6 text-foreground">
                        {step.title}
                      </span>
                      <span className="mt-2 block leading-6">{step.description}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-primary sm:mt-1"
                    />
                  </Link>
                </li>
              ))}
            </ol>
            <div className="rounded-[8px] border border-primary/20 bg-primary/7 px-4 py-3 text-sm leading-7 text-muted-foreground">
              <span className="font-semibold text-foreground">Caution: </span>
              {path.caution}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
