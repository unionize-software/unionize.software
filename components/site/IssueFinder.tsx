"use client";

import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

const issues = [
  {
    title: "Layoff or severance",
    summary: "Before you sign: notice, severance, selection, and what to preserve.",
    href: "/resources/layoffs-severance",
    keywords: "laid off fired termination reorganization reorg warn pip performance",
  },
  {
    title: "Workplace surveillance",
    summary: "Monitoring, worker data, keystrokes, and safer ways to compare notes.",
    href: "/resources/ai-surveillance-worker-data",
    keywords: "watched tracked monitoring slack ai data privacy keystroke telemetry",
  },
  {
    title: "Retaliation",
    summary: "Warning signs, documentation, and when to get outside help.",
    href: "/resources/retaliation-warning-signs",
    keywords: "threatened discipline warning fired schedule manager complaint",
  },
  {
    title: "Pay or promotion",
    summary: "Opaque levels, raises, ratings, and patterns across a team.",
    href: "/resources/pay-transparency-leveling-and-promotions",
    keywords: "salary compensation wage level raise performance review unfair",
  },
  {
    title: "Burnout or on-call",
    summary: "Workload, after-hours expectations, staffing, and shared demands.",
    href: "/resources/on-call-burnout-and-after-hours-work",
    keywords: "crunch overtime pager workload hours understaffed exhaustion",
  },
  {
    title: "Organizing with coworkers",
    summary: "Start one careful conversation before you start a group chat.",
    href: "/organize",
    keywords: "union coworkers conversation campaign workplace mapping collective",
  },
] as const;

export function IssueFinder() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return issues;
    }

    return issues.filter((issue) => {
      const searchable = [issue.title, issue.summary, issue.keywords].join(" ").toLowerCase();
      return words.every((word) => searchable.includes(word));
    });
  }, [query]);

  return (
    <div className="issue-finder">
      <div className="issue-finder__intro">
        <div>
          <p className="field-kicker text-accent">For software and game workers</p>
          <h1 id="home-heading" className="issue-finder__title">
            Describe what changed at work.
          </h1>
        </div>
        <div className="issue-finder__privacy">
          <p className="text-sm leading-6 text-primary-foreground/76">
            <strong className="text-primary-foreground">Your words stay here.</strong>{" "}
            Nothing you type is sent or saved.
          </p>
        </div>
      </div>

      <label className="sr-only" htmlFor="workplace-issue">
        Describe what changed at work
      </label>
      <input
        id="workplace-issue"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={'Try “severance,” “monitoring,” “promotion,” or “retaliation”'}
        autoComplete="off"
        className="issue-finder__input"
      />

      <p className="sr-only" aria-live="polite">
        {matches.length} {matches.length === 1 ? "guide" : "guides"} shown
      </p>

      {matches.length > 0 ? (
        <div className="issue-finder__results">
          {matches.map((issue) => (
            <Link
              key={issue.href}
              href={issue.href as Route}
              className="issue-finder__result group"
            >
              <span>
                <span className="block text-lg font-bold sm:text-xl">
                  {issue.title}
                </span>
                <span className="mt-1 block max-w-2xl text-sm leading-6 text-primary-foreground/68">
                  {issue.summary}
                </span>
              </span>
              <span aria-hidden="true" className="issue-finder__arrow">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-primary-foreground px-5 py-6 text-foreground">
          <p className="font-bold">No close match yet.</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Try a broader word, or open the complete guide index.
          </p>
          <Link className="text-link mt-4 inline-block font-bold" href="/resources">
            Browse every guide &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
