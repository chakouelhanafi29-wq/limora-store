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
  weight: ["300", "400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildRootMetadata(site);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-ivory text-foreground">
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
