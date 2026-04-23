import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/game-worker-crunch" as Route,
    title: "Game worker crunch",
    description:
      "Start here when the pressure point is production chaos, overtime pressure, and the normalization of exhaustion.",
  },
  {
    href: "/resources/layoffs-severance" as Route,
    title: "Layoffs and severance",
    description:
      "Use this when post-launch cuts, studio instability, or restructuring are the immediate problem.",
  },
  {
    href: "/resources/contractor-vendor-misclassification" as Route,
    title: "Contractor, vendor, and misclassification questions",
    description:
      "A necessary companion when QA, support, or external dev work is split across multiple staffing layers.",
  },
] as const;

const pressurePoints = [
  {
    title: "Crunch is often a planning problem disguised as commitment",
    description:
      "When impossible timelines become cultural expectation, workers need a collective frame for the problem, not another lecture about passion.",
  },
  {
    title: "Vendor-heavy staffing changes trust and risk",
    description:
      "QA, external studios, and temporary contracts can fragment the workplace unless people account for those divisions on purpose.",
  },
  {
    title: "Credits and layoffs shape how people assess danger",
    description:
      "In game work, prestige and precarity often sit together. That changes what workers will risk and how public moves are read.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/remote-hybrid-and-distributed-organizing" as Route,
    title: "Remote, hybrid, and distributed organizing",
    description:
      "Useful when game teams are split across studios, countries, vendors, or irregular office presence.",
  },
  {
    href: "/resources/pay-transparency-leveling-and-promotions" as Route,
    title: "Pay transparency, leveling, and promotions",
    description:
      "A common companion issue when advancement is opaque and different disciplines are treated very unevenly.",
  },
  {
    href: "/resources/what-not-to-do-checklist" as Route,
    title: "What not to do checklist",
    description:
      "Worth sharing when layoffs, crunch, or management panic make people want to jump straight to a risky move.",
  },
] as const;

export default function GameWorkersPage() {
  return (
    <HubPage
      eyebrow="Game workers"
      title="Game work has its own pressure points, and generic tech advice often misses them."
      description="Crunch, QA segmentation, credit anxiety, post-launch layoffs, live-ops precarity, and vendor-heavy staffing all change how workers read risk and build trust. This section keeps that reality visible."
      overview={{
        title: "Use this section when the workplace looks like games, not generic software.",
        body: [
          "Game work often mixes prestige, instability, vendor-heavy staffing, and production crunch in a way that changes what workers fear and what they will risk.",
          "The point here is to keep those conditions visible so the organizing advice does not flatten them into a generic tech script.",
        ],
      }}
      startHere={{
        title: "Start with the page closest to the pressure workers are under right now.",
        description:
          "If crunch is the live issue, start there. If the studio is cutting people or hiding behind vendor layers, start there instead.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "Pressure points",
        title: "The game-work patterns that change how campaigns develop.",
        items: pressurePoints,
      }}
      relatedSection={{
        eyebrow: "Keep going",
        title: "Useful companion pages when the picture is broader than one issue.",
        items: relatedLinks,
      }}
      note={{
        badge: "Reality check",
        title: "Passion is one of management's favorite solvents.",
        description:
          "If a workplace keeps using love of the work to justify crunch, silence, or disposable staffing, that is not a cultural quirk. It is a labor problem.",
      }}
    />
  );
}
