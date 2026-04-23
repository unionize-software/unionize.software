import type { GuideListDocument } from "@/lib/content/getGuides";

type SearchableGuide = GuideListDocument & {
  searchText?: string;
};

type MatchField = "title" | "category" | "jurisdiction" | "excerpt" | "body" | "slug";

export type GuideSearchResult = {
  guide: GuideListDocument;
  previewLabel: string | null;
  previewText: string;
  searchTerms: string[];
};

const previewLabels: Record<MatchField, string> = {
  title: "Title match",
  category: "Category match",
  jurisdiction: "Jurisdiction match",
  excerpt: "Preview",
  body: "Matching passage",
  slug: "Slug match",
};

function normalizeForSearch(value: string) {
  return value.toLowerCase();
}

function clampSnippetToWords(text: string, start: number, end: number) {
  const boundedStart = Math.max(0, start);
  const boundedEnd = Math.min(text.length, end);

  const wordStart = boundedStart === 0 ? 0 : (text.lastIndexOf(" ", boundedStart) || 0);
  const nextSpace = text.indexOf(" ", boundedEnd);
  const wordEnd = nextSpace === -1 ? text.length : nextSpace;

  const prefix = wordStart > 0 ? "..." : "";
  const suffix = wordEnd < text.length ? "..." : "";

  return `${prefix}${text.slice(wordStart, wordEnd).trim()}${suffix}`;
}

function buildSnippet(text: string, terms: string[]) {
  const cleanText = text.trim();
  const normalized = cleanText.toLowerCase();

  let firstIndex = -1;
  let matchedLength = 0;

  for (const term of terms) {
    const index = normalized.indexOf(term);
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
      matchedLength = term.length;
    }
  }

  if (firstIndex === -1) {
    return cleanText.slice(0, 180);
  }

  return clampSnippetToWords(cleanText, firstIndex - 96, firstIndex + matchedLength + 96);
}

export function getSearchTerms(query: string) {
  const rawTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9/-]/g, ""))
    .filter(Boolean);

  const uniqueTerms = rawTerms.filter((term, index) => rawTerms.indexOf(term) === index);

  if (uniqueTerms.length <= 1) {
    return uniqueTerms;
  }

  const multiCharTerms = uniqueTerms.filter((term) => term.length > 1);
  return multiCharTerms.length > 0 ? multiCharTerms : uniqueTerms;
}

export function getGuideSearchResults(guides: SearchableGuide[], query: string): GuideSearchResult[] {
  const searchTerms = getSearchTerms(query);

  if (searchTerms.length === 0) {
    return guides.map((guide) => ({
      guide,
      previewLabel: null,
      previewText: guide.excerpt,
      searchTerms: [],
    }));
  }

  return guides.flatMap((guide) => {
    const fields: Array<{ field: MatchField; value: string }> = [
      { field: "title", value: guide.title },
      { field: "category", value: guide.category },
      { field: "jurisdiction", value: guide.jurisdiction },
      { field: "excerpt", value: guide.excerpt },
      { field: "body", value: guide.searchText ?? guide.excerpt },
      { field: "slug", value: guide.slug },
    ];

    const haystack = fields.map(({ value }) => normalizeForSearch(value)).join(" ");

    if (!searchTerms.every((term) => haystack.includes(term))) {
      return [];
    }

    const matchingField = fields.find(({ value }) =>
      searchTerms.some((term) => normalizeForSearch(value).includes(term)),
    );

    if (!matchingField) {
      return [];
    }

    return [
      {
        guide,
        previewLabel: previewLabels[matchingField.field],
        previewText: buildSnippet(matchingField.value, searchTerms),
        searchTerms,
      },
    ];
  });
}
