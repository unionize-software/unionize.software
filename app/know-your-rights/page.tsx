import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/protected-concerted-activity" as Route,
    title: "Protected concerted activity",
    description:
      "The basic labor-rights page for workers who need to understand what kinds of collective workplace action may be protected.",
  },
  {
    href: "/resources/retaliation-warning-signs" as Route,
    title: "Retaliation warning signs",
    description:
      "Use this when management behavior shifts after workers start comparing notes or raising issues together.",
  },
  {
    href: "/resources/supervisor-status-and-exclusion" as Route,
    title: "Supervisor status and exclusion questions",
    description:
      "A page for the common question of who may be treated as excluded from NLRA coverage in practice.",
  },
  {
    href: "/resources/contractor-vendor-misclassification" as Route,
    title: "Contractor, vendor, and misclassification questions",
    description:
      "Use this when the employer relationship itself is muddy or split across staffing layers.",
  },
  {
    href: "/resources/public-sector-workers-start-here" as Route,
    title: "Public-sector workers: start here",
    description:
      "A clean off-ramp for workers whose employer is a government body, public university, school district, or other public entity.",
  },
  {
    href: "/resources/outside-the-united-states-start-here" as Route,
    title: "Outside the United States: start here",
    description:
      "A boundary page for workers using the site outside the U.S. labor-law lane.",
  },
] as const;

const commonIdeas = [
  {
    title: "Clarify the lane first",
    description:
      "Private-sector employee, contractor, public-sector worker, and possible supervisor are not tiny distinctions. They can change the whole strategic lane.",
  },
  {
    title: "Rights talk should calm people down",
    description:
      "The point is not to hand workers fake certainty. It is to reduce rumor, identify obvious risk, and steer people away from reckless assumptions.",
  },
  {
    title: "Legal scope is not the same as campaign strategy",
    description:
      "A move can be legally arguable and still strategically foolish. The rights pages should help people separate those two questions.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/pay-transparency-leveling-and-promotions" as Route,
    title: "Pay transparency, leveling, and promotions",
    description:
      "Use this when the workplace problem is not abstract rights confusion but an actual pay and advancement pattern.",
  },
  {
    href: "/resources/on-call-burnout-and-after-hours-work" as Route,
    title: "On-call, burnout, and after-hours work",
    description:
      "A common issue lane where workers need both rights basics and organizing judgment.",
  },
  {
    href: "/resources/discrimination-exclusion-and-organizing-safely" as Route,
    title: "Discrimination, exclusion, and organizing safely",
    description:
      "Use this when harm is unequally distributed and workers need to organize without flattening the problem.",
  },
  {
    href: "/resources/retaliation-response-checklist" as Route,
    title: "Retaliation response checklist",
    description:
      "A short first-response page for the moment when management pressure is already starting to build.",
  },
  {
    href: "/start" as Route,
    title: "Optional local-only pathfinder",
    description:
      "Use this when someone needs a narrower route into the wiki but does not want to hand their answers to a backend.",
    cta: "Open pathfinder",
    meta: "Local only",
  },
] as const;

export default function KnowYourRightsPage() {
  return (
    <HubPage
      eyebrow="Know your rights"
      title="Start with the ground rules, then get more specific."
      description="This section is educational, not legal advice. It exists to help U.S. private-sector software and game workers understand the basic terrain, spot common risk questions, and avoid mistakes that expose people too early."
      overview={{
        title: "Use this section to get the labor basics straight before you gamble on rumor.",
        body: [
          "This is where workers should start when they need the ground rules on concerted activity, exclusions, retaliation, and why private-sector status matters.",
          "It also includes the cleanest off-ramps for workers who are public-sector, outside the United States, or otherwise outside the main NLRA lane.",
        ],
      }}
      startHere={{
        title: "Start with the pages that answer the most common status and retaliation questions.",
        description:
          "If you already know the issue, go straight there. If not, these pages cover the rights questions that distort strategy most often.",
        links: startHereLinks,
        columns: 2,
      }}
      ideaSection={{
        eyebrow: "Ground rules",
        title: "What the rights section should help workers do.",
        items: commonIdeas,
      }}
      relatedSection={{
        eyebrow: "Common next lanes",
        title: "Move from rights basics into the actual workplace problem.",
        description:
          "Once the basic labor terrain is clearer, most workers need an issue guide, not another abstract rights explainer.",
        items: relatedLinks,
      }}
      note={{
        badge: "Scope",
        title: "A rights page is not a guarantee.",
        description:
          "The site can help workers understand common rules and common dangers. It cannot tell them that every tactic is protected or wise.",
      }}
    />
  );
}
