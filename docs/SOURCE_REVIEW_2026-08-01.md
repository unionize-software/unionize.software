# Source and Claim Review — 2026-08-01

## Scope and reviewer boundary

This review covers all 29 public guides, the public privacy and security pages, the editorial audit, and the intake implementation claims those pages make.

The review used four explicit lenses:

1. **U.S. labor-law orientation:** Does the sentence identify the jurisdiction, worker-coverage question, legal test, procedural limit, and current primary authority without presenting orientation as advice?
2. **Organizing practice:** Does practical guidance state its reasoning, tradeoff, and safety boundary without disguising judgment as law?
3. **Worker-cooperative practice:** Does the page distinguish democratic ownership principles from entity, tax, securities, employment, financing, and governance implementation?
4. **Privacy and security:** Does each public claim match the code and infrastructure, and does it distinguish encryption, minimization, retention, abuse control, authentication, and anonymity?

This was an AI-assisted source and implementation audit. It is not a labor-law opinion, a cooperative-development consultation, an independent security assessment, or a substitute for the human gates in [MERGE_GATES.md](MERGE_GATES.md). Existing `needs-labor-lawyer-review` and `needs-coop-practitioner-review` flags remain open.

## Source standard

The audit preferred, in order:

- statute or official legal text
- the agency responsible for the procedure or enforcement area
- official statistical releases
- direct peer-reviewed research
- international standard-setting institutions
- established practitioner organizations for practice definitions

Sources were accepted only for the claim they actually support. Agency explainers were not treated as court holdings. A proposed rule was labeled proposed. An industry estimate remained labeled as an estimate. Practice guidance did not receive decorative citations when no source could convert judgment into a documented fact.

## Material findings and corrections

### 1. Rescinded electronic-monitoring guidance

Three pages relied on a 2022 NLRB General Counsel memo as though it remained current. The NLRB's [GC 25-05 notice](https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda) states that GC Memo 23-02 was rescinded on February 14, 2025.

The monitoring pages now:

