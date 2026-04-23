import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/recognition-majority-support-and-going-public" as Route,
    title: "Recognition, majority support, and going public",
    description:
      "The core page for workers deciding whether the campaign is actually strong enough to test in public.",
  },
  {
    href: "/resources/workplace-mapping" as Route,
    title: "Workplace mapping",
    description:
      "Use this if support still feels lopsided, noisy, or concentrated in one part of the workplace.",
  },
  {
    href: "/resources/first-contract-basics" as Route,
    title: "First contract basics",
    description:
      "Worth reading early so workers do not mistake recognition for the end of the hard part.",
  },
] as const;

const recognitionIdeas = [
  {
    title: "Majority matters more than heat",
    description:
      "A campaign is not ready just because people are angry. Recognition tests whether the structure reaches enough of the workplace to hold under pressure.",
  },
  {
    title: "Unit clarity matters",
    description:
      "Workers need a clearer sense of who is in the lane, who is excluded, and where management can still exploit confusion.",
  },
  {
    title: "A public move needs a job",
    description:
      "Recognition is not a cathartic declaration. It is a strategic step that should change the balance of power, not just the mood.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/first-organizing-conversation-checklist" as Route,
    title: "First organizing conversation checklist",
    description:
      "Still useful here, because shallow structure often shows up as weak or inconsistent one-to-one conversations.",
  },
  {
    href: "/resources/what-not-to-do-checklist" as Route,
    title: "What not to do checklist",
    description:
      "Use this when people are tempted to substitute noise, bravado, or improvised pressure for actual majority structure.",
  },
  {
    href: "/resources/protected-concerted-activity" as Route,
    title: "Protected concerted activity",
    description:
      "A grounding page for workers who need the legal basics before they assume every public escalation works the same way.",
  },
] as const;

export default function RecognitionPage() {
  return (
    <HubPage
      eyebrow="Recognition"
      title="Recognition is not the moment when feelings get intense. It is the moment when structure gets tested."
      description="Workers often feel pressure to go public as soon as management becomes unbearable. This section is here to slow that impulse down and focus on majority support, weak spots, and what a public move is actually meant to accomplish."
      overview={{
        title: "Use this section when workers are starting to ask whether the campaign is ready for a public test.",
        body: [
          "Recognition works best when workers know where support is solid, where it is thin, and which parts of the workplace are still easy for management to isolate.",
          "If the map is shallow or the campaign is being held together by one loud cluster, slow down and keep building.",
        ],
      }}
      startHere={{
        title: "Start with the pages that test structure instead of feeding adrenaline.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "Before a public move",
        title: "What workers should be honest about first.",
        items: recognitionIdeas,
      }}
      relatedSection={{
        eyebrow: "Keep it steady",
        title: "Companion pages for the moments where recognition usually gets rushed.",
        items: relatedLinks,
      }}
      note={{
        badge: "Pressure",
        title: "Going public early can expose weakness, not strength.",
        description:
          "If recognition talk is arriving before the structure is wide, durable, and mapped, the problem is probably not a lack of courage.",
        tone: "ink",
      }}
    />
  );
}
