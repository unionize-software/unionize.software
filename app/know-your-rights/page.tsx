import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowYourRightsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Know your rights"
        title="Start with the ground rules, then get more specific."
        description="This section is educational, not legal advice. It exists to help U.S. private-sector software and game workers understand the basic terrain, spot common risk questions, and avoid mistakes that expose people too early."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What this section covers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Protected concerted activity, common exclusions, retaliation warning signs, and why
              private-sector status matters.
            </p>
            <p>
              Use it to orient yourself before you take any steps that could expose coworkers or
              create avoidable risk.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended next move</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you want a narrower route in, use the local-only pathfinder. If you already know
              the problem, go straight to the guide instead.
            </p>
            <Button asChild>
              <Link href="/start">Open Start Here</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Common exclusion questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <Link className="block underline-offset-4 hover:underline" href="/resources/protected-concerted-activity">
              Protected concerted activity
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/contractor-vendor-misclassification">
              Contractor, vendor, and misclassification questions
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/supervisor-status-and-exclusion">
              Supervisor status and exclusion questions
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/retaliation-warning-signs">
              Retaliation warning signs
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issue lanes people need most often</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <Link className="block underline-offset-4 hover:underline" href="/resources/pay-transparency-leveling-and-promotions">
              Pay transparency, leveling, and promotions
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/on-call-burnout-and-after-hours-work">
              On-call, burnout, and after-hours work
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/discrimination-exclusion-and-organizing-safely">
              Discrimination, exclusion, and organizing safely
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