- identify the rescission directly
- avoid claiming that invasive monitoring is automatically unlawful
- ground collective-action claims in the current [NLRB concerted-activity page](https://www.nlrb.gov/about-nlrb/rights-we-protect/the-law/employees/concerted-activity)
- ground disability-related automated-employment claims in the [EEOC AI and ADA resources](https://www.eeoc.gov/eeoc-disability-related-resources/artificial-intelligence-and-ada)
- keep digital-safety advice on CISA and EFF footing

The editorial audit now rejects the rescinded URL if it is reintroduced.

### 2. Recognition thresholds were mixed with campaign readiness

The recognition guide now separates legal procedure from organizing judgment. The NLRB's [election overview](https://www.nlrb.gov/about-nlrb/what-we-do/conduct-elections) supports the 30 percent petition showing, majority-of-votes-cast election rule, certification consequence, and voluntary-recognition route based on majority support. None of those thresholds proves that a campaign is structurally ready for a public move.

### 3. Worker classification used one test too broadly

The contractor guide now distinguishes:

- NLRA coverage and the NLRB's worker-classification doctrine
- the IRS common-law test for federal tax purposes
- the Department of Labor's economic-reality analysis for federal wage law
- state-law and contract questions

The [IRS Form SS-8 instructions](https://www.irs.gov/businesses/small-businesses-self-employed/completing-form-ss-8) now support only the tax-status claim. The guide also identifies the [February 2026 DOL proposal](https://www.dol.gov/agencies/whd/flsa/misclassification/2026rulemaking) as proposed and therefore changeable, not as settled law.

### 4. Filing clocks needed visible boundaries

The protected-activity and retaliation pages now state that NLRB charges generally must be filed within six months, based on the [NLRB FAQ](https://www.nlrb.gov/resources/faq/nlrb). They also warn that other forums use different clocks.

The discrimination page now distinguishes an internal HR report from an EEOC charge and links the EEOC's [time-limit guidance](https://www.eeoc.gov/time-limits-filing-charge). It does not calculate a reader's deadline.

### 5. Bargaining claims needed both the duty and its limit

The first-contract and collective-bargaining pages now cite the NLRB's [employer and union obligations](https://www.nlrb.gov/about-nlrb/rights-we-protect/your-rights/employer-union-rights-and-obligations): parties must bargain in good faith over mandatory subjects, but neither side is compelled to agree or make concessions. Empirical wage, benefit, inequality, and spillover claims remain tied to the [Treasury research synthesis](https://home.treasury.gov/news/featured-stories/labor-unions-and-the-us-economy).

### 6. International standards needed a ratification warning

The international guide no longer calls Convention No. 87 a universally enforceable floor. It identifies the convention as an international benchmark and directs readers to the ILO's [current instrument and ratification profile](https://normlex.ilo.org/dyn/nrmlx_en/f?p=NORMLEXPUB:12201:0::NO::P12201_INSTRUMENT_ID:312232). Domestic effect still depends on ratification, implementation, and local law.

### 7. Cooperative principles needed institutional footing

The cooperative page now distinguishes a worker cooperative from a generally participatory company. Its definition is tied to the [U.S. Federation of Worker Cooperatives](https://www.usworker.coop/what-is-a-worker-cooperative/), its democratic principles to the [International Cooperative Alliance](https://ica.coop/en/cooperatives/cooperative-identity), and its formation resources to [USDA Cooperative Services](https://www.rd.usda.gov/programs-services/services/cooperative-services). The practitioner-review gate remains open because sources cannot validate a particular entity design.

### 8. One security claim exceeded the implementation

The public security and internal privacy pages said the intake route was rate-limited, while the deployed Terraform path had no active rate-limit attachment. The AWS configuration now applies API Gateway stage throttling. Documentation now calls this a coarse capacity and abuse control, not authentication, per-person fairness, or anonymity, and tells self-hosted operators to supply equivalent boundary controls.

## Guide-by-guide disposition

| Guide | Disposition | Primary footing or reason |
| --- | --- | --- |
| AI Surveillance and Worker Data | Amended; legal gate open | Rescission, NLRB concerted activity, EEOC AI/ADA |
| Company Device and Account Safety Checklist | Amended | Removed rescinded labor source; retained CISA and EFF safety sources |
| Contractor, Vendor, and Misclassification Questions | Amended; legal gate open | NLRB, IRS, current DOL proposal; tests separated by legal purpose |
| Discrimination, Exclusion, and Organizing Safely | Amended; legal gate open | EEOC scope and time limits; NLRB collective-action boundary |
| First Contract Basics | Amended; legal gate open | NLRB bargaining duty and no-compelled-agreement limit |
| First Organizing Conversation Checklist | Practice review; legal gate open | Experience-based conversation sequence; no new legal claim |
| Game Worker Crunch | Practice review; legal gate open | Illustrative scenario and worker-demand framework; wage questions deferred |
| My Employer Is Tracking Computer Activity for AI Training | Amended; legal gate open | Rescission, NLRB concerted activity, EEOC AI/ADA |
| Layoffs and Severance | Source footing retained; legal gate open | DOL WARN and Rapid Response pages; guide already limited WARN claims |
| On-Call, Burnout, and After-Hours Work | Amended; legal gate open | DOL hours-worked guidance and OSHA fatigue evidence |
| Organizing Conversations | Practice review; legal gate open | One-to-one organizing guidance; no claim of guaranteed legal protection |
| Organizing Glossary | Amended; legal gate open | NLRB definitions and procedure; contractor-test plurality made explicit |
| Outside the United States: Start Here | Amended | ILO benchmark plus ratification and domestic-law limitation |
| Pay Transparency, Leveling, and Promotions | Amended; legal gate open | NLRB wage discussion with exclusions; EEOC employment-decision scope |
| Protected Concerted Activity | Amended; legal gate open | Current NLRB definition, limits, exclusions, and general six-month clock |
| Public-Sector Workers: Start Here | Source footing retained | NLRB exclusion, FLRA statute, CRS state-law variation |
| Recognition, Majority Support, and Going Public | Amended; legal gate open | Current NLRB election and voluntary-recognition procedure |
| Remote, Hybrid, and Distributed Organizing | Practice review; legal gate open | Work-mode tradeoffs presented as practice, not doctrine |
| Retaliation Response Checklist | Amended | NLRB scope, remedies, and general six-month clock |
| Retaliation Warning Signs | Amended; legal gate open | NLRB interference examples, remedies, and general six-month clock |
| Safety Basics Before You Organize | Source footing retained; legal gate open | NLRB rights and conduct limits; practical advice remains conditional |
| Software Workers Are Numerous, Strategic, and Still Under-Organized | Metadata amended | BLS official counts/rates; SlashData clearly labeled industry estimate |
| Supervisor Status and Exclusion Questions | Source footing retained; legal gate open | NLRA Section 2(11), coverage page, official NLRB guide |
| What Collective Bargaining Can Change for Software Workers | Amended | Treasury evidence plus NLRB duty and no-compelled-agreement limit |
| What Not to Do Checklist | Practice review; legal gate open | Conduct and consent guardrails; uncertain evidence questions deferred |
| What to Preserve Checklist | Practice review; legal gate open | Evidence hygiene; expressly avoids unauthorized collection |
| Why Software Workers Have Been Slow to Unionize | Metadata amended | Two direct research articles; causal limits already visible |
| Worker Co-op Basics | Amended; practitioner gate open | USFWC, ICA, and USDA; entity-specific decisions deferred |
| Workplace Mapping | Practice review; legal gate open | Data-minimizing organizing practice; site does not store maps |

## Privacy and security claim trace

| Public claim | Repository evidence | Result |
| --- | --- | --- |
| Start Here answers stay in browser state | `components/start/StartWizard.tsx`, `components/start/StartWizardProvider.tsx` | Supported; React state only, no answer submission path |
| Intake free text is encrypted before submission | `components/intake/IntakeForm.tsx`, `lib/intake/encrypt.ts` | Supported; sealed-box encryption runs before the network submit call |
| API receives ciphertext plus limited routing metadata | `lib/intake/submit.ts`, `infra/lambda/intake/handler.mjs` | Supported; obvious plaintext identity/message keys are rejected |
| Server lacks the organizer private key | public-key configuration and local decrypt tooling | Supported by repository design; operational secret placement still needs independent review |
| Stored intake has an expiry target | Lambda record, DynamoDB TTL, S3 lifecycle, local retention script | Supported, with different mechanisms; production purge behavior still requires deployment verification |
| No behavioral analytics or session replay | dependency and client-request inspection | Supported in the reviewed tree; normal host/network request processing remains visible |
| Same-origin, size, schema, and throttling controls exist | Lambda handler and API Gateway stage settings | Supported after this review; these controls do not authenticate clients |
| Public MCP/CLI does not expose intake | public MCP tools and public tooling page | Supported; organizer tooling uses a separate local cache and private-key path |

## Remaining gates

- A qualified U.S. labor lawyer must review every page still marked `needs-labor-lawyer-review`.
- A qualified worker-cooperative practitioner must review `worker-coop-basics`.
- An independent security reviewer must assess encryption, key distribution, IAM, logging, retention, abuse controls, and the deployed configuration.
- Production verification must separately confirm DNS, TLS, response headers, key fingerprints, intake behavior, and retention automation.
- Sources that describe agency policy, proposed rules, statistics, or active procedures need periodic re-checking; the date on this document is not a guarantee of future accuracy.
