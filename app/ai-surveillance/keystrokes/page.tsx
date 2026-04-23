import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KeystrokesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Specific guide"
        title="My employer is tracking computer activity for AI training."
        description="This page introduces the highest-signal steps: preserve facts, identify the workplace issue, avoid misconduct, and route to collective demands or organizer contact when retaliation risk is immediate."
      />
      <Card>
        <CardHeader>
          <CardTitle>Read the full guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>The detailed guide lives in the resources library so it can be reviewed, dated, and updated as labor conditions and legal guidance change.</p>
          <Button asChild>
            <Link href="/resources/keystroke-tracking-ai-training">Open resource</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

