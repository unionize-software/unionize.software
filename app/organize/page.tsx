import type { Route } from "next";

import { HubPage } from "@/components/site/HubPage";

const startHereLinks = [
  {
    href: "/resources/workplace-mapping" as Route,
    title: "Workplace mapping",
    description:
      "Start by understanding who actually talks to whom, where influence sits, and which parts of the workplace are still disconnected.",
  },
  {
    href: "/resources/organizing-conversations" as Route,
    title: "Organizing conversations",
    description:
      "Use this when workers agree something is wrong but have not yet built the trust or clarity to act together.",
  },
  {
    href: "/resources/first-organizing-conversation-checklist" as Route,
    title: "First conversation checklist",
    description:
      "A shorter page for the moment when someone needs help preparing for one careful one-to-one.",
  },
] as const;

const sections = [
  {
    title: "Map before you escalate",
    description:
      "If you start mapping the workplace, keep it off company systems and focus on who actually talks to whom, not just who agrees loudly.",
  },
  {
    title: "Conversations beat declarations",
    description:
      "Good organizing conversations are patient, relational, and grounded in trust. Most campaigns fail by going public before the structure is real.",
  },
  {
    title: "Work mode changes the path",
    description:
      "In-person, hybrid, and remote teams need different mechanics for trust building, comparison, and majority assessment.",
  },
] as const;

const workModeLanes = [
  {
    title: "Mostly in-person",
    description:
      "Map who overlaps by office area, shift, or team. Use offsite follow-up instead of assuming lunch-table frustration equals durable support.",
  },
  {
    title: "Hybrid",
    description:
      "Track which office days actually create overlap, and make sure remote-heavy coworkers do not disappear from the organizing map.",
  },
  {
    title: "Mostly remote or distributed",
    description:
      "Build one-to-one trust on personal channels first. Large chats can create false confidence before the relationships are real.",
  },
] as const;

const relatedLinks = [
  {
    href: "/resources/remote-hybrid-and-distributed-organizing" as Route,
    title: "Remote, hybrid, and distributed organizing",
    description:
      "The work-mode guide for teams that cannot rely on physical overlap or one office rhythm.",
  },
  {
    href: "/resources/what-not-to-do-checklist" as Route,
    title: "What not to do checklist",
    description:
      "Use this when people are angry enough to rush and need a shorter page that keeps the campaign clean.",
  },
  {
    href: "/resources/protected-concerted-activity" as Route,
    title: "Protected concerted activity",
    description:
      "Ground the strategy in the basic labor-rights framework before assuming every risky move is protected.",
  },
  {
    href: "/resources/contractor-vendor-misclassification" as Route,
    title: "Contractor, vendor, and misclassification questions",
    description:
      "Use this when the workplace is split across direct employees, vendors, and ambiguous classifications.",
  },
] as const;

export default function OrganizePage() {
  return (
    <HubPage
      eyebrow="Organize"
      title="Organizing usually starts smaller, quieter, and more patiently than people expect."
      description="Most workers do not need a dramatic first move. They need a clearer read on the issue, a better sense of who trusts whom, and a way to keep building without outrunning the structure."
      overview={{
        title: "Use this section when the workplace problem is real but the structure is still thin.",
        body: [
          "The job here is to move from shared frustration to quiet discipline. That usually means mapping, patient one-to-ones, and making sure the tactic fits the workplace you actually have.",
          "If workers are still mistaking volume for support, a public move is probably too early. This section is here to help people slow that down.",
        ],
      }}
      startHere={{
        title: "Start with the pages that turn general frustration into usable structure.",
        description:
          "These are the pages that steady campaigns before anyone talks about going public.",
        links: startHereLinks,
      }}
      ideaSection={{
        eyebrow: "Ground rules",
        title: "Three things that matter before almost any bigger step.",
        items: sections,
      }}
      laneSection={{
        eyebrow: "Work modes",
        title: "The mechanics change when the workplace changes.",
        description:
          "A path that works in one office can fail badly in a distributed team. Keep the work mode visible from the start.",
        items: workModeLanes,
      }}
      relatedSection={{
        eyebrow: "Related pages",
        title: "Keep reading where campaigns usually wobble.",
        description:
          "Most campaigns need a mix of structure, legal basics, and a calmer sense of what not to do.",
        items: relatedLinks,
      }}
      note={{
        badge: "Discipline",
        title: "A loud start is not the same thing as a strong campaign.",
        description:
          "If the campaign is being held together by one visible cluster, one shared chat, or one very intense issue thread, slow down and keep building.",
        tone: "ink",
      }}
    />
  );
}
