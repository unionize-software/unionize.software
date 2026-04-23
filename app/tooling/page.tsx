import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/site/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ToolingPageCard = {
  href: Route;
  title: string;
  description: string;
};

const toolingPages = [
  {
    href: "/tooling/cli",
    title: "CLI",
    description:
      "Terminal access to the guide corpus, search, and pathfinder logic for people who want a local workflow.",
  },
  {
    href: "/tooling/mcp",
    title: "MCP Server",
    description:
      "A local MCP surface for guide resources, prompts, and tools so agents can use the project directly.",
  },
  {
    href: "/tooling/skills",
    title: "OpenClaw Skills",
    description:
      "A first-party skill bundle that tells agents how to use the MCP surface without drifting into bad advice.",
  },
] as const satisfies ReadonlyArray<ToolingPageCard>;

export default function ToolingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Tooling"
        title="A public wiki is stronger when people can bring it into their own tools."
        description="The project now includes a CLI, a local MCP server, and an OpenClaw skill bundle so the guide corpus can be used cleanly by terminals and agents."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {toolingPages.map((page) => (
          <Link key={page.href} href={page.href} className="block">
            <Card className="interactive-card h-full bg-card/88">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Tooling page
                </Badge>
                <CardTitle className="text-3xl">{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <span className="card-action-line text-primary">
                  Read tool page
                  <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-primary/25 bg-primary/7">
        <CardHeader>
          <Badge variant="outline" className="w-fit border-primary/35 text-primary">
            Boundary
          </Badge>
          <CardTitle className="text-3xl">The tooling exposes public knowledge, not private worker data.</CardTitle>
          <CardDescription>
            The MCP surface is for the guide corpus, search, prompts, and pathfinder logic. It is
            not wired to encrypted intake data or any private organizer workspace.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
