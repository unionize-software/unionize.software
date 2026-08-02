# Security policy

## Report a vulnerability privately

Do not open a public issue containing worker names, employer names, intake contents, private keys, credentials, sensitive logs, or reproduction steps that would expose worker data.

Use [GitHub private vulnerability reporting](https://github.com/unionize-software/unionize.software/security/advisories/new). Include only the minimum information needed to reproduce and assess the issue. Maintainers can request additional detail inside the private advisory.

If private vulnerability reporting is unavailable, open a public issue containing no sensitive detail and ask a maintainer to establish a private channel. Do not attach an exploit, secret, intake record, or identifying context to that issue.

## In scope

Security priorities include:

- public browsing and the local-only Start Here pathfinder
- browser-side organizer-intake encryption
- public-key publication and rotation
- intake API origin, schema, size, and rate controls
- ciphertext storage, expiry, purge, and organizer-local decryption
- IAM, Terraform, Docker, and deployment configuration
- accidental logging or exposure of sensitive fields
- MCP or CLI access crossing into private organizer data

## Deliberately absent

The first release does not include committee workspaces, coworker-map storage, campaign CRM, accounts, chat, or public discussion systems. A proposal to add one of those systems requires a new threat model before implementation.

## Disclosure

Please allow maintainers a reasonable opportunity to investigate and release a fix before public disclosure. This policy does not promise a bounty or a particular response time.
