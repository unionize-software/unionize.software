export type ReadingPathStep = {
  title: string;
  href: string;
  label: string;
  description: string;
};

export type ReadingPath = {
  id: string;
  title: string;
  description: string;
  useWhen: string;
  caution: string;
  steps: ReadingPathStep[];
};

export const readingPaths: ReadingPath[] = [
  {
    id: "retaliation-risk",
    title: "Retaliation or discipline risk",
    description:
      "A safer route for workers who think management may already be watching, disciplining, isolating, or threatening people.",
    useWhen:
      "Use this when someone has been written up, questioned, excluded, threatened, or warned after raising a workplace issue.",
    caution:
      "Do not try to prove everything at once. Lower exposure, preserve concrete facts, and get support before escalating.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Lower exposure first",
        description:
          "Move sensitive notes and conversations away from company systems before the situation gets louder.",
      },
      {
        title: "Retaliation Warning Signs",
        href: "/resources/retaliation-warning-signs",
        label: "Name the risk",
        description:
          "Separate ordinary workplace friction from warning signs that deserve a calmer response.",
      },
      {
        title: "Retaliation Response Checklist",
        href: "/resources/retaliation-response-checklist",
        label: "Stabilize the next move",
        description:
          "Use a short sequence for preserving facts, avoiding public arguments, and deciding who needs support.",
      },
      {
        title: "Company Device and Account Safety Checklist",
        href: "/resources/company-device-and-account-safety-checklist",
        label: "Check the tools",
        description:
          "Review company devices, accounts, chat, email, tickets, and docs before moving sensitive material.",
      },
      {
        title: "Protected Concerted Activity",
        href: "/resources/protected-concerted-activity",
        label: "Understand the basic rights frame",
        description:
          "Learn the basic idea behind workers acting together over pay, hours, surveillance, workload, and conditions.",
      },
      {
        title: "Talk to an organizer",
        href: "/talk-to-organizer",
        label: "Get outside support",
        description:
          "Use the encrypted intake from a personal device if you need help thinking through risk quickly.",
      },
    ],
  },
  {
    id: "ai-surveillance",
    title: "AI surveillance or worker data",
    description:
      "A route for workers facing monitoring, productivity scoring, AI training data collection, screenshots, or activity tracking.",
    useWhen:
      "Use this when a tool rollout affects more than one person and workers need to compare facts before reacting.",
    caution:
      "Treat the tool as a workplace issue, not only a privacy complaint. The leverage usually comes from shared conditions.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Start with safety",
        description:
          "Keep notes and conversations off company systems before comparing monitoring details.",
      },
      {
        title: "AI Surveillance and Worker Data",
        href: "/resources/ai-surveillance-worker-data",
        label: "Frame the issue",
        description:
          "Understand how surveillance, data collection, discipline, and bargaining issues can connect.",
      },
      {
        title: "My Employer Is Tracking Computer Activity for AI Training",
        href: "/resources/keystroke-tracking-ai-training",
        label: "Check the concrete pattern",
        description:
          "Use this for keystrokes, screenshots, app activity, computer-use tracking, and AI training claims.",
      },
      {
        title: "What to Preserve Checklist",
        href: "/resources/what-to-preserve-checklist",
        label: "Preserve facts",
        description:
          "Record policies, dates, rollout messages, affected groups, and discipline connections without over-collecting.",
      },
      {
        title: "Remote, Hybrid, and Distributed Organizing",
        href: "/resources/remote-hybrid-and-distributed-organizing",
        label: "Match the work mode",
        description:
          "Adapt the organizing mechanics if the monitoring problem is spread across teams, offices, or time zones.",
      },
    ],
  },
  {
    id: "layoffs-severance",
    title: "Layoffs, severance, or restructuring",
    description:
      "A route for workers trying to stay steady while jobs, teams, or severance terms are changing quickly.",
    useWhen:
      "Use this when layoffs, performance management, severance, reorgs, or WARN-style notice questions are in the air.",
    caution:
      "Avoid turning fear into rumor. Preserve documents, compare what people were told, and keep support channels careful.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Lower avoidable risk",
        description:
          "Keep sensitive notes and worker conversations outside company systems before comparing layoff facts.",
      },
      {
        title: "Layoffs and Severance",
        href: "/resources/layoffs-severance",
        label: "Understand the problem",
        description:
          "Use this when notice, severance, timing, selection, or post-layoff pressure becomes a shared issue.",
      },
      {
        title: "What to Preserve Checklist",
        href: "/resources/what-to-preserve-checklist",
        label: "Save the record",
        description:
          "Track dates, messages, severance deadlines, policy changes, and inconsistent explanations.",
      },
      {
        title: "Retaliation Warning Signs",
        href: "/resources/retaliation-warning-signs",
        label: "Watch the pressure",
        description:
          "Check whether discipline, isolation, or threats are appearing around workers who ask questions together.",
      },
      {
        title: "Recognition, Majority Support, and Going Public",
        href: "/resources/recognition-majority-support-and-going-public",
        label: "Do not guess at support",
        description:
          "If people want a public move, slow down and test whether support is real enough to carry it.",
      },
    ],
  },
  {
    id: "contractor-vendor-status",
    title: "Contractor, vendor, or supervisor-status questions",
    description:
      "A route for workers whose title, vendor chain, public-sector status, or authority may change the organizing lane.",
    useWhen:
      "Use this when the worker is a contractor, vendor employee, lead, manager, public-sector worker, or unsure which rules fit.",
    caution:
      "Do not force everyone into the same legal lane. Status questions can change roles, risks, and who should do what.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Start small",
        description:
          "Keep the first status-mapping conversations narrow and away from company accounts.",
      },
      {
        title: "Contractor, Vendor, and Misclassification Questions",
        href: "/resources/contractor-vendor-misclassification",
        label: "Map the employment facts",
        description:
          "Clarify payroll, supervision, control, vendor chain, and the practical facts behind the title.",
      },
      {
        title: "Supervisor Status and Exclusion Questions",
        href: "/resources/supervisor-status-and-exclusion",
        label: "Check actual authority",
        description:
          "Distinguish title from real authority before someone takes on a visible organizing role.",
      },
      {
        title: "Protected Concerted Activity",
        href: "/resources/protected-concerted-activity",
        label: "Compare to the main lane",
        description:
          "Use the basic rights frame as orientation, then check whether the worker actually fits it.",
      },
      {
        title: "First Organizing Conversation Checklist",
        href: "/resources/first-organizing-conversation-checklist",
        label: "Talk carefully",
        description:
          "Keep early conversations about status concrete, private, and grounded in what people know firsthand.",
      },
    ],
  },
  {
    id: "early-organizing",
    title: "Early organizing with one or two trusted coworkers",
    description:
      "A route for workers who are not ready for a public move and need a disciplined way to compare notes.",
    useWhen:
      "Use this when there is a real issue, but the group is still small and trust matters more than speed.",
    caution:
      "Do not create a big channel and hope trust appears later. Start with one-to-one conversations and a real workplace map.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Set the floor",
        description:
          "Use personal devices and keep the first steps modest before asking anyone to take risk.",
      },
      {
        title: "First Organizing Conversation Checklist",
        href: "/resources/first-organizing-conversation-checklist",
        label: "Have the first careful talk",
        description:
          "Ask better questions, listen for shared stakes, and avoid making the first conversation a pitch.",
      },
      {
        title: "Workplace Mapping",
        href: "/resources/workplace-mapping",
        label: "Map people and structure",
        description:
          "Turn a vague sense of support into teams, shifts, reporting lines, influence, and trust.",
      },
      {
        title: "Remote, Hybrid, and Distributed Organizing",
        href: "/resources/remote-hybrid-and-distributed-organizing",
        label: "Adjust to the workplace",
        description:
          "Make sure remote-heavy, hybrid, and in-person workers are not treated as the same organizing problem.",
      },
      {
        title: "What Not to Do Checklist",
        href: "/resources/what-not-to-do-checklist",
        label: "Avoid easy mistakes",
        description:
          "Use this before people rush into public posts, company-channel arguments, or loose group chats.",
      },
    ],
  },
  {
    id: "game-worker-crunch",
    title: "Game worker crunch, QA, vendor, or launch pressure",
    description:
      "A route for game workers dealing with crunch, post-launch layoffs, QA or vendor precarity, and production pressure.",
    useWhen:
      "Use this when the workplace is a studio, QA shop, outsource vendor, publisher team, or game-adjacent workplace.",
    caution:
      "Crunch is not only a workload complaint. It often connects to staffing, release timing, vendor status, layoffs, and who has leverage.",
    steps: [
      {
        title: "Safety Basics Before You Organize",
        href: "/resources/safety-basics",
        label: "Protect the basics",
        description:
          "Keep early conversations off studio systems, especially around launch, layoffs, or vendor renewals.",
      },
      {
        title: "Game Worker Crunch",
        href: "/resources/game-worker-crunch",
        label: "Name the pattern",
        description:
          "Understand crunch as a workplace issue shaped by production schedules, staffing, vendors, and releases.",
      },
      {
        title: "Layoffs and Severance",
        href: "/resources/layoffs-severance",
        label: "Connect the cycle",
        description:
          "Use this when launch pressure, restructuring, or post-release cuts are part of the same problem.",
      },
      {
        title: "Contractor, Vendor, and Misclassification Questions",
        href: "/resources/contractor-vendor-misclassification",
        label: "Check status",
        description:
          "Map QA, embedded vendors, contractors, outsourced teams, and who controls the day-to-day work.",
      },
      {
        title: "First Organizing Conversation Checklist",
        href: "/resources/first-organizing-conversation-checklist",
        label: "Start with trusted coworkers",
        description:
          "Use one careful conversation before turning crunch anger into a visible campaign move.",
      },
    ],
  },
];
