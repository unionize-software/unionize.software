import type { Route } from "next";
import Link from "next/link";

import { footerNavItems } from "@/lib/site/publicRoutes";

export function Footer() {
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto grid max-w-[86rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <p className="font-[family-name:var(--font-display)] text-5xl uppercase leading-none tracking-[-0.02em]">
            Unionize<span className="text-accent">.</span>software
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-background/68">
            Free, privacy-first guidance for software and game workers trying to
            understand a workplace problem and choose a safer next step.
          </p>
          <a
            href="https://github.com/unionize-software/unionize.software"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block font-bold underline decoration-2 underline-offset-4 hover:text-accent"
          >
            Inspect the source
          </a>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-bold sm:grid-cols-3 lg:justify-self-end"
        >
          {footerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="underline-offset-4 hover:text-accent hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
