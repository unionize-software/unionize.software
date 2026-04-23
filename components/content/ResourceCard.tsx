import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

import type { GuideSearchResult } from "@/lib/content/search";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, searchTerms }: { text: string; searchTerms: string[] }) {
  if (searchTerms.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${searchTerms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = searchTerms.some((term) => part.toLowerCase() === term.toLowerCase());

    if (!isMatch) {
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    }

    return (
      <mark key={`${part}-${index}`} className="rounded-sm bg-primary/20 px-1 text-foreground">
        {part}
      </mark>
    );
  });
}

export function ResourceCard({
  guide,
  previewLabel,
  previewText,
  searchTerms,
}: GuideSearchResult) {
  return (
    <Link href={`/resources/${guide.slug}`} prefetch className="block h-full">
      <Card className="interactive-card flex h-full flex-col bg-card/85">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>
              <HighlightedText text={guide.category} searchTerms={searchTerms} />
            </Badge>
            <Badge variant="outline">
              <HighlightedText text={guide.jurisdiction} searchTerms={searchTerms} />
            </Badge>
            <Badge variant="outline">{guide.review_status}</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl leading-tight">
              <HighlightedText text={guide.title} searchTerms={searchTerms} />
            </CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              {previewLabel ? (
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
                  {previewLabel}
                </p>
              ) : null}
              <p>
                <HighlightedText text={previewText} searchTerms={searchTerms} />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-auto space-y-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>Risk level: {guide.risk_level}</p>
            <p>Last reviewed: {guide.last_reviewed}</p>
          </div>
          <span className="card-action-line text-primary">
            Open guide
            <ArrowRight className="size-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
