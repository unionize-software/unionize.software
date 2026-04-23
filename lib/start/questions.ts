export type BinaryAnswer = "yes" | "no";
export type TernaryAnswer = "yes" | "no" | "unsure";
export type WorkerStatus = "employee" | "contractor" | "unsure";
export type WorkplaceType =
  | "big tech"
  | "startup"
  | "game studio"
  | "agency/consultancy"
  | "vendor/staffing"
  | "media/tech"
  | "other";
export type WorkArrangement =
  | "mostly in-person"
  | "hybrid"
  | "mostly remote/distributed";
export type RoleFamily =
  | "full-stack/frontend/backend"
  | "infra/SRE/platform"
  | "AI/ML/data"
  | "QA/test"
  | "game dev"
  | "design/product"
  | "IT/support"
  | "technical writing/docs"
  | "other";
export type TopIssue =
  | "AI surveillance"
  | "layoffs/severance"
  | "pay/promotions"
  | "on-call/burnout"
  | "crunch"
  | "retaliation"
  | "discrimination/exclusion"
  | "contractor/vendor issues"
  | "other";
export type TrustedCoworkerCount = "none yet" | "1-3 trusted coworkers" | "4+ trusted coworkers";

export type StartAnswers = {
  inUnitedStates: BinaryAnswer;
  privateSectorEmployer: TernaryAnswer;
  workerStatus: WorkerStatus;
  supervisoryAuthority: TernaryAnswer;
  workplaceType: WorkplaceType;
  workArrangement: WorkArrangement;
  roleFamily: RoleFamily;
  topIssue: TopIssue;
  trustedCoworkers: TrustedCoworkerCount;
  retaliationRisk: BinaryAnswer;
  organizerContact: BinaryAnswer;
};

type StartQuestionOption = {
  value: string;
  label: string;
  description?: string;
};

export type StartQuestionId = keyof StartAnswers;

export type StartQuestion = {
  id: StartQuestionId;
  prompt: string;
  description?: string;
  options: StartQuestionOption[];
};

export const startQuestions: StartQuestion[] = [
  {
    id: "inUnitedStates",
    prompt: "Are you in the United States?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "privateSectorEmployer",
    prompt: "Is your employer private-sector?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "workerStatus",
    prompt: "Are you an employee, contractor, or unsure?",
    options: [
      { value: "employee", label: "Employee" },
      { value: "contractor", label: "Contractor" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "supervisoryAuthority",
    prompt: "Do you hire, fire, discipline, assign, or evaluate others?",
    description: "Supervisory authority can change which protections and organizing structures apply.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "workplaceType",
    prompt: "What kind of workplace?",
    options: [
      { value: "big tech", label: "Big tech" },
      { value: "startup", label: "Startup" },
      { value: "game studio", label: "Game studio" },
      { value: "agency/consultancy", label: "Agency or consultancy" },
      { value: "vendor/staffing", label: "Vendor or staffing" },
      { value: "media/tech", label: "Media or tech" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "workArrangement",
    prompt: "How does the work actually happen most of the time?",
    description:
      "Organizing mechanics are different when coworkers overlap in person, split time, or mainly work across personal devices and time zones.",
    options: [
      { value: "mostly in-person", label: "Mostly in-person" },
      { value: "hybrid", label: "Hybrid" },
      { value: "mostly remote/distributed", label: "Mostly remote or distributed" },
    ],
  },
  {
    id: "roleFamily",
    prompt: "What role family?",
    options: [
      { value: "full-stack/frontend/backend", label: "Full-stack, frontend, or backend" },
      { value: "infra/SRE/platform", label: "Infra, SRE, or platform" },
      { value: "AI/ML/data", label: "AI, ML, or data" },
      { value: "QA/test", label: "QA or test" },
      { value: "game dev", label: "Game development" },
      { value: "design/product", label: "Design or product" },
      { value: "IT/support", label: "IT or support" },
      { value: "technical writing/docs", label: "Technical writing or docs" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "topIssue",
    prompt: "What issue brought you here?",
    options: [
      { value: "AI surveillance", label: "AI surveillance" },
      { value: "layoffs/severance", label: "Layoffs or severance" },
      { value: "pay/promotions", label: "Pay or promotions" },
      { value: "on-call/burnout", label: "On-call or burnout" },
      { value: "crunch", label: "Crunch" },
      { value: "retaliation", label: "Retaliation" },
      { value: "discrimination/exclusion", label: "Discrimination or exclusion" },
      { value: "contractor/vendor issues", label: "Contractor or vendor issues" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "trustedCoworkers",
    prompt: "Do you already have trusted coworkers to talk with off company systems?",
    options: [
      { value: "none yet", label: "None yet" },
      { value: "1-3 trusted coworkers", label: "1-3 trusted coworkers" },
      { value: "4+ trusted coworkers", label: "4 or more trusted coworkers" },
    ],
  },
  {
    id: "retaliationRisk",
    prompt: "Is there immediate retaliation risk?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "organizerContact",
    prompt: "Do you want to contact an organizer?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];
