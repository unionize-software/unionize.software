"use client";

import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { UsStateResource } from "@/lib/jurisdictions/usStates";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function StateDirectory({ states }: { states: UsStateResource[] }) {
  const [query, setQuery] = useState("");
  const visibleStates = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return states;
    }

    return states.filter((state) =>
      [state.name, state.code, state.laborAgency.name, state.safety.label]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, states]);

  return (
    <section aria-labelledby="state-directory-heading" className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="state-search" className="text-sm font-bold text-foreground">
          Find a state or agency
        </label>
        <div className="relative max-w-xl">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="off"
            className="pl-9"
            id="state-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="California, WA, labor department, State Plan…"
            type="search"
            value={query}
          />
        </div>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {visibleStates.length} of {states.length} jurisdictions
        </p>
      </div>

      <div id="state-directory-heading" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleStates.map((state) => (
          <Link
            className="interactive-card flex min-h-44 flex-col rounded-xl border border-border bg-card/90 p-5"
            href={`/states/${state.code.toLowerCase()}` as Route}
            key={state.code}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow-label text-muted-foreground">{state.code}</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{state.name}</h2>
              </div>
              {state.kind === "federal-district" ? <Badge variant="outline">District</Badge> : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{state.laborAgency.name}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.11em] text-foreground/70">
              {state.safety.label}
            </p>
            <span className="card-action-line mt-auto pt-5 text-primary">
              Open state routes
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>

      {visibleStates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          No state matches that search. Try a state name, two-letter code, agency name, or
          &quot;State Plan.&quot;
        </p>
      ) : null}
    </section>
  );
}
