import type { Route } from "next";

export type NavItem = {
  href: Route;
  label: string;
};

export const primaryNavItems = [
  { href: "/resources", label: "Wiki" },
  { href: "/organize", label: "Organize" },
  { href: "/know-your-rights", label: "Rights" },
  { href: "/ai-surveillance", label: "AI & Data" },
  { href: "/game-workers", label: "Game Workers" },
  { href: "/start", label: "Pathfinder" },
] as const satisfies ReadonlyArray<NavItem>;

export const footerNavItems = [
  { href: "/resources", label: "Wiki" },
  { href: "/tooling", label: "Tooling" },
  { href: "/start", label: "Pathfinder" },
  { href: "/privacy", label: "Privacy" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
] as const satisfies ReadonlyArray<NavItem>;

export const staticPublicRoutes = [
  "/",
  "/about",
  "/ai-surveillance",
  "/ai-surveillance/keystrokes",
  "/coops",
  "/first-contract",
  "/game-workers",
  "/know-your-rights",
  "/organize",
  "/privacy",
  "/recognition",
  "/resources",
  "/security",
  "/start",
  "/start/results",
  "/tooling",
  "/tooling/cli",
  "/tooling/mcp",
  "/tooling/skills",
] as const satisfies ReadonlyArray<Route>;

export function getSitePrefetchRoutes(guideSlugs: string[]) {
  return [
    ...new Set([
      ...staticPublicRoutes,
      ...guideSlugs.map((slug) => `/resources/${slug}` as Route),
    ]),
  ];
}
