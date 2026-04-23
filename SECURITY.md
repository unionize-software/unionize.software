# Security

## Reporting

Report security issues privately. Do not file public GitHub issues that include worker names, employer names, intake contents, private keys, tokens, or reproduction steps that expose sensitive data.

Until a dedicated security mailbox is provisioned, maintainers should handle reports through a private, access-controlled channel and keep the report body minimal.

## Scope

V1 security priorities are:

- no analytics or behavioral tracking
- no server-side storage for Start Here answers
- browser-side encryption for organizer intake
- coarse metadata only in storage
- intake expiry and purge workflow
- origin, payload-size, and rate controls on intake submission
- row-level security on intake tables

## Out of scope for V1

- committee workspaces
- coworker mapping storage
- campaign CRM
- chat or public discussion systems
