import type { Metadata } from "next";
import { absoluteUrl, type SiteConfig } from "@/lib/site/config";

type PageSeoOptions = {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  ogImage?: string | null;
};

export function buildRootMetadata(site: SiteConfig): Metadata {
  const ogImage =
    site.seo.ogImageUrl ||
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=630&fit=crop";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.seo.title,
      template: `%s | ${site.name}`,
    },
    description: site.seo.description,
    keywords: site.seo.keywords?.split(",").map((k) => k.trim()),
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      url: site.url,
      siteName: site.name,
      title: site.seo.title,
      description: site.seo.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.title,
      description: site.seo.description,
      images: [ogImage],
      ...(site.twitterHandle ? { site: site.twitterHandle } : {}),
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: site.faviconUrl
      ? {
          icon: site.faviconUrl,
          shortcut: site.faviconUrl,
          apple: site.faviconUrl,
        }
      : undefined,
  };
}

export function buildPageMetadata(
  site: SiteConfig,
  options: PageSeoOptions,
): Metadata {
  const description = options.description || site.seo.description;
  const canonical = absoluteUrl(site, options.path);
  const ogImage =
    options.ogImage ||
    site.seo.ogImageUrl ||
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=630&fit=crop";

  return {
    title: options.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: canonical,
      siteName: site.name,
      title: options.title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: options.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description,
      images: [ogImage],
      ...(site.twitterHandle ? { site: site.twitterHandle } : {}),
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function productPagePath(slug: string) {
  return `/product?slug=${encodeURIComponent(slug)}`;
}
