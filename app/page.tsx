import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ListChecks, ShieldCheck } from "lucide-react";

import { Hero } from "@/components/site/Hero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pillars = [
  {
    title: "Read the issue guide first",
    description:
      "Start with the closest match to the actual workplace problem instead of waiting for someone else to interpret it for you.",
    icon: ShieldCheck,
  },
  {
    title: "Use checklists and reference pages",
    description:
      "Keep the next move small and practical: preserve facts, have one careful conversation, and avoid obvious disciplinary traps.",
    icon: ListChecks,
  },
  {
    title: "Match the strategy to the workplace",
    description:
      "Remote, hybrid, and in-person teams need different mechanics. The site should help people learn that difference, not hide it.",
    icon: BookOpenText,
  },
];

type ToolingCard = {
  title: string;
  href: Route;
  description: string;
};

const toolingCards = [
  {
    title: "CLI",
    href: "/tooling/cli",
    description:
      "Read guides, search by issue, and run the pathfinder from the terminal without scraping pages.",
  },
  {
    title: "MCP Server",
    href: "/tooling/mcp",
    description:
      "Expose the guide corpus, prompts, and pathfinder logic to agents through a local MCP server.",
  },
  {
    title: "OpenClaw Skills",
    href: "/tooling/skills",
    description:
      "Ship a reusable skill pack so agents approach organizing questions with the right safety boundaries.",
  },
] as const satisfies ReadonlyArray<ToolingCard>;

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-foreground/15 bg-card/90">
          <CardHeader>
            <Badge className="w-fit">What you will find here</Badge>
            <CardTitle className="max-w-2xl text-3xl tracking-tight">
              Plain-English guidance for workers trying to make sense of a workplace problem.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-muted-foreground">
              Some people arrive here because of surveillance. Some because of layoffs, pay,
              burnout, or retaliation. The point is to help you get oriented without acting rashly
              or handing the site a detailed story about your workplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/75 p-5">
              <p className="font-medium">What you can do here</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>
                  Read{" "}
                  <Link href="/resources#issue-guides" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    issue guides
                  </Link>
                  ,{" "}
                  <Link href="/know-your-rights" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    rights explainers
                  </Link>
                  , and{" "}
                  <Link href="/resources#campaign-stages" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    campaign-stage pages
                  </Link>
                  .
                </li>
                <li>
                  Use{" "}
                  <Link href="/resources#checklists-tools" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    checklists
                  </Link>{" "}
                  for documentation,{" "}
                  <Link href="/resources/first-organizing-conversation-checklist" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    first conversations
                  </Link>
                  , and{" "}
                  <Link href="/resources/what-not-to-do-checklist" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    common mistakes
                  </Link>
                  .
                </li>
                <li>
                  Browse by{" "}
                  <Link href="/resources#work-modes" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    work mode
                  </Link>
                  : in-person, hybrid, or remote/distributed.
                </li>
                <li>
                  Use the{" "}
                  <Link href="/evidence" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    evidence pages
                  </Link>{" "}
                  when you need numbers, history, and a steadier answer to the claim that software
                  workers cannot organize.
                </li>
                <li>
                  Use the optional local-only{" "}
                  <Link href="/start" className="text-foreground underline decoration-primary/45 underline-offset-4 hover:text-primary">
                    pathfinder
                  </Link>{" "}
                  if you want a narrower route in.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background/75 p-5">
              <p className="font-medium">What this site is not</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Chat, forums, boards, and campaign CRM</li>
                <li>Tracking scripts or growth analytics</li>
                <li>LLMs over worker intake or wizard data</li>
                <li>Advice that tries to rush people into dramatic or risky moves</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/7">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-primary/35 text-primary">
              Start here
            </Badge>
            <CardTitle className="text-2xl tracking-tight">
              If you already know the problem, go straight to the closest guide.
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              You do not need to fill anything out. Start with the issue guide that matches what is
              happening, then move to the checklist or reference page that fits your situation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild size="lg" className="w-full justify-between">
              <Link href="/resources">
                Browse issue guides
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full justify-between">
              <Link href="/start">
                Use optional pathfinder
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="How to use the wiki"
          headingLevel={2}
          title="Most people do not need a perfect plan. They need the right next page."
          description="Start with the problem in front of you. Then look at the work mode, the worker-status questions, and the checklist or reference page that helps you make the next move more carefully."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="border-border/80 bg-card/85">
              <CardHeader>
                <pillar.icon className="size-8 text-primary" />
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {pillar.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Special tools"
          headingLevel={2}
          title="The site also ships agent-ready tooling, not just pages."
          description="If people want to bring the guide corpus into their own terminals and agents, there is a cleaner way to do that than scraping rendered HTML."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {toolingCards.map((card) => (
            <Link key={card.href} href={card.href} className="block">
              <Card className="interactive-card h-full bg-card/88">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    Tooling
                  </Badge>
                  <CardTitle className="text-3xl">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-1">
                  <span className="card-action-line text-primary">
                    Open page
                    <ArrowRight className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="self-start bg-card/90">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Browse the wiki</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              className="interactive-card block rounded-2xl border border-border bg-background/70 p-4"
              href="/resources#issue-guides"
            >
              <p className="font-semibold">Issue guides</p>
              <p className="mt-2 text-sm text-muted-foreground">
                AI surveillance, layoffs, pay, burnout, discrimination, contractor questions, and
                other concrete workplace problems.
              </p>
              <span className="card-action-line mt-4 text-primary">
                Open section
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              className="interactive-card block rounded-2xl border border-border bg-background/70 p-4"
              href="/resources#work-modes"
            >
              <p className="font-semibold">Work modes</p>
              <p className="mt-2 text-sm text-muted-foreground">
                In-person, hybrid, and remote/distributed organizing need different mechanics and
                different failure warnings.
              </p>
              <span className="card-action-line mt-4 text-primary">
                Open section
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              className="interactive-card block rounded-2xl border border-border bg-background/70 p-4"
              href="/resources#checklists-tools"
            >
              <p className="font-semibold">Checklists and tools</p>
              <p className="mt-2 text-sm text-muted-foreground">
                What to preserve, first conversation help, what not to do, and quick-reference pages
                for stressed workers.
              </p>
              <span className="card-action-line mt-4 text-primary">
                Open section
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              className="interactive-card block rounded-2xl border border-border bg-background/70 p-4"
              href="/evidence"
            >
              <p className="font-semibold">Evidence and leverage</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Workforce size, low union density, why tech stayed weakly organized, and what
                collective bargaining can actually change.
              </p>
              <span className="card-action-line mt-4 text-primary">
                Open page
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </CardContent>
        </Card>

        <Card className="paper-panel-ink self-start">
          <CardHeader>
            <Badge
              variant="outline"
              className="w-fit border-secondary-foreground/30 text-secondary-foreground"
            >
              Safety matters
            </Badge>
            <CardTitle className="text-2xl tracking-tight text-secondary-foreground">
              Slow and careful is often better than fast and loud.
            </CardTitle>
            <CardDescription className="text-base text-secondary-foreground/80">
              People usually land here under stress. The goal is to help them compare facts, talk
              to trusted coworkers, and avoid handing management an easy excuse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10">
              <Link href="/resources">Open wiki home</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
