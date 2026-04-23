import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoopsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Worker-owned alternatives"
        title="Not every worker problem ends in a traditional recognition campaign."
        description="Worker co-ops belong in the imagination of software and game workers, especially after layoffs, studio closures, and repeated extraction. They are still serious projects, not an easy escape hatch."
      />
      <Card>
        <CardHeader>
          <CardTitle>Read next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            This page is here for workers who want to understand co-ops without romanticizing them.
            Better ownership still needs structure, governance, and hard collective work.
          </p>
          <Link className="underline-offset-4 hover:underline" href="/resources/worker-coop-basics">
            Worker co-op basics
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
