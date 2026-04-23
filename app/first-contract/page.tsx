import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/first-contract-basics" as Route,
    title: "First contract basics",
    description:
      "The starting page for workers who need to think about bargaining priorities, participation, and how campaigns hold together after recognition.",
  },
  {
    href: "/resources/recognition-majority-support-and-going-public" as Route,
    title: "Recognition, majority support, and going public",
    description:
      "Worth reading alongside first-contract material so workers remember what structure got them here in the first place.",
  },
] as const;

const contractIdeas = [
  {
    title: "Priorities need worker discipline",
    description:
      "A first contract can become a black box fast if workers stop participating and leave everything to a few visible people.",
  },
  {
    title: "Recognition is not enforceable gain",
    description:
      "The public win matters, but the actual workplace changes live in the contract language and the structure that can defend it.",
  },
  {
    title: "Communication matters during bargaining",
    description:
      "Silence, confusion, and uneven expectations can hollow out momentum even when the campaign looked strong on the way in.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/workplace-mapping" as Route,
    title: "Workplace mapping",
    description:
      "Still relevant after recognition, because bargaining leverage depends on the live structure behind the table.",
  },
  {
    href: "/resources/organizing-conversations" as Route,
    title: "Organizing conversations",
    description:
      "Useful when participation starts thinning out and workers need to rebuild the habit of one-to-one contact.",
  },
  {
    href: "/resources/what-not-to-do-checklist" as Route,
    title: "What not to do checklist",
    description:
      "Worth keeping close when bargaining frustration tempts workers into gestures that are loud but structurally thin.",
  },
] as const;

export default function FirstContractPage() {
  return (
    <HubPage
      eyebrow="First contract"
      title="Recognition is a milestone. A first contract is the longer fight that comes after."
      description="This section is about bargaining priorities, communication discipline, worker participation, and the very common gap between public recognition and actual enforceable gains."
      overview={{
        title: "Use this section when the question is no longer whether workers are public, but whether the gains will become enforceable.",
        body: [
          "If workers are already thinking beyond recognition, start here. The point is to keep the structure alive after the public moment instead of letting momentum collapse into a black box called bargaining.",
          "A first contract is often where campaigns discover whether their participation was durable or mostly event-driven.",
        ],
      }}
      startHere={{
        title: "Start with the bargaining page, then read backward into recognition if needed.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "What matters now",
        title: "The things that weaken first-contract campaigns most often.",
        items: contractIdeas,
      }}
      relatedSection={{
        eyebrow: "Keep the structure alive",
        title: "Use these pages when the bargaining process starts thinning out worker contact.",
        items: relatedLinks,
      }}
      note={{
        badge: "After recognition",
        title: "Do not confuse visibility with leverage.",
        description:
          "A union can be publicly recognized and still bargain weakly if the worker structure behind it stops moving.",
      }}
    />
  );
}
