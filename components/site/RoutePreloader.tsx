"use client";

import { useEffect } from "react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";

type RoutePreloaderProps = {
  routes: Route[];
};

export function RoutePreloader({ routes }: RoutePreloaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    const pendingRoutes = routes.filter((route) => route !== pathname);

    if (pendingRoutes.length === 0) {
      return;
    }

    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let index = 0;

    const runPrefetchBatch = (deadline?: IdleDeadline) => {
      while (
        !cancelled &&
        index < pendingRoutes.length &&
        (!deadline || deadline.didTimeout || deadline.timeRemaining() > 4)
      ) {
        router.prefetch(pendingRoutes[index]!);
        index += 1;
      }

      if (!cancelled && index < pendingRoutes.length) {
        scheduleNextBatch();
      }
    };

    const scheduleNextBatch = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(runPrefetchBatch, { timeout: 1500 });
        return;
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        runPrefetchBatch();
      }, 250);
    };

    scheduleNextBatch();

    return () => {
      cancelled = true;

      if (idleCallbackId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname, router, routes]);

  return null;
}
