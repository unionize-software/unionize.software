import type { Route } from "next";
import Link from "next/link";

import { Hero } from "@/components/site/Hero";

type EditorialLink = {
  href: Route;
  label: string;
  title: string;
  description: string;
};

const nextSteps = [
  {
    label: "01",
    title: "Name the shared problem",
    description:
      "Start with what changed: a policy, a layoff, a pay decision, a workload, or a new form of monitoring.",
    href: "/resources" as Route,
    linkLabel: "Find the closest guide",
  },
  {
    label: "02",
    title: "Preserve what matters",
    description:
      "Keep dates, policies, messages, and your own notes. Do not take material you are not allowed to access.",
    href: "/resources/what-to-preserve-checklist" as Route,
    linkLabel: "Use the preservation checklist",
  },
  {
    label: "03",
    title: "Talk to one trusted coworker",
    description:
      "Ask what they have noticed. Listen before pitching a solution or creating a large group chat.",
    href: "/resources/first-organizing-conversation-checklist" as Route,
    linkLabel: "Prepare for the conversation",
  },
] as const;

const fieldGuideLinks = [
  {
    label: "Issue guides",
    title: "Start with the workplace problem in front of you.",
    description:
      "Surveillance, layoffs, pay, burnout, discrimination, contractor status, retaliation, and more.",
    href: "/resources#issue-guides",
  },
  {
    label: "Rights and status",
    title: "Understand the basic legal frame without pretending it is simple.",
    description:
      "Protected activity, supervisor questions, contractors, vendors, exclusions, and safer off-ramps.",
    href: "/know-your-rights",
  },
  {
    label: "Working together",
    title: "Move from a private concern to a careful conversation.",
    description:
      "Workplace mapping, first conversations, remote teams, campaign stages, and common mistakes.",
    href: "/resources#campaign-stages",
  },
  {
    label: "Evidence",
    title: "Use numbers and history when someone says tech workers cannot organize.",
    description:
      "Workforce size, union density, bargaining leverage, and the conditions that keep software work fragmented.",
    href: "/evidence",
  },
] as const satisfies ReadonlyArray<EditorialLink>;

const toolingLinks = [
  { href: "/tooling/cli", label: "CLI" },
  { href: "/tooling/mcp", label: "MCP server" },
  { href: "/tooling/skills", label: "agent skill bundle" },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 sm:py-14 lg:gap-20 lg:px-8 lg:py-16">
      <Hero />

      <section
        aria-labelledby="next-step-heading"
        className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"
      >
        <div>
          <p className="eyebrow-label text-primary">A steadier way through</p>
          <h2
            id="next-step-heading"
            className="display-title mt-4 text-4xl font-semibold sm:text-5xl"
          >
            You do not need a perfect plan.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72">
            Most workplace problems feel individual until coworkers compare what changed. Start
            small enough to learn without creating avoidable risk.
          </p>
        </div>

        <ol className="border-b border-foreground/25">
          {nextSteps.map((step) => (
            <li
              key={step.label}
              className="grid gap-3 border-t border-foreground/25 py-6 sm:grid-cols-[3rem_1fr]"
            >
              <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-primary">
                {step.label}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2 max-w-2xl leading-7 text-foreground/68">{step.description}</p>
                <Link
                  className="text-link mt-4 inline-block text-sm font-semibold"
                  href={step.href}
                >
                  {step.linkLabel} →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-secondary-foreground/20 bg-secondary px-6 py-10 text-secondary-foreground sm:px-10 sm:py-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
        <div>
          <p className="eyebrow-label text-secondary-foreground/65">Not sure what fits?</p>
          <h2 className="display-title mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Answer a few questions without sending us your story.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-secondary-foreground/75">
            The optional pathfinder runs locally in your browser. Your answers stay on your device,
            and you can leave at any time for the full guide index.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 lg:mt-0 lg:items-end">
          <Link className="editorial-button editorial-button-light" href="/start">
            Use the private pathfinder →
          </Link>
          <Link
            className="text-link text-sm font-semibold text-secondary-foreground"
            href="/resources"
          >
            Browse all guides instead
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="field-guide-heading"
        className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"
      >
        <div>
          <p className="eyebrow-label text-primary">The field guide</p>
          <h2
            id="field-guide-heading"
            className="display-title mt-4 text-4xl font-semibold sm:text-5xl"
          >
            Organized around the work, not a content funnel.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72">
            Read only what helps. There are no accounts, feeds, points, or pressure to keep you on
            the site.
          </p>
        </div>

        <div className="border-b border-foreground/25">
          {fieldGuideLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block border-t border-foreground/25 py-6 hover:bg-foreground/[0.035] focus-visible:bg-foreground/[0.035] sm:px-2"
            >
              <p className="eyebrow-label text-primary">{item.label}</p>
              <h3 className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.03em] group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-2 max-w-3xl leading-7 text-foreground/65">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-foreground/25 pt-10 md:grid-cols-2 md:gap-12">
        <div>
          <p className="eyebrow-label text-primary">What this site will not do</p>
          <h2 className="display-title mt-4 text-3xl font-semibold sm:text-4xl">
            Turn a difficult moment into a data trail.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-foreground/68">
            No tracking scripts, advertising pixels, session replay, or LLM analysis of pathfinder
            answers. Read the code, privacy notes, and security model for yourself.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <Link className="text-link" href="/privacy">Privacy →</Link>
            <Link className="text-link" href="/security">Security →</Link>
            <a
              className="text-link"
              href="https://github.com/unionize-software/unionize-software-webapp"
              target="_blank"
              rel="noreferrer"
            >
              Source code ↗
            </a>
          </div>
        </div>

        <div className="border-t border-foreground/25 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <p className="eyebrow-label text-primary">Building with the guides?</p>
          <h2 className="display-title mt-4 text-3xl font-semibold sm:text-4xl">
            Use the corpus without scraping the website.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-foreground/68">
            The same public material is available through a{" "}
            {toolingLinks.map((item, index) => (
              <span key={item.href}>
                {index > 0 && (index === toolingLinks.length - 1 ? ", or " : ", ")}
                <Link className="text-link font-semibold text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </section>
    </div>
  );
}
