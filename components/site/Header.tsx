"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/lib/site/publicRoutes";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/8 font-[family-name:var(--font-mono)] text-sm font-semibold text-primary shadow-[0_1px_0_rgba(17,17,17,0.05)] sm:size-11">
              U/S
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="eyebrow-label truncate text-[0.68rem] tracking-[0.18em] text-muted-foreground sm:text-[0.72rem] sm:tracking-[0.28em]">
                unionize.software
              </p>
              <p className="max-w-[16rem] text-xs font-medium leading-5 tracking-[-0.01em] sm:max-w-none sm:text-sm">
                Worker organizing wiki for software and game workers
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-3 sm:gap-x-5">
          {primaryNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={cn(
                  "relative pb-1 text-[0.9rem] font-medium tracking-[-0.01em] text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100 sm:text-[0.95rem]",
                  active
                    ? "text-foreground after:scale-x-100"
                    : "",
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
