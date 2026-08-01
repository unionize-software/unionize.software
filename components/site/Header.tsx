"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/lib/site/publicRoutes";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/20 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group min-w-0">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.045em] sm:text-[1.7rem]">
              unionize<span className="text-primary">.</span>software
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">
              A worker-built organizing field guide
            </p>
          </Link>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-foreground/15 pt-3 sm:gap-x-5 lg:border-t-0 lg:pt-0">
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
