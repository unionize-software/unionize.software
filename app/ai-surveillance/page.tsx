import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/ai-surveillance/keystrokes" as Route,
    title: "Keystroke tracking guide",
    description:
      "The most concrete starting page for workers dealing with input tracking, screenshot capture, and AI-training claims.",
    cta: "Open guide",
  },
  {
    href: "/resources/ai-surveillance-worker-data" as Route,
    title: "AI surveillance and worker data",
    description:
      "Use this for the broader pattern: telemetry, monitoring, data extraction, and how those systems shift managerial control.",
  },
  {
    href: "/resources/what-to-preserve-checklist" as Route,
    title: "What to preserve checklist",
    description:
      "A shorter page for the first step: preserve facts, notices, screenshots, and policy changes on personal systems.",
  },
] as const;

const coreIdeas = [
  {
    title: "Treat it as a workplace power issue",
    description:
      "Workers often frame surveillance as a privacy complaint first. The more useful question is how the data will be used for discipline, performance scoring, or intensified work.",
  },
  {
    title: "Preserve facts before theory",
    description:
      "Do not start with speculation about what the system might be doing. Start with policy language, notices, screenshots, manager statements, and repeatable facts.",
  },
  {
    title: "Keep the campaign clean",
    description:
      "Do not sabotage systems, falsify output, poison data, or plan organizing activity on company devices. Those are gifts to management, not worker strategy.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/protected-concerted-activity" as Route,
    title: "Protected concerted activity",
    description:
      "Ground the surveillance response in the basic labor-rights framework instead of treating it as only a consumer-tech question.",
  },
  {
    href: "/resources/retaliation-warning-signs" as Route,
    title: "Retaliation warning signs",
    description:
      "Use this when monitoring expands at the same time management becomes more aggressive about discipline.",
  },
  {
    href: "/resources/on-call-burnout-and-after-hours-work" as Route,
    title: "On-call, burnout, and after-hours work",
    description:
      "A useful companion page when tracking tools are tied to pace, availability, or always-on expectations.",
  },
  {
    href: "/resources/what-not-to-do-checklist" as Route,
    title: "What not to do checklist",
    description:
      "Use this when the anger is real and workers need a short page that keeps them out of easy disciplinary traps.",
  },
] as const;

export default function AiSurveillancePage() {
  return (
    <HubPage
      eyebrow="AI surveillance"
      title="When tracking expands, workers are usually dealing with more than a privacy problem."
      description="Keystroke logging, screenshot capture, productivity scoring, and AI data extraction can all change how workers are judged and disciplined. This section is here to help people slow down, compare facts, and respond without handing management an easy excuse."
      overview={{
        title: "Use this lane when monitoring changes how people are evaluated, not just how they feel.",
        body: [
          "Keystroke monitoring, mouse tracking, screenshots, screen recording, output scoring, and AI data extraction all matter because they can shift discipline, pay, and managerial control.",
          "The immediate goal is to preserve facts, compare notes off company systems, and figure out what workers can ask for together without creating an easy pretext for punishment.",
        ],
      }}
      startHere={{
        title: "Start with the pages that match the monitoring system workers are actually seeing.",
        description:
          "Do not let a broad technology conversation hide the concrete workplace issue in front of you.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "Keep it grounded",
        title: "Three things that matter before workers make demands.",
        items: coreIdeas,
      }}
      relatedSection={{
        eyebrow: "Related pages",
        title: "Keep the surveillance lane connected to rights and workplace conditions.",
        description:
          "These pages help workers connect monitoring to discipline, workload, and lawful collective action.",
        items: relatedLinks,
      }}
      note={{
        badge: "Immediate rule",
        title: "Do not turn a real workplace issue into a disciplinary gift.",
        description:
          "Do not sabotage systems, falsify work, corrupt data, or plan organizing activity on company devices.",
        tone: "ink",
      }}
    />
  );
}
