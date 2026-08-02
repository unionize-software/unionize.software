import {
  stateResourceSources,
  usStateResources,
  type OshaCoverage,
} from "../lib/jurisdictions/usStates.ts";

const expectedCodes = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

function fail(message: string): never {
  throw new Error(`State resource audit failed: ${message}`);
}

if (usStateResources.length !== expectedCodes.length) {
  fail(`expected ${expectedCodes.length} jurisdictions, found ${usStateResources.length}`);
}

const actualCodes = usStateResources.map((state) => state.code);
if (actualCodes.join(",") !== expectedCodes.join(",")) {
  fail(`postal-code sequence differs: ${actualCodes.join(",")}`);
}

if (new Set(actualCodes).size !== actualCodes.length) {
  fail("duplicate postal codes found");
}

if (new Set(usStateResources.map((state) => state.slug)).size !== usStateResources.length) {
  fail("duplicate slugs found");
}

const sourceIds = new Set(stateResourceSources.map((source) => source.id));
if (sourceIds.size !== stateResourceSources.length) {
  fail("duplicate source IDs found");
}

const coverageCounts = usStateResources.reduce<Record<OshaCoverage, number>>(
  (counts, state) => {
    counts[state.safety.coverage] += 1;
    return counts;
  },
  {
    federal: 0,
    "state-plan-public-and-private": 0,
    "state-plan-public-only": 0,
  },
);

if (
  coverageCounts["state-plan-public-and-private"] !== 21 ||
  coverageCounts["state-plan-public-only"] !== 6 ||
  coverageCounts.federal !== 24
) {
  fail(`unexpected OSHA coverage totals: ${JSON.stringify(coverageCounts)}`);
}

for (const source of stateResourceSources) {
  if (new URL(source.url).protocol !== "https:") {
    fail(`source ${source.id} does not use HTTPS`);
  }
}

for (const state of usStateResources) {
  const urls = [
    state.laborAgency.url,
    state.laborAgency.directoryUrl,
    state.wageAndHour.stateLawOverviewUrl,
    state.wageAndHour.federalOfficeDirectoryUrl,
    state.safety.officialUrl,
    state.discrimination.officialUrl,
    state.publicSector.stateGovernmentUrl,
    state.publicSector.overviewUrl,
  ];

  for (const url of urls) {
    if (new URL(url).protocol !== "https:") {
      fail(`${state.code} contains a non-HTTPS route: ${url}`);
    }
  }

  for (const sourceId of state.provenance.sourceIds) {
    if (!sourceIds.has(sourceId)) {
      fail(`${state.code} references unknown source ${sourceId}`);
    }
  }

  if (state.publicSector.reviewStatus !== "needs-jurisdiction-specific-review") {
    fail(`${state.code} public-sector legal gate is missing`);
  }
}

const dc = usStateResources.find((state) => state.code === "DC");
if (dc?.kind !== "federal-district") {
  fail("D.C. is not labeled as a federal district");
}

if (usStateResources.some((state) => state.code !== "DC" && state.kind !== "state")) {
  fail("a state is mislabeled as a non-state jurisdiction");
}

console.log(
  `State resource audit passed: ${usStateResources.length} jurisdictions, ${stateResourceSources.length} source families.`,
);
