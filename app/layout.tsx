import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, League_Gothic } from "next/font/google";

import { getGuideSlugs } from "@/lib/content/getGuides";
import { getSitePrefetchRoutes } from "@/lib/site/publicRoutes";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RoutePreloader } from "@/components/site/RoutePreloader";
import { SafetyBanner } from "@/components/site/SafetyBanner";

import "./globals.css";

const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
});

const displayFont = League_Gothic({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "unionize.software",
    template: "%s | unionize.software",
  },
  description:
    "Worker-built guides for software and game workers dealing with layoffs, surveillance, retaliation, pay, burnout, or organizing.",
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
      <body
        className={[
          bodyFont.variable,
          displayFont.variable,
          "bg-background font-[family-name:var(--font-body)] text-foreground antialiased",
        ].join(" ")}
      >
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
