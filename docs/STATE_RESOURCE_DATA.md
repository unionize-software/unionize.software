# U.S. state worker-resource data

The canonical state directory lives in `lib/jurisdictions/usStates.ts`. It covers all 50 states and the District of Columbia. D.C. is explicitly typed as a federal district rather than counted as a state.

## What the first release contains

Each jurisdiction record includes:

- the state labor agency name and official agency route;
- the U.S. Department of Labor source entry for that agency;
- state-law topic and federal Wage and Hour Division routes;
- the current OSHA jurisdiction class and official OSHA route;
- the EEOC Fair Employment Practices Agency and dual-filing route;
- an official state-government route for primary-law follow-up;
- a public-sector legal-review gate;
- source IDs, a verification date, and a legal-review status.

The same records power:

- `/states` and `/states/<code>` on the public site;
- `unionize://states` and `unionize://states/<code>` in the MCP server;
- the `list_state_resources` and `get_state_resources` MCP tools.

## Claim boundary

This dataset answers, “Which official route should I inspect first?” It does not answer, “Am I covered?” or “Is this conduct lawful?”

Agency jurisdiction, worker status, employer type, occupation, local ordinances, deadlines, remedies, and recent amendments can change the answer. Public-sector collective-bargaining classifications remain `needs-jurisdiction-specific-review` until the relevant primary statute, administering authority, exclusions, and current amendments have been reviewed for that jurisdiction.

Do not add a state-law conclusion merely because a secondary table labels a state. Link the primary statute or current agency authority, date the review, and keep a human legal-review gate on consequential interpretations.

## Source hierarchy

1. Current state statute, regulation, or official administering-agency material for state-specific legal claims.
2. Current federal agency material for federal coverage and nationwide directories.
3. Congressional Research Service material for federal overview and variation across states.
4. Reputable practitioner material only as discovery support, never as the sole footing for a consequential legal conclusion.

The initial nationwide spine was checked on August 1, 2026 against:

- U.S. Department of Labor, Wage and Hour Division — State Labor Offices;
- U.S. Department of Labor — State Labor Laws and local WHD offices;
- Occupational Safety and Health Administration — State Plans;
- U.S. Equal Employment Opportunity Commission — FEPAs and dual filing;
- Congressional Research Service — public-sector unionization overview;
- USA.gov — state-government index.

## Validation

`pnpm states:audit` fails when:

- the exact 50-state-plus-D.C. postal-code set changes;
- codes, slugs, or source IDs are duplicated;
- OSHA category totals drift from the reviewed federal source;
- an external route is not HTTPS;
- a record references an unknown source; or
- the public-sector review gate is removed.

Network reachability is not used as a CI gate because government websites can block automated clients or change edge behavior without changing the underlying authority. Maintainers should re-check upstream pages, redirects, and legal classifications on a dated review cadence.
