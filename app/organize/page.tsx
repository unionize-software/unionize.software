import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Map before you escalate",
    body: "If you start mapping the workplace, keep it off company systems and focus on who actually talks to whom, not just who agrees loudly.",
  },
  {
    title: "Conversations beat declarations",
    body: "Good organizing conversations are patient, relational, and grounded in trust. Most campaigns fail by going public before the structure is real.",
  },
  {
    title: "Work mode changes the path",
    body: "In-person, hybrid, and remote teams need different mechanics for trust building, comparison, and majority assessment.",
  },
];

const workModeLanes = [
  {
    title: "Mostly in-person",
    body: "Map who overlaps by office area, shift, or team. Use offsite follow-up instead of assuming lunch-table frustration equals durable support.",
  },
  {
    title: "Hybrid",
    body: "Track which office days actually create overlap, and make sure remote-heavy coworkers do not disappear from the organizing map.",
  },
  {
    title: "Mostly remote or distributed",
    body: "Build one-to-one trust on personal channels first. Large chats can create false confidence before the relationships are real.",
  },
];

export default function OrganizePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Organize"
        title="Organizing usually starts smaller, quieter, and more patiently than people expect."
        description="Most workers do not need a dramatic first move. They need a clearer read on the issue, a better sense of who trusts whom, and a way to keep building without outrunning the structure."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{section.body}</CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {workModeLanes.map((lane) => (
          <Card key={lane.title}>
            <CardHeader>
              <CardTitle className="text-lg">{lane.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{lane.body}</CardContent>
          </Card>
        ))}
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Related resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p className="pb-2 text-sm">
              If you are unsure where to begin, start with mapping and conversations. Those two
              pages do more to steady a campaign than almost any grand declaration.
            </p>
            <Link className="block underline-offset-4 hover:underline" href="/resources/workplace-mapping">
              Workplace mapping
            </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/organizing-conversations">
            Organizing conversations
          </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/remote-hybrid-and-distributed-organizing">
            Remote, hybrid, and distributed organizing
          </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/first-organizing-conversation-checklist">
            First organizing conversation checklist
          </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/what-not-to-do-checklist">
            What not to do checklist
          </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/protected-concerted-activity">
            Protected concerted activity
          </Link>
          <Link className="block underline-offset-4 hover:underline" href="/resources/contractor-vendor-misclassification">
            Contractor, vendor, and misclassification questions
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
