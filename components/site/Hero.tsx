import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-6">
        <Badge className="w-fit rounded-full border-primary/25 bg-primary/10 px-4 py-2 text-[0.75rem] text-primary shadow-[0_10px_24px_rgba(179,36,0,0.08)]">
          A place to get oriented
        </Badge>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
            If something at work feels wrong, you do not have to figure it out alone.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            unionize.software is a public organizing wiki for U.S. private-sector software and
            game workers. It is here to help you understand what is happening, compare notes more
            safely, and figure out a sensible next step.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/resources">
              Browse the wiki
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/start">Optional pathfinder</Link>
          </Button>
        </div>
      </div>

      <Card className="self-start overflow-hidden border-primary/20 bg-card/85 lg:mt-5">
        <CardContent className="space-y-6 p-7 pt-10 sm:pt-11">
          <div className="flex items-center gap-3">
            <BookOpenText className="size-6 text-primary" />
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-muted-foreground">
              A few ground rules
            </p>
          </div>
          <ul className="space-y-4 text-[0.98rem] leading-8 text-muted-foreground">
            <li>Use a personal phone and personal email if you can.</li>
            <li>Do not use company chat, company email, or company devices for organizing.</li>
            <li>Start with facts, trusted coworkers, and one small next step.</li>
            <li>No analytics, session replay, or ad pixels.</li>
            <li>The pathfinder stays local to your device.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
