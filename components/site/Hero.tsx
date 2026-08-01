import type { Route } from "next";
import Link from "next/link";

type IssueLink = {
  href: string;
  label: string;
};

const issueLinks = [
  { label: "I was laid off or offered severance", href: "/resources/layoffs-severance" },
  { label: "I am being watched or tracked", href: "/resources/ai-surveillance-worker-data" },
  { label: "I am worried about retaliation", href: "/resources/retaliation-warning-signs" },
  {
    label: "My pay or promotion feels unfair",
    href: "/resources/pay-transparency-leveling-and-promotions",
  },
  {
    label: "I am burned out or always on call",
    href: "/resources/on-call-burnout-and-after-hours-work",
  },
  { label: "I want to organize with coworkers", href: "/organize" },
] as const satisfies ReadonlyArray<IssueLink>;

export function Hero() {
  return (
    <section className="grid gap-12 border-b border-foreground/25 pb-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-16 lg:pb-16">
      <div>
        <p className="eyebrow-label text-primary">Start with what is happening</p>
        <h1 className="display-title mt-5 max-w-3xl text-5xl font-semibold text-balance sm:text-6xl xl:text-7xl">
          What do you need right now?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/75">
          Pick the closest problem. You will get a plain-English guide, practical safety notes,
          and a smaller next step.
        </p>

        <nav aria-label="Choose a workplace problem" className="mt-8 border-b border-foreground/25">
          {issueLinks.map((issue) => (
            <Link
              key={issue.href}
              href={issue.href as Route}
              className="group flex items-center justify-between gap-6 border-t border-foreground/25 py-4 text-xl font-semibold tracking-[-0.025em] hover:bg-foreground/[0.035] hover:text-primary focus-visible:bg-foreground/[0.035] focus-visible:text-primary sm:px-2 sm:text-2xl"
            >
              <span>{issue.label}</span>
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-mono)] text-base text-primary transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <aside className="self-start border-t-4 border-primary pt-6 lg:mt-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        <p className="eyebrow-label text-primary">Before you start</p>
        <h2 className="display-title mt-4 text-3xl font-semibold sm:text-4xl">
          Keep organizing off company systems.
        </h2>
        <ol className="mt-7 space-y-5 text-base leading-7 text-foreground/78">
          <li>
            <span className="mr-3 font-[family-name:var(--font-mono)] text-xs text-primary">01</span>
            Use a personal phone and personal email when you can.
          </li>
          <li>
            <span className="mr-3 font-[family-name:var(--font-mono)] text-xs text-primary">02</span>
            Keep notes, searches, and conversations off company devices and accounts.
          </li>
          <li>
            <span className="mr-3 font-[family-name:var(--font-mono)] text-xs text-primary">03</span>
            Start with facts, one trusted coworker, and one small next step.
          </li>
        </ol>

        <div className="mt-8 border-t border-foreground/25 pt-6 text-sm leading-6 text-foreground/65">
          <p>
            No accounts. No analytics or session replay. The optional pathfinder keeps your
            answers on your device.
          </p>
          <div className="mt-5 flex flex-col items-start gap-3 font-semibold text-foreground">
            <Link className="text-link" href="/resources">Browse every guide →</Link>
            <Link className="text-link" href="/start">Use the private pathfinder →</Link>
          </div>
        </div>
      </aside>
    </section>
  );
}
