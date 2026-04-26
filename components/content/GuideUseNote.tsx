import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GuideUseNoteProps = {
  formattedReviewDate: string;
  legalScope: string;
  notFor: string;
  riskLevel: string;
  sourceStatus: string;
  whenToUse: string;
};

export function GuideUseNote({
  formattedReviewDate,
  legalScope,
  notFor,
  riskLevel,
  sourceStatus,
  whenToUse,
}: GuideUseNoteProps) {
  return (
    <Card className="border-primary/20 bg-primary/7">
      <CardHeader>
        <Badge variant="outline" className="w-fit border-primary/35 text-primary">
          Before you use this page
        </Badge>
        <CardTitle className="text-2xl tracking-tight">
          Treat this as orientation, not as a legal decision.
        </CardTitle>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          These pages are meant to help workers slow down, sort the facts, and choose a safer next
          page. They do not replace advice from a labor lawyer, organizer, or local labor
          institution.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
        <div className="border-l-2 border-primary/45 py-1 pl-4">
          <p className="font-semibold text-foreground">Use when</p>
          <p className="mt-1 leading-7">{whenToUse}</p>
        </div>
        <div className="border-l-2 border-primary/45 py-1 pl-4">
          <p className="font-semibold text-foreground">Not for</p>
          <p className="mt-1 leading-7">{notFor}</p>
        </div>
        <div className="border-l-2 border-primary/45 py-1 pl-4">
          <p className="font-semibold text-foreground">Authority footing</p>
          <p className="mt-1 leading-7">
            {sourceStatus}. Last reviewed {formattedReviewDate}. Risk level: {riskLevel}.
          </p>
        </div>
        <div className="border-l-2 border-primary/45 py-1 pl-4">
          <p className="font-semibold text-foreground">Legal scope</p>
          <p className="mt-1 leading-7">{legalScope}</p>
        </div>
      </CardContent>
    </Card>
  );
}
