import type { StartQuestion } from "@/lib/start/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuestionStepProps = {
  question: StartQuestion;
  currentStep: number;
  totalSteps: number;
  onSelect: (value: string) => void;
};

export function QuestionStep({ question, currentStep, totalSteps, onSelect }: QuestionStepProps) {
  const progress = `${Math.round((currentStep / totalSteps) * 100)}%`;

  return (
    <Card className="bg-card/90">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-primary">
            Step {currentStep} of {totalSteps}
          </p>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: progress }} />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-tight">{question.prompt}</CardTitle>
          {question.description ? (
            <p className="text-base text-muted-foreground">{question.description}</p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            className="rounded-3xl border border-border bg-background/70 p-5 text-left hover:border-primary/35 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onSelect(option.value)}
            type="button"
          >
            <p className="font-semibold">{option.label}</p>
            {option.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
            ) : null}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

