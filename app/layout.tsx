import type { Metadata } from "next";

import { getGuideSlugs } from "@/lib/content/getGuides";
import { getSitePrefetchRoutes } from "@/lib/site/publicRoutes";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RoutePreloader } from "@/components/site/RoutePreloader";
import { SafetyBanner } from "@/components/site/SafetyBanner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "unionize.software",
    template: "%s | unionize.software",
  },
  description:
    "Privacy-first public resources and decision routing for software and game workers organizing around surveillance, layoffs, pay, and working conditions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://unionize.software"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const guideSlugs = await getGuideSlugs();
  const prefetchRoutes = getSitePrefetchRoutes(guideSlugs);

  return (
    <html lang="en">
      <body className="bg-background font-[family-name:var(--font-body)] text-foreground antialiased">
        <div className="surface-grid flex min-h-screen flex-col">
          <RoutePreloader routes={prefetchRoutes} />
          <SafetyBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
