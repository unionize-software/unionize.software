"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";

import { useStartWizardSession } from "@/components/start/StartWizardProvider";
import { QuestionStep } from "@/components/start/QuestionStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildStartResult } from "@/lib/start/resultCopy";
import {
  completeStartAnswers,
  getStartQuestionFlow,
  type StartAnswers,
  type StartQuestionId,
} from "@/lib/start/questions";

export function StartWizard() {
  const router = useRouter();
  const { setSession } = useStartWizardSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<StartAnswers>>({});
  const questionFlow = useMemo(() => getStartQuestionFlow(answers), [answers]);

  const answeredCount = useMemo(
    () => questionFlow.filter((question) => typeof answers[question.id] === "string").length,
    [answers, questionFlow],
  );

  const currentQuestion = questionFlow[Math.min(stepIndex, questionFlow.length - 1)];

  const handleSelect = (questionId: StartQuestionId, value: string) => {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    } as Partial<StartAnswers>;

    setAnswers(nextAnswers);

    const nextQuestionFlow = getStartQuestionFlow(nextAnswers);

    if (stepIndex >= nextQuestionFlow.length - 1) {
      const completeAnswers = completeStartAnswers(nextAnswers);
      const result = buildStartResult(completeAnswers);

      startTransition(() => {
        setSession({
          answers: completeAnswers,
          result,
        });
        router.push("/start/results");
      });

      return;
    }

    setStepIndex((current) => Math.min(current + 1, nextQuestionFlow.length - 1));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <QuestionStep
        currentStep={stepIndex + 1}
        onSelect={(value) => handleSelect(currentQuestion.id, value)}
        question={currentQuestion}
        totalSteps={questionFlow.length}
      />

      <div className="space-y-6">
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Nothing here is saved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-secondary-foreground/85">
            <p>This flow does not create an account or send your answers to the server.</p>
            <p>If you can, use a personal device and personal contact information.</p>
            <p>Try not to use company chat, company email, or company tickets for organizing conversations.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/85">
          <CardHeader>
            <CardTitle className="text-2xl">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              {answeredCount} of {questionFlow.length} questions answered in this path.
            </p>
            <div className="flex gap-3">
              <Button
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setAnswers({});
                  setStepIndex(0);
                }}
                type="button"
                variant="outline"
              >
                Reset
              </Button>
            </div>
            <p>
              If retaliation risk feels immediate, skip the rest and go straight to the{" "}
              <Link className="underline-offset-4 hover:underline" href="/resources/retaliation-warning-signs">
                retaliation warning signs
              </Link>{" "}
              and{" "}
              <Link className="underline-offset-4 hover:underline" href="/resources/what-to-preserve-checklist">
                what to preserve checklist
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
