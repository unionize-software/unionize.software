# Contributing

unionize.software is an open-source public resource for workers. Changes should make the project easier to inspect, run, adapt, and trust without increasing the amount of sensitive worker information it collects.

## Set up the repository

Requirements:

- Node.js 22 through 24
- pnpm 10.19.0
- Git

```bash
git clone https://github.com/unionize-software/unionize.software.git
cd unionize.software
pnpm install --frozen-lockfile
pnpm dev
```

Copy `.env.example` to `.env.local` only when testing configured intake. Never commit real keys, credentials, worker messages, or campaign data.

## Before opening a pull request

Run the checks relevant to the change. The complete merge suite is:

```bash
pnpm check:mcp-package
pnpm exec tsc --noEmit
pnpm content:audit
pnpm build
PLAYWRIGHT_SKIP_LIVE_INTAKE=1 pnpm test
pnpm test:mcp
pnpm test:mcp:integration
terraform fmt -check -recursive infra/terraform
bash infra/lambda/intake/build.sh
terraform -chdir=infra/terraform/bootstrap validate
terraform -chdir=infra/terraform/main validate
docker compose config --quiet
```

On PowerShell, set the Playwright variable with `$env:PLAYWRIGHT_SKIP_LIVE_INTAKE='1'` before running `pnpm test`, and use `./infra/lambda/intake/build.ps1` instead of the shell Lambda build script.

## Content changes

Read `docs/STYLE_GUIDE.md`, `docs/PAGE_TEMPLATES.md`, and `docs/CONTENT_REVIEW.md` before editing guides.

- Keep jurisdiction, legal scope, intended use, risk, source footing, review status, and review date accurate.
- Put legal and documented claims near the source that supports them.
- Do not change `review_status` to a completed review unless the named qualified reviewer actually performed it.
- Illustrative scenarios must be identifiable as examples, not reported events.
- After changing canonical guides or MCP logic, run `pnpm sync:mcp-package` and commit the generated package changes.

## Safety and privacy rules

- Do not add analytics, session replay, ad pixels, or behavioral tracking.
- Do not connect LLM features to pathfinder answers or organizer intake.
- Do not store coworker maps, committee rosters, or campaign CRM data without a new threat model and explicit project decision.
- Do not add sabotage, evasion, data poisoning, credential theft, or falsified-work guidance.
- Keep security claims backed by code, tests, and documentation.

## Infrastructure changes

Do not include Terraform state, private keys, deployment credentials, live intake exports, or real campaign identifiers. Explain the trust boundary and rollback path for changes to intake, encryption, retention, IAM, storage, DNS, or deployment.

## Licensing

Code contributions are submitted under AGPL-3.0-or-later. Original written material contributed under `content/` is submitted under CC BY-SA 4.0. Do not add third-party material unless its license and attribution permit redistribution here.
