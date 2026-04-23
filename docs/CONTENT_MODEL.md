# Content Model

The wiki should not grow as a loose pile of decent pages. Every page needs a job, and that job should be visible in metadata.

## Page Types

- `playbook`
  Use for issue lanes, campaign-stage guidance, and strategic pages that explain what is happening, why it matters, and what kind of next move the page supports.
- `checklist`
  Use for short operational pages that help someone do one thing under stress.
- `reference`
  Use for status questions, exclusions, definitions, and plain-English grounding pages.
- `evidence`
  Use for sourced arguments about scale, history, leverage, and what collective bargaining can change.

## Required Guide Frontmatter

Every guide must declare:

- `title`
- `slug`
- `category`
- `page_type`
- `jurisdiction`
- `legal_scope`
- `last_reviewed`
- `review_status`
- `risk_level`
- `source_status`
- `when_to_use`
- `not_for`
- `collections`
- `related_slugs`

Pages may also declare:

- `sources`

Use `sources` for `mixed` and `source-backed` pages when you want the resource page to render a structured source rail. Each source should include:

- `title`
- `url`
- `publisher`
- `kind`
- optional `note`

## Collection IDs

Collections drive the wiki shelves on `/resources`.

- `issue-guides`
- `work-modes`
- `worker-status`
- `campaign-stages`
- `checklists-tools`
- `reference`
- `evidence-leverage`

Collections are not the same thing as page types. A `reference` page can still appear in `worker-status`, and a `playbook` can appear in `campaign-stages` or `work-modes`.

## Source Status

- `practice-based`
  Use when the page mainly reflects organizing judgment, campaign hygiene, or practical experience and does not yet carry a formal source list.
- `mixed`
  Use when the page blends sourced claims with practical guidance. Prefer a structured `sources` list unless the page genuinely needs a fuller narrative `Sources` section in the body.
- `source-backed`
  Use when the page makes evidence-heavy claims and should include an explicit source list, a structured `sources` list, or both.

## Metadata Rules

- `when_to_use` should tell a worker when this page is the right one, in one sentence.
- `not_for` should define the page boundary clearly, not defensively.
- `related_slugs` should point to the next 2 to 4 pages that genuinely deepen the path.
- `review_status` should stay honest. Do not imply legal review or subject-matter review that did not happen.
- Keep source metadata tight. The rail should list the sources the page actually leans on, not every vaguely relevant link the author found.
