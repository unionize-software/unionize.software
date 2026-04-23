import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FirstContractPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="First contract"
        title="Recognition is a milestone. A first contract is the longer fight that comes after."
        description="This section is about bargaining priorities, communication discipline, worker participation, and the very common gap between public recognition and actual enforceable gains."
      />
      <Card>
        <CardHeader>
          <CardTitle>Read next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            If workers are already thinking beyond recognition, start here. The point is to keep the
            structure alive after the public moment instead of letting momentum collapse into a black
            box called bargaining.
          </p>
          <Link className="underline-offset-4 hover:underline" href="/resources/first-contract-basics">
            First contract basics
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
