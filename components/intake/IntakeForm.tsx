"use client";

import { startTransition, useState } from "react";

import { encryptIntakePayload } from "@/lib/intake/encrypt";
import {
  deriveCoarseRegion,
  deriveUrgency,
  intakeFormSchema,
  type IntakeFormValues,
} from "@/lib/intake/schema";
import { submitEncryptedIntake } from "@/lib/intake/submit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: IntakeFormValues = {
  nameOrAlias: "",
  personalEmail: "",
  personalPhone: "",
  stateOrRegion: "",
  roleFamily: "full-stack/frontend/backend",
  employer: "",
  topIssue: "AI surveillance",
  coworkersInvolved: "none yet",
  urgentRetaliationConcern: "no",
  bestContactTime: "",
  context: "",
};

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-border bg-background/80 px-4 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function IntakeForm() {
  const [formState, setFormState] = useState<IntakeFormValues>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const publicKeyId = process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ID;
  const publicKeyBase64 = process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64;

  const setField = (field: keyof IntakeFormValues, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = intakeFormSchema.safeParse(formState);

    if (!parsed.success) {
      setStatus("idle");
      setError(parsed.error.issues[0]?.message ?? "Please review the form.");
      return;
    }

    if (!publicKeyId || !publicKeyBase64) {
      setStatus("idle");
      setError("Encrypted intake is not configured yet.");
      return;
    }

    setStatus("submitting");

    try {
      const plaintextPayload = JSON.stringify(parsed.data);
      const ciphertext = await encryptIntakePayload(plaintextPayload, publicKeyBase64);
      const response = await submitEncryptedIntake({
        ciphertext,
        public_key_id: publicKeyId,
        urgency: deriveUrgency(parsed.data),
        coarse_region: deriveCoarseRegion(parsed.data.stateOrRegion),
        work_type: parsed.data.roleFamily,
      });

      startTransition(() => {
        setReceiptId(response.id);
        setExpiresAt(response.expires_at);
        setStatus("success");
        setFormState(initialState);
      });
    } catch (submitError) {
      setStatus("idle");
      setError(
        submitError instanceof Error ? submitError.message : "Encrypted intake submission failed.",
      );
    }
  };

  return (
    <Card className="bg-card/90">
      <CardHeader>
        <CardTitle className="text-2xl">Organizer intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === "success" ? (
          <div className="rounded-3xl border border-secondary/25 bg-secondary/10 p-5 text-sm text-foreground">
            <p className="font-semibold">Encrypted intake submitted.</p>
            {receiptId ? <p className="mt-2 text-muted-foreground">Receipt ID: {receiptId}</p> : null}
            {expiresAt ? (
              <p className="mt-2 text-muted-foreground">
                Ciphertext expiry target: {new Date(expiresAt).toLocaleDateString()}
              </p>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-primary/25 bg-primary/10 p-5 text-sm text-foreground">
            {error}
          </div>
        ) : null}

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameOrAlias">Name or alias</Label>
              <Input
                id="nameOrAlias"
                name="nameOrAlias"
                onChange={(event) => setField("nameOrAlias", event.target.value)}
                value={formState.nameOrAlias}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalEmail">Personal email</Label>
              <Input
                id="personalEmail"
                name="personalEmail"
                onChange={(event) => setField("personalEmail", event.target.value)}
                type="email"
                value={formState.personalEmail}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalPhone">Personal phone (optional)</Label>
              <Input
                id="personalPhone"
                name="personalPhone"
                onChange={(event) => setField("personalPhone", event.target.value)}
                value={formState.personalPhone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateOrRegion">State or region</Label>
              <Input
                id="stateOrRegion"
                name="stateOrRegion"
                onChange={(event) => setField("stateOrRegion", event.target.value)}
                placeholder="Keep this coarse, for example California"
                value={formState.stateOrRegion}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleFamily">Role family</Label>
              <select
                className={selectClassName}
                id="roleFamily"
                name="roleFamily"
                onChange={(event) => setField("roleFamily", event.target.value)}
                value={formState.roleFamily}
              >
                <option>full-stack/frontend/backend</option>
                <option>infra/SRE/platform</option>
                <option>AI/ML/data</option>
                <option>QA/test</option>
                <option>game dev</option>
                <option>design/product</option>
                <option>IT/support</option>
                <option>technical writing/docs</option>
                <option>other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topIssue">Top issue</Label>
              <select
                className={selectClassName}
                id="topIssue"
                name="topIssue"
                onChange={(event) => setField("topIssue", event.target.value)}
                value={formState.topIssue}
              >
                <option>AI surveillance</option>
                <option>layoffs/severance</option>
                <option>pay/promotions</option>
                <option>on-call/burnout</option>
                <option>crunch</option>
                <option>retaliation</option>
                <option>discrimination/exclusion</option>
                <option>contractor/vendor issues</option>
                <option>other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employer">Employer</Label>
            <Input
              id="employer"
              name="employer"
              onChange={(event) => setField("employer", event.target.value)}
              value={formState.employer}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="coworkersInvolved">Coworkers already involved?</Label>
              <select
                className={selectClassName}
                id="coworkersInvolved"
                name="coworkersInvolved"
                onChange={(event) => setField("coworkersInvolved", event.target.value)}
                value={formState.coworkersInvolved}
              >
                <option>none yet</option>
                <option>1-3 trusted coworkers</option>
                <option>4+ trusted coworkers</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgentRetaliationConcern">Urgent retaliation concern?</Label>
              <select
                className={selectClassName}
                id="urgentRetaliationConcern"
                name="urgentRetaliationConcern"
                onChange={(event) => setField("urgentRetaliationConcern", event.target.value)}
                value={formState.urgentRetaliationConcern}
              >
                <option>no</option>
                <option>yes</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bestContactTime">Best contact time</Label>
              <Input
                id="bestContactTime"
                name="bestContactTime"
                onChange={(event) => setField("bestContactTime", event.target.value)}
                placeholder="Evenings, weekends, UTC-5 mornings"
                value={formState.bestContactTime}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              name="context"
              onChange={(event) => setField("context", event.target.value)}
              placeholder="Share the situation, what changed, and what kind of support you need."
              value={formState.context}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The browser encrypts this payload before submission. The API only receives ciphertext
              plus limited coarse metadata.
            </p>
            <Button disabled={status === "submitting"} size="lg" type="submit">
              {status === "submitting" ? "Encrypting and sending..." : "Submit encrypted intake"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
