import Link from "next/link";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiSurveillancePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="AI surveillance"
        title="When tracking expands, workers are usually dealing with more than a privacy problem."
        description="Keystroke logging, screenshot capture, productivity scoring, and AI data extraction can all change how workers are judged and disciplined. This section is here to help people slow down, compare facts, and respond without handing management an easy excuse."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Use this lane for</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Keystroke monitoring, mouse tracking, screenshot capture, screen recording, data
              labeling expectations, output scoring, and pressure tied to internal AI systems.
            </p>
            <p>
              The goal is to preserve facts, compare notes off company systems, and figure out what
              workers can ask for together.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>One immediate rule</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Do not sabotage systems, falsify work, corrupt data, or plan organizing activity on company devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/ai-surveillance/keystrokes">Open keystroke tracking guide</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
