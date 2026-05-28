import type { Metadata } from "next";
import { Cormorant_Garamond, Tajawal } from "next/font/google";
import Footer from "./components/SiteFooter";
import AnalyticsProvider from "./components/AnalyticsProvider";
import TrackingPixels from "./components/TrackingPixels";
import { getSiteConfig } from "@/lib/site/config";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { Suspense } from "react";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildRootMetadata(site);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteConfig();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.seo.description,
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ivory text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <Footer />
        <TrackingPixels />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
