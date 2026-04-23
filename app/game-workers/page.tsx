import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GameWorkersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Game workers"
        title="Game work has its own pressure points, and generic tech advice often misses them."
        description="Crunch, QA segmentation, credit anxiety, post-launch layoffs, live-ops precarity, and vendor-heavy staffing all change how workers read risk and build trust. This section keeps that reality visible."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Focus areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>Crunch and unstable production planning</p>
            <p>QA, vendor chains, and classification issues</p>
            <p>Credits, layoffs, post-launch attrition, and studio instability</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Related resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p className="pb-2 text-sm">
              Start with the page closest to the pressure workers are under right now, then branch
              into classification or layoffs if that is part of the picture.
            </p>
            <Link className="block underline-offset-4 hover:underline" href="/resources/game-worker-crunch">
              Game worker crunch
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/layoffs-severance">
              Layoffs and severance
            </Link>
            <Link className="block underline-offset-4 hover:underline" href="/resources/contractor-vendor-misclassification">
              Contractor, vendor, and misclassification questions
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
