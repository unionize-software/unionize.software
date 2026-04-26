import Link from "next/link";
import type { Route } from "next";

import { footerNavItems } from "@/lib/site/publicRoutes";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(251,247,239,0.88),rgba(251,247,239,0.72))]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-3">
          <p className="eyebrow-label text-primary">unionize.software</p>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Public educational resources for software and game workers. Useful knowledge first,
            more platform complexity later.
          </p>
          <a
            href="https://github.com/unionize-software/unionize-software-webapp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            View the source on GitHub
          </a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-end">
          {footerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
