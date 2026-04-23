"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { StartAnswers } from "@/lib/start/questions";
import type { StartResult } from "@/lib/start/resultCopy";

type WizardSession = {
  answers: StartAnswers;
  result: StartResult;
};

type StartWizardContextValue = {
  session: WizardSession | null;
  setSession: (session: WizardSession | null) => void;
  clearSession: () => void;
};

const StartWizardContext = createContext<StartWizardContextValue | undefined>(undefined);

export function StartWizardProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<WizardSession | null>(null);

  const value = useMemo<StartWizardContextValue>(
    () => ({
      session,
      setSession,
      clearSession: () => setSession(null),
    }),
    [session],
  );

  return <StartWizardContext.Provider value={value}>{children}</StartWizardContext.Provider>;
}

export function useStartWizardSession() {
  const context = useContext(StartWizardContext);

  if (!context) {
    throw new Error("useStartWizardSession must be used within StartWizardProvider");
  }

  return context;
}

