import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/worker-coop-basics" as Route,
    title: "Worker co-op basics",
    description:
      "The starting page for workers who want to understand co-ops without turning them into a romantic shortcut.",
  },
  {
    href: "/resources/layoffs-severance" as Route,
    title: "Layoffs and severance",
    description:
      "Often the practical companion page when co-op thinking appears after a closure, mass cut, or abrupt studio collapse.",
  },
] as const;

const coopIdeas = [
  {
    title: "A co-op is not an escape hatch",
    description:
      "Better ownership still needs governance, capital, role clarity, and a real answer to who does what work under pressure.",
  },
  {
    title: "The ownership question comes after the workplace question",
    description:
      "Sometimes workers need bargaining, severance, or an organizing campaign. Sometimes they want a new enterprise. Those are related, but they are not identical.",
  },
  {
    title: "Serious alternatives still need collective discipline",
    description:
      "A co-op is not a softer version of management. It is another form of shared structure that still needs accountability and participation.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/recognition-majority-support-and-going-public" as Route,
    title: "Recognition, majority support, and going public",
    description:
      "Useful when workers are deciding whether the next move is a union path, a transition project, or simply more internal structure first.",
  },
  {
    href: "/resources/pay-transparency-leveling-and-promotions" as Route,
    title: "Pay transparency, leveling, and promotions",
    description:
      "Worth reading when the deeper issue is not ownership itself but arbitrary compensation and advancement systems.",
  },
  {
    href: "/resources/workplace-mapping" as Route,
    title: "Workplace mapping",
    description:
      "Still the right page when workers need to understand the real structure before they decide what form their collective project should take.",
  },
] as const;

export default function CoopsPage() {
  return (
    <HubPage
      eyebrow="Worker-owned alternatives"
      title="Not every worker problem ends in a traditional recognition campaign."
      description="Worker co-ops belong in the imagination of software and game workers, especially after layoffs, studio closures, and repeated extraction. They are still serious projects, not an easy escape hatch."
      overview={{
        title: "Use this section when workers want to think about ownership without romanticizing it.",
        body: [
          "This section is here for workers who want to understand co-ops without flattening them into a feel-good alternative to every other labor path.",
          "Better ownership still needs structure, governance, money, and hard collective work. The point is to think clearly, not wistfully.",
        ],
      }}
      startHere={{
        title: "Start with the co-op page, then branch into layoffs or structure questions if that is the real issue.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "Keep it serious",
        title: "Three things workers should hold onto when co-ops come up.",
        items: coopIdeas,
      }}
      relatedSection={{
        eyebrow: "Related pages",
        title: "Use these pages when the ownership question sits inside a bigger labor question.",
        items: relatedLinks,
      }}
      note={{
        badge: "Boundary",
        title: "A co-op is one path, not the answer to every broken workplace.",
        description:
          "Sometimes the right next move is bargaining, severance, or rebuilding worker structure where people already are.",
      }}
    />
  );
}
