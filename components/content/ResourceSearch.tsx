"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";

import type { GuideListDocument, GuideSearchIndexDocument } from "@/lib/content/getGuides";
import { getResourceTags, guideMatchesResourceTag } from "@/lib/content/resourceTags";
import { getGuideSearchResults } from "@/lib/content/search";
import { isGuideSearchIndexPayload } from "@/lib/content/searchIndex";
import { ResourceCard } from "@/components/content/ResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResourceSearchProps = {
  guides: GuideListDocument[];
  searchIndexPath: string;
};

export function ResourceSearch({ guides, searchIndexPath }: ResourceSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState<GuideSearchIndexDocument[] | null>(null);
  const [indexStatus, setIndexStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const deferredQuery = useDeferredValue(query);
  const resourceTags = getResourceTags();

  useEffect(() => {
    if (searchIndex || indexStatus === "loading" || indexStatus === "error") {
      return;
    }

    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const shouldLoadImmediately = deferredQuery.trim().length > 0;

    const loadSearchIndex = async () => {
      setIndexStatus((current) => (current === "idle" ? "loading" : current));

      try {
        const response = await fetch(searchIndexPath, { cache: "force-cache" });

        if (!response.ok) {
          throw new Error("Search index request failed.");
        }

        const payload = (await response.json()) as unknown;

        if (!isGuideSearchIndexPayload(payload)) {
          throw new Error("Search index payload is invalid.");
        }

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSearchIndex(payload.guides);
          setIndexStatus("ready");
        });
      } catch {
        if (!cancelled) {
          setIndexStatus("error");
        }
      }
    };

    const scheduleLoad = () => {
      if (shouldLoadImmediately) {
        void loadSearchIndex();
        return;
      }

      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(() => {
          void loadSearchIndex();
        });
        return;
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        void loadSearchIndex();
      }, 250);
    };

    scheduleLoad();

    return () => {
      cancelled = true;

      if (idleCallbackId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [deferredQuery, indexStatus, searchIndex, searchIndexPath]);

  const searchableGuides = searchIndex ?? guides;
  const tagFilteredGuides =
    selectedTagIds.length > 0
      ? searchableGuides.filter((guide) =>
          selectedTagIds.some((tagId) => guideMatchesResourceTag(guide, tagId)),
        )
      : searchableGuides;
  const filteredGuides = getGuideSearchResults(tagFilteredGuides, deferredQuery);
  const isFullTextSearchReady = searchIndex !== null;

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/85 p-6">
        <label className="mb-3 block text-sm font-medium" htmlFor="resource-search">
          Search guides
        </label>
        <Input
          id="resource-search"
          placeholder="Search AI surveillance, layoffs, retaliation, mapping..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Search stays local. The page loads a static search index after first paint so the initial
          route stays lighter.
        </p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Optional tags</p>
            {selectedTagIds.length > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelectedTagIds([])}
              >
                Clear tags
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {resourceTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);

              return (
                <Button
                  key={tag.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </Button>
              );
            })}
          </div>
        </div>
        {deferredQuery.trim() && !isFullTextSearchReady && indexStatus !== "error" ? (
          <p className="mt-2 text-xs text-muted-foreground/80">
            Loading full-text preview passages. Title and excerpt matches are ready first.
          </p>
        ) : null}
        {deferredQuery.trim() && indexStatus === "error" ? (
          <p className="mt-2 text-xs text-muted-foreground/80">
            Full-text preview passages are unavailable in this run. Metadata and excerpt matches are
            still local.
          </p>
        ) : null}
      </div>

      {filteredGuides.length > 0 ? (
        <div
          role="region"
          aria-label="Search results"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredGuides.map((result) => (
            <ResourceCard key={result.guide.slug} {...result} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
          No guides match that search yet. Try broader terms like `retaliation`, `layoffs`, `AI`,
          or `mapping`, or clear one or more tags.
        </div>
      )}
    </div>
  );
}
