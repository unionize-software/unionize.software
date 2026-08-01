import type { Metadata, Route } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { getUsStateResource, usStateResources } from "@/lib/jurisdictions/usStates";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamicParams = false;

export function generateStaticParams() {
  return usStateResources.map((state) => ({ code: state.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const state = getUsStateResource(code);

  return state
    ? {
        title: `${state.name} worker resources`,
        description: `Official labor, wage-and-hour, safety, discrimination, and public-sector research routes for workers in ${state.name}.`,
      }
    : {};
}

function ExternalRoute({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <Card className="bg-card/90">
      <CardHeader>
        <p className="eyebrow-label text-muted-foreground">{eyebrow}</p>
        <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        <a className="inline-flex items-center gap-2 font-bold text-primary hover:underline" href={href} rel="noreferrer" target="_blank">
          {linkLabel}
          <ArrowUpRight className="size-4" />
        </a>
      </CardContent>
    </Card>
  );
}

export default async function StateResourcePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const state = getUsStateResource(code);

  if (!state) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link className="breadcrumb-link inline-flex items-center gap-2" href={"/states" as Route}>
          <ArrowLeft className="size-4" />
          State directory
        </Link>
        <span className="text-muted-foreground">/</span>
        <span aria-current="page">{state.name}</span>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{state.code}</Badge>
          {state.kind === "federal-district" ? <Badge variant="outline">Federal district</Badge> : <Badge variant="outline">State</Badge>}
          <Badge variant="outline">Verified {state.provenance.lastVerified}</Badge>
        </div>
        <h1 className="display-title max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {state.name} worker-resource routes
        </h1>
        <p className="max-w-3xl text-[1.08rem] leading-8 text-foreground/82">
          Start with the official offices below. These links help you find the right forum; they do
          not determine whether a particular worker, employer, claim, or organizing activity is
          covered.
        </p>
      </header>

      <Card className="border-primary/25 bg-primary/7">
        <CardHeader>
          <Badge variant="outline" className="w-fit border-primary/35 text-primary">Read before relying</Badge>
          <CardTitle className="text-2xl tracking-tight">Agency route verified; legal interpretation still requires facts.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Filing deadlines, employee coverage, remedies, local ordinances, and public-sector rules
            can differ. Confirm the current primary law and the agency&apos;s instructions before acting.
          </p>
          <p>
            For organizing questions, titles such as contractor, supervisor, public employee, rail,
            airline, agricultural, or domestic worker can change the legal lane.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-5 md:grid-cols-2">
        <ExternalRoute
          eyebrow="State labor office"
          title={state.laborAgency.name}
          description="The U.S. Department of Labor lists this as the jurisdiction's state labor-office route. Use the federal directory link below to inspect the source record."
          href={state.laborAgency.url}
          linkLabel="Open state labor agency"
        />
        <ExternalRoute
          eyebrow="Source record"
          title="DOL state labor-office directory"
          description="The federal directory provides the state office name, contact information, and official website used in this dataset."
          href={state.laborAgency.directoryUrl}
          linkLabel="Verify the directory entry"
        />
        <ExternalRoute
          eyebrow="Wage and hour"
          title="Compare state and federal routes"
          description={state.wageAndHour.note}
          href={state.wageAndHour.stateLawOverviewUrl}
          linkLabel="Open DOL state-law topics"
        />
        <ExternalRoute
          eyebrow="Workplace safety"
          title={state.safety.label}
          description={state.safety.note}
          href={state.safety.officialUrl}
          linkLabel="Open official OSHA route"
        />
        <ExternalRoute
          eyebrow="Discrimination"
          title="EEOC and Fair Employment Practices Agencies"
          description={state.discrimination.note}
          href={state.discrimination.officialUrl}
          linkLabel="Open EEOC FEPA guidance"
        />
        <ExternalRoute
          eyebrow="Public sector — review required"
          title="Verify the exact employer and current state or local law"
          description={state.publicSector.note}
          href={state.publicSector.stateGovernmentUrl}
          linkLabel="Open official government index"
        />
      </section>

      <Card className="bg-card/80">
        <CardHeader>
          <Badge variant="outline" className="w-fit">Two useful cross-checks</Badge>
          <CardTitle className="text-xl tracking-tight">Federal wage office and public-sector overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap">
          <a className="font-bold text-primary underline-offset-4 hover:underline" href={state.wageAndHour.federalOfficeDirectoryUrl} rel="noreferrer" target="_blank">
            Find the federal Wage and Hour office
          </a>
          <span aria-hidden="true" className="hidden text-muted-foreground sm:inline">·</span>
          <a className="font-bold text-primary underline-offset-4 hover:underline" href={state.publicSector.overviewUrl} rel="noreferrer" target="_blank">
            Read the Congressional Research Service overview
          </a>
          <span aria-hidden="true" className="hidden text-muted-foreground sm:inline">·</span>
          <Link className="font-bold text-primary underline-offset-4 hover:underline" href="/resources/public-sector-workers-start-here">
            Use the public-sector worker guide
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
