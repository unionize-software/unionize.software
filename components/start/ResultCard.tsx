import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardItem =
  | string
  | {
      title: string;
      href: string;
    };

type ResultCardProps = {
  title: string;
  items: ResultCardItem[];
};

function isLinkedItem(item: ResultCardItem): item is Extract<ResultCardItem, { href: string }> {
  return typeof item !== "string";
}

export function ResultCard({ title, items }: ResultCardProps) {
  const titleId = `result-card-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
  const hasLinkedItems = items.some(isLinkedItem);

  return (
    <Card aria-labelledby={titleId} className="h-full bg-card/85" role="region">
      <CardHeader>
        <CardTitle className="text-xl" id={titleId}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={hasLinkedItems ? "space-y-2" : "space-y-3 text-sm leading-7 text-muted-foreground"}>
          {items.map((item) => (
            <li key={isLinkedItem(item) ? item.href : item}>
              {isLinkedItem(item) ? (
                <Link
                  className="group flex min-h-12 items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-left text-sm font-semibold leading-6 text-foreground shadow-[0_1px_0_rgba(17,17,17,0.05)] hover:-translate-y-[1px] hover:border-primary/45 hover:bg-card hover:text-primary hover:shadow-[0_10px_20px_rgba(57,44,27,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  href={item.href as Route}
                >
                  <span>{item.title}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 size-4 flex-none text-primary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
