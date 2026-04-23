import { notFound } from "next/navigation";

import { getStaticPageBySlug } from "@/lib/content/getGuides";
import { renderMdx } from "@/lib/content/mdx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function StaticPage({ slug }: { slug: string }) {
  const page = await getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const content = await renderMdx(page.body);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-primary">
          {page.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {page.title}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">{page.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{page.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <article data-prose className="max-w-none">
            {content}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}

