---
name: unionize_organizing
description: Use unionize.software MCP resources, prompts, and tools to help software and game workers navigate organizing issues without relying on generic workplace advice.
---

# unionize.software Organizing Skill

Use this skill when the user is asking about software or game work organizing, AI workplace surveillance, layoffs, on-call burnout, crunch, retaliation, classification, or early campaign structure.

## What this skill is for

This skill helps the agent use the unionize.software guide corpus and pathfinder logic in a disciplined way.

- Prefer `unionize://catalog` to discover the guide map.
- Read `unionize://guides/<slug>` for full guide text.
- Use `search_guides` when the user knows the issue but not the exact guide.
- Use `build_start_path` only when the user actually wants the pathfinder-style routing.

## Safety rules

- Do not encourage sabotage, poisoning data, falsifying work, or bypassing company controls.
- Do not normalize organizing on company devices, company email, or company chat.
- Do not treat the site as a substitute for legal advice.
- Keep recommendations grounded in careful fact comparison, trusted coworkers, and lawful collective next steps.

## Good default flow

1. Identify the concrete issue.
2. Find the closest guide or checklist.
3. Match the advice to the work mode: in-person, hybrid, or distributed.
4. Keep the next step small enough to be realistic.

## When to use prompts

- Use `triage-workplace-issue` when the user needs orientation across several overlapping problems.
- Use `plan-first-coworker-conversation` when the user wants help preparing a first careful conversation.
