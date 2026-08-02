import type { Route } from "next";
import Link from "next/link";

import { Hero } from "@/components/site/Hero";

const beforeAct = [
  {
    title: "Move it off work systems",
    description:
      "Use a personal phone, personal email, and accounts your employer does not control.",
    href: "/resources/company-device-and-account-safety-checklist",
    linkLabel: "Check device safety",
  },
  {
    title: "Keep a clean record",
    description:
      "Write down dates, exact language, policy changes, and who was affected. Keep only material you may lawfully access.",
    href: "/resources/what-to-preserve-checklist",
    linkLabel: "See what to preserve",
  },
  {
    title: "Compare notes carefully",
    description:
      "Ask one trusted coworker what they noticed. Listen before you pitch a solution or open a large group chat.",
    href: "/resources/first-organizing-conversation-checklist",
    linkLabel: "Plan the first conversation",
  },
] as const;

const guideSections = [
  {
    label: "Problems at work",
    title: "Surveillance, layoffs, pay, burnout, discrimination, retaliation.",
    description: "Start with the pressure workers are already comparing.",
    href: "/resources#issue-guides",
  },
  {
    label: "Rights and status",
    title: "Protected activity, supervisors, contractors, vendors, exclusions.",
    description: "Understand the legal frame without pretending it is simple.",
    href: "/know-your-rights",
  },
  {
    label: "Working together",
    title: "First conversations, workplace mapping, remote teams, campaign stages.",
    description: "Move from a private concern to careful collective action.",
    href: "/resources#campaign-stages",
  },
  {
    label: "Evidence",
    title: "Workforce size, union density, bargaining leverage, labor history.",
    description: "Use sourced facts when someone says tech workers cannot organize.",
    href: "/evidence",
  },
] as const;

const standards = [
  ["Sources named", "Claims link back to research, public records, or primary material."],
  ["Limits stated", "Guides say what they can help with and what needs outside advice."],
  ["Privacy by default", "No accounts, ad pixels, analytics, or session replay."],
  ["Code in public", "The site, guide tooling, and security model can be inspected."],
] as const;

const toolingLinks = [
  { href: "/tooling/cli", label: "CLI" },
  { href: "/tooling/mcp", label: "MCP server" },
  { href: "/tooling/skills", label: "agent skill" },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-20 px-4 py-7 sm:px-6 sm:py-10 lg:gap-28 lg:px-10 lg:py-12">
      <Hero />

      <section
        aria-labelledby="before-act-heading"
        className="grid gap-10 lg:grid-cols-[minmax(16rem,0.6fr)_minmax(0,1.4fr)] lg:gap-20"
      >
        <div>
          <p className="field-kicker text-primary">Before you act</p>
          <h2 id="before-act-heading" className="section-title mt-4 max-w-[10ch]">
            Protect yourself while you get oriented.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-foreground/72">
            Use personal systems. Keep a clean timeline. Ask one person you trust what
            they have seen.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-3">
          {beforeAct.map((item) => (
            <article key={item.title} className="border-t-4 border-foreground pt-5">
              <h3 className="text-xl font-bold tracking-[-0.025em]">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-foreground/68">{item.description}</p>
              <Link
                className="text-link mt-5 inline-block text-sm font-bold"
                href={item.href as Route}
              >
                {item.linkLabel} &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="pathfinder-band">
        <div>
          <p className="field-kicker">Private routing</p>
          <h2 className="section-title mt-3 max-w-[14ch]">Not sure what this is yet?</h2>
        </div>
        <p className="max-w-xl text-lg leading-8">
          The pathfinder asks only enough to suggest a reading path. Your answers stay in
          this browser.
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:justify-end">
          <Link className="signal-button" href="/start">
            Use the pathfinder
          </Link>
          <Link className="font-bold underline underline-offset-4" href="/resources">
            See every guide
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="guide-index-heading"
        className="grid gap-10 lg:grid-cols-[minmax(16rem,0.6fr)_minmax(0,1.4fr)] lg:gap-20"
      >
        <div>
          <p className="field-kicker text-primary">The field guide</p>
          <h2 id="guide-index-heading" className="section-title mt-4 max-w-[9ch]">
            Read by problem, not in order.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-foreground/72">
            Each guide says what it is for, what it cannot tell you, and where its claims
            come from.
          </p>
        </div>

        <div className="guide-index">
          {guideSections.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="guide-index__item group"
            >
              <p className="field-kicker text-primary">{item.label}</p>
              <h3 className="mt-3 max-w-3xl text-2xl font-bold tracking-[-0.03em] group-hover:text-primary sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-foreground/65">
                {item.description}
              </p>
              <span aria-hidden="true" className="guide-index__arrow">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="standards-block" aria-labelledby="standards-heading">
        <div className="standards-block__lead">
          <p className="field-kicker text-accent">Editorial standards</p>
          <h2 id="standards-heading" className="section-title mt-4 max-w-[11ch]">
            Trust should be inspectable.
          </h2>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
            <Link className="text-link" href="/about">About</Link>
            <Link className="text-link" href="/privacy">Privacy</Link>
            <Link className="text-link" href="/security">Security</Link>
            <a
              className="text-link"
              href="https://github.com/unionize-software/unionize.software"
              target="_blank"
              rel="noreferrer"
            >
              Source code
            </a>
          </div>
        </div>

        <dl className="grid gap-8 sm:grid-cols-2">
          {standards.map(([term, description]) => (
            <div key={term}>
              <dt className="text-xl font-bold tracking-[-0.02em]">{term}</dt>
              <dd className="mt-2 max-w-sm leading-7 text-secondary-foreground/68">
                {description}
              </dd>
            </div>
          ))}
        </dl>

        <p className="standards-block__tooling">
          Building with the guides? Use the{" "}
          {toolingLinks.map((item, index) => (
            <span key={item.href}>
              {index > 0 && (index === toolingLinks.length - 1 ? ", or " : ", ")}
              <Link className="text-link font-bold" href={item.href}>
                {item.label}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>
    </div>
  );
}
