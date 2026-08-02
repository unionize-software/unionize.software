# unionize.software

Privacy-first public resource and decision-routing site for U.S. private-sector software and game workers.

## Principles

- The public site is content-first.
- The `Start Here` wizard stores nothing on the server.
- Organizer intake is encrypted in the browser before submission.
- No analytics, session replay, ad pixels, or behavioral tracking.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui-style components with Radix primitives
- Local MDX content with Zod frontmatter validation
- unionize-software CLI + local MCP server for agent access
- Supabase Postgres + Drizzle ORM
- Playwright tests

## Local Development

1. Use Node `22.x` through `24.x` and `pnpm`.
   The current workspace has been validated on Node `22.21.0`.
2. Copy `.env.example` to `.env.local`.
3. Fill in the public intake key and Supabase credentials.
4. Publish the intake key ID, SHA-256 fingerprint, and rotation date together.
5. Install dependencies with `pnpm install`.
6. Start the app with `pnpm dev`.

The Next config uses a development-only build directory, so `pnpm dev` does not collide with production build output.

With `pnpm`, CLI flags can be passed directly. For example:

```bash
pnpm dev --hostname 127.0.0.1 --port 3001
```

## CLI And MCP

The repo now ships a small CLI and a local MCP server so agents and automation can consume the public guide corpus without scraping rendered pages.

Examples:

```bash
pnpm unionize guides list
pnpm unionize guides search "retaliation" --tag retaliation
pnpm unionize start schema --json
pnpm unionize start recommend --answers '{"inUnitedStates":"yes","privateSectorEmployer":"yes","workerStatus":"employee","supervisoryAuthority":"no","workplaceType":"startup","workArrangement":"hybrid","roleFamily":"full-stack/frontend/backend","topIssue":"AI surveillance","trustedCoworkers":"1-3 trusted coworkers","retaliationRisk":"no","organizerContact":"no"}'
pnpm mcp:serve
```

The MCP server exposes:

- `unionize://catalog`
- `unionize://pathfinder/schema`
- `unionize://guides/<slug>`
- prompts for triage and first-conversation planning
- tools for guide search, project links, and pathfinder routing

See [`/tooling`](https://unionize.software/tooling) in the deployed site or [app/tooling/page.tsx](app/tooling/page.tsx) in the repo.

## OpenClaw

OpenClaw can load workspace skills from `skills/` and register MCP servers with `openclaw mcp set`.

This repo includes a starter skill at [`skills/unionize-organizing/SKILL.md`](skills/unionize-organizing/SKILL.md).

Local MCP registration example:

```bash
openclaw mcp set unionize "{\"command\":\"node\",\"args\":[\"./bin/unionize-software.mjs\",\"mcp\",\"serve\"],\"cwd\":\"/absolute/path/to/unionize.software\"}"
```

Public source repository:

- `https://github.com/unionize-software/unionize.software`

## Testing

- `pnpm test` runs Playwright against a static build (`out/`) served locally (`next start` does not support `output: "export"`).
- Four tests POST to the **deployed** intake API (`https://api.unionize.software/intake` by default). They **auto-skip** when that host is unreachable (no DNS / not deployed). To skip them without probing, set `PLAYWRIGHT_SKIP_LIVE_INTAKE=1`. Override the URL with `PLAYWRIGHT_INTAKE_URL`.

## Local Intake Dashboard (organizers only)

The CLI can run a **localhost-only** dashboard that reads the local intake cache at `~/.unionize/intakes.sqlite`.

Workflow:

1. Sync from AWS into the local DB:

```bash
AWS_REGION=us-east-1 INTAKE_TABLE_NAME="..." CIPHERTEXT_BUCKET_NAME="..." node bin/unionize-software.mjs intake sync
```

1. Start the local dashboard:

```bash
node bin/unionize-software.mjs intake dashboard --port 4317
```

If you want the dashboard to support **decrypt on demand**, pass the private key path:

```bash
node bin/unionize-software.mjs intake dashboard --port 4317 --private-key ./keys/organizer-private.key
```

The private key is never stored in the database; it stays on the organizer machine.

## Self-host (Docker Compose)

For non-AWS self-hosting (single box), `docker-compose.yml` runs:

- `site`: serves the static export in `out/` at `http://localhost:3000`
- `intake_api`: accepts encrypted POSTs at `http://localhost:3010/intake` and stores to `./data/selfhost/`

Steps:

```bash
pnpm build
docker compose up --build
```

Then set the site build-time env:

- `NEXT_PUBLIC_INTAKE_API_URL="http://localhost:3010/intake"`

If you also want the organizer dashboard to read self-hosted intakes, import them into the same local cache:

```bash
node bin/unionize-software.mjs intake import-selfhost --data-dir ./data/selfhost
node bin/unionize-software.mjs intake dashboard --port 4317
```

## AWS Amplify

The repo includes [amplify.yml](amplify.yml) for Amplify Hosting.

It assumes:

- `pnpm` installed during the Amplify `preBuild` phase
- `pnpm build` (Next.js with `output: "export"`) as the build command
- `out` as the artifact `baseDirectory` (static HTML/CSS/JS)

Before deploying, set branch environment variables, especially:

- `NEXT_PUBLIC_INTAKE_API_URL` (full URL, e.g. `https://api.unionize.software/intake`)
- public intake key fields (`NEXT_PUBLIC_INTAKE_PUBLIC_KEY_*`)
- any Supabase client credentials the app still needs at build/runtime

**CSP:** `headers()` in [next.config.ts](next.config.ts) are not applied for static export; enforce CSP in production via **CloudFront response headers policy** (or equivalent) if you need the same guarantees as the dev server.

## Local Intake Decryption

The repository never contains organizer private keys.

Use the local script after you export ciphertext from storage:

```bash
pnpm decrypt-intake --ciphertext "<base64-or-raw-ciphertext>" --private-key ./keys/organizer-private.key
```

The private key must remain on an organizer-controlled machine and must never be uploaded to Supabase, Vercel, GitHub, or any browser-accessible environment.

## Intake Operations

- `pnpm print-intake-key-fingerprint --public-key "<base64>"` prints the public key fingerprint for operator verification.
- `pnpm purge-expired-intakes --dry-run` previews expired ciphertext cleanup.
- `pnpm purge-expired-intakes` soft-deletes expired ciphertext and hard-deletes rows past the purge grace window.
- See [`docs/KEY_MANAGEMENT.md`](docs/KEY_MANAGEMENT.md) for rotation, revocation, and backup handling.

By default, encrypted intake rows are marked to expire after `30` days and should be purged `7` days after soft-delete.

## Licensing

- Source code outside `content/` is licensed under AGPL-3.0-or-later. See [LICENSE](LICENSE).
- Original written material in `content/` is licensed under CC BY-SA 4.0. See [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
- Third-party dependencies, fonts, and referenced source material retain their own licenses and attribution requirements.

Contributions are accepted under the license that applies to the part of the repository being changed.
