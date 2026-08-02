"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/lib/site/publicRoutes";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-4 border-foreground bg-background">
      <div className="mx-auto max-w-[86rem] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-4 py-4 sm:py-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <Link href="/" className="group w-fit">
            <p className="font-[family-name:var(--font-display)] text-[2.9rem] uppercase leading-[0.86] tracking-[-0.018em] sm:text-[3.65rem]">
              Unionize<span className="text-primary">.</span>software
            </p>
          </Link>
          <div className="max-w-sm border-l-3 border-primary pl-4 text-sm leading-6 text-muted-foreground lg:text-right">
            <p className="font-bold text-foreground">Independent worker field guide</p>
            <p>Free. Public. No account required.</p>
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className="grid grid-cols-3 gap-x-4 gap-y-2 border-t border-foreground/30 py-2.5 sm:flex sm:gap-x-6"
        >
          {primaryNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={cn(
                  "w-fit border-b-2 border-transparent pb-1 text-sm font-bold text-muted-foreground hover:border-primary hover:text-foreground",
                  active ? "border-primary text-foreground" : "",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
