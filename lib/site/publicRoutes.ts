import type { Route } from "next";

export type NavItem = {
  href: string;
  label: string;
};

export const primaryNavItems = [
  { href: "/start", label: "Start Here" },
  { href: "/resources/safety-basics", label: "Safety" },
  { href: "/paths", label: "Paths" },
  { href: "/resources", label: "Wiki" },
  { href: "/know-your-rights", label: "Rights" },
  { href: "/evidence", label: "Evidence" },
  { href: "/game-workers", label: "Game Workers" },
] as const satisfies ReadonlyArray<NavItem>;

export const footerNavItems = [
  { href: "/start", label: "Start Here" },
  { href: "/paths", label: "Paths" },
  { href: "/resources", label: "Wiki" },
  { href: "/resources/safety-basics", label: "Safety" },
  { href: "/organize", label: "Organize" },
  { href: "/ai-surveillance", label: "AI & Data" },
  { href: "/evidence", label: "Evidence" },
  { href: "/tooling", label: "Tooling" },
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
  "/evidence",
  "/first-contract",
  "/game-workers",
  "/know-your-rights",
  "/organize",
  "/paths",
  "/privacy",
  "/recognition",
  "/resources",
  "/security",
  "/start",
  "/start/results",
  "/talk-to-organizer",
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
