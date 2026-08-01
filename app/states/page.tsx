import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { stateResourceSources, usStateResources } from "@/lib/jurisdictions/usStates";
import { StateDirectory } from "@/components/states/StateDirectory";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "State worker-resource directory",
  description:
    "Official labor, wage-and-hour, workplace-safety, discrimination, and public-sector research routes for every U.S. state and the District of Columbia.",
};

export default function StatesPage() {
  const statePlanCount = usStateResources.filter(
    (state) => state.safety.coverage !== "federal",
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="State directory"
        title="Start with the agencies that actually serve your jurisdiction."
        description="Every state has a different administrative surface. This directory gives workers an official first route for wage-and-hour questions, workplace safety, discrimination, and public-sector research without pretending the agency list is a legal conclusion."
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-foreground/15 bg-card/92">
          <CardHeader>
            <Badge className="w-fit">What this is</Badge>
            <CardTitle className="text-2xl tracking-tight">A sourced routing layer, not fifty canned legal summaries.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              Open your jurisdiction to find its labor agency, the federal and state wage-and-hour
              routes, the correct OSHA lane, and the EEOC directory for state and local civil-rights
              agencies.
            </p>
            <p>
              Public-sector bargaining rights are deliberately marked for jurisdiction-specific
              review. Employer type, occupation, local law, exclusions, and recent amendments can
              all change the answer.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Coverage
            </Badge>
            <CardTitle className="text-2xl tracking-tight">All 50 states, plus D.C.</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-primary/15 bg-background/70 p-4">
              <p className="text-2xl font-semibold text-foreground">{usStateResources.length}</p>
              <p className="mt-1">jurisdictions</p>
            </div>
            <div className="rounded-xl border border-primary/15 bg-background/70 p-4">
              <p className="text-2xl font-semibold text-foreground">{statePlanCount}</p>
              <p className="mt-1">state OSHA plans</p>
            </div>
            <div className="col-span-2 rounded-xl border border-primary/15 bg-background/70 p-4">
              <p className="font-semibold text-foreground">Verified August 1, 2026</p>
              <p className="mt-1">Agency routes and OSHA classifications; legal-review gates remain visible.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <StateDirectory states={usStateResources} />

      <section className="space-y-5" id="method">
        <SectionHeader
          eyebrow="Method"
          headingLevel={2}
          title="The nationwide layer comes from official public directories."
          description="Each record carries a verification date and source identifiers so maintainers can audit or replace an upstream route without rewriting the page copy."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {stateResourceSources.map((source) => (
            <a
              className="interactive-card rounded-xl border border-border bg-card/85 p-5"
              href={source.url}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                {source.publisher}
              </p>
              <h3 className="mt-2 text-lg font-bold tracking-tight">{source.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.scope}</p>
              <span className="card-action-line mt-4 text-primary">
                Inspect source
                <ArrowRight className="size-4" />
              </span>
            </a>
          ))}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          Want the underlying model or a machine-readable route? See the{" "}
          <Link className="font-semibold text-foreground underline underline-offset-4" href="/tooling/mcp">
            MCP documentation
          </Link>{" "}
          or inspect the open-source dataset in the repository.
        </p>
      </section>
    </div>
  );
}
