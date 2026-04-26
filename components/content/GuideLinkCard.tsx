import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import {
  guidePageTypeActionLabels,
  type GuidePageType,
} from "@/lib/content/contentModel";

type GuideLinkCardProps = {
  href: string;
  title: string;
  description: string;
  category?: string;
  pageType?: GuidePageType;
  actionLabel?: string;
};

export function GuideLinkCard({
  href,
  title,
  description,
  category,
  pageType,
  actionLabel,
}: GuideLinkCardProps) {
  const action = actionLabel ?? (pageType ? guidePageTypeActionLabels[pageType] : "Read next");

  return (
    <Link
      className="interactive-card block rounded-[8px] border border-border bg-background/72 p-5"
      href={href as Route}
    >
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
      {category ? (
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
          {category}
        </p>
      ) : null}
      <span className="card-action-line mt-4 text-primary">
        {action}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
