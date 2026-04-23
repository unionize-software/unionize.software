import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecognitionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Recognition"
        title="Recognition is not the moment when feelings get intense. It is the moment when structure gets tested."
        description="Workers often feel pressure to go public as soon as management becomes unbearable. This section is here to slow that impulse down and focus on majority support, weak spots, and what a public move is actually meant to accomplish."
      />
      <Card>
        <CardHeader>
          <CardTitle>Start with fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            Recognition works best when workers know where support is solid, where it is thin, and
            which parts of the workplace are still easy for management to isolate.
          </p>
          <p>
            If the map is shallow or the campaign is being held together by one loud cluster, slow
            down and keep building.
          </p>
          <Link className="underline-offset-4 hover:underline" href="/resources/recognition-majority-support-and-going-public">
            Read recognition, majority support, and going public
          </Link>
          <Link className="underline-offset-4 hover:underline" href="/resources/first-contract-basics">
            Read first contract basics
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
