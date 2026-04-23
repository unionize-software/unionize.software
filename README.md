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
openclaw mcp set unionize "{\"command\":\"node\",\"args\":[\"./bin/unionize-software.mjs\",\"mcp\",\"serve\"],\"cwd\":\"/absolute/path/to/unionize-software-webapp\"}"
```

Planned public source repository:

- https://github.com/unionize-software/unionize-software-webapp

## AWS Amplify

The repo now includes [amplify.yml](amplify.yml) for Amplify Hosting.

It assumes:

- a standard single-app Next.js deployment
- `pnpm` installed during the Amplify `preBuild` phase
- `pnpm build` as the build command
- `.next` as the artifact `baseDirectory`

Before deploying, set the required environment variables in Amplify for the branch you are shipping, especially the public intake key values and any server-side Supabase credentials the app needs at runtime.

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
