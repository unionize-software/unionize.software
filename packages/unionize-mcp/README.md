# unionize-mcp

Read-only MCP server for the public unionize.software guide corpus and local Start Here pathfinder.

The website and this package use the same canonical guide and routing sources. Generated package files are checked with `pnpm check:mcp-package` so a release cannot quietly ship older guidance.

## Use from a repository clone

The package is not published to npm yet. Clone the canonical public repository instead of using an unresolved registry command:

```bash
git clone https://github.com/unionize-software/unionize.software.git
cd unionize.software
pnpm install
pnpm mcp:serve
```

The server communicates over stdio. Configure an MCP host to run:

- command: `node`
- args: `["./bin/unionize-software.mjs", "mcp", "serve"]`
- cwd: the absolute path to the cloned repository

## Public surface

- `unionize://catalog`
- `unionize://pathfinder/schema`
- `unionize://guides/<slug>`
- `unionize://states`
- `unionize://states/<code>`
- guide search and local pathfinder tools
- U.S. state worker-resource list and lookup tools
- issue-triage and first-conversation prompts
- public website and repository links

Encrypted organizer intake, private keys, and organizer-local data are deliberately outside the MCP surface.

## Maintainers

Run `pnpm sync:mcp-package` after changing canonical guides, pathfinder logic, metadata schemas, or the MCP server. CI runs `pnpm check:mcp-package` and fails on drift.

Publishing to npm is a separate, explicit release action. Do not document the registry command until the package exists publicly and a clean-machine smoke test passes.

## Licensing

Code is AGPL-3.0-or-later. Guide content is CC BY-SA 4.0. See `LICENSE` and `CONTENT_LICENSE.md` in the package.
