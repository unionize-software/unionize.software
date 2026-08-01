# Merge and release gates

GitHub reporting a branch as mergeable means only that Git can combine it without a known conflict. A change is ready for `main` when the applicable technical and human gates below are complete.

## Required technical gates

- Quality, MCP integration, browser, and infrastructure CI jobs pass on the exact head commit.
- The branch is current with `main` and has no unresolved review threads.
- Canonical website and packaged MCP sources pass `pnpm check:mcp-package`.
- Installation instructions have been tested from a clean checkout.
- Public documentation does not advertise an unpublished package or stale repository URL.
- Terraform validates and passes recursive formatting checks.
- Docker Compose configuration parses successfully.
- Security-sensitive changes document their data flow, trust boundary, retention behavior, and rollback path.

## Human gates

These statuses cannot be created by automation or by changing frontmatter alone:

- A qualified U.S. labor-law reviewer must review pages marked `needs-labor-lawyer-review` before those pages are represented as legally reviewed.
- A qualified worker-cooperative practitioner must review pages marked `needs-coop-practitioner-review` before that status changes.
- A reviewer independent from the implementation must assess intake encryption, key handling, IAM, retention, logging, and deployment changes before a production release.

The visible review labels may remain open when draft material is merged for continued work, but a public production release must state those limits accurately. Never close a human gate merely to make CI green.

## Release-only gates

- Verify the deployed site and intake endpoint separately from pull-request CI.
- Publish the MCP package only through an explicit release action with a version, provenance, and clean-machine smoke test.
- Confirm the npm package exists before documenting an `npx` command.
- Verify DNS, TLS, CSP/response headers, retention automation, and key fingerprints in the deployed environment.
