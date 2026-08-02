# Content Review

Legal and strategic content rots. Public labor guidance should be dated, scoped, and reviewable.

## Required metadata

Every guide must include:

- `title`
- `slug`
- `category`
- `jurisdiction`
- `legal_scope`
- `last_reviewed`
- `review_status`
- `risk_level`

## Review rules

- Scope the jurisdiction explicitly.
- Label content as educational, not legal advice.
- Date each review.
- Flag whether labor-lawyer review or subject-matter review is still needed.
- Remove or update stale guidance instead of letting it linger undated.

## Claim review

Review each substantive claim as one of the following:

- documented fact
- legal orientation
- organizing practice
- strategic judgment
- illustrative scenario

For documented facts and legal orientation, confirm that the nearby source supports the actual sentence, not merely the general topic. For organizing practice and strategic judgment, make the reasoning and limits visible. Label illustrative scenarios so a reader cannot mistake them for reported events.

## Review order

Review work in this order:

1. high-risk retaliation, safety, surveillance, layoff, and worker-status pages
2. medium-risk playbooks and campaign-stage guidance
3. low-risk evidence and historical pages
4. institutional, privacy, security, and tooling pages

High-risk pages should receive source review before prose polish is treated as complete. A smoother sentence is not an accuracy improvement by itself.

## Editorial readiness gate

Before changing `review_status`, record who performed the review and what kind of review occurred. Do not collapse these into one label:

- source accuracy
- labor-law review
- organizing-practice review
- security or privacy review
- copy and structure review

Run `pnpm content:audit` before merging a corpus change. Treat its warnings as an editorial queue, not as proof that a page is correct.
