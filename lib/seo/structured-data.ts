import type { ProductPageConfig } from "@/lib/page-builder/types";

export function buildProductJsonLd(
  config: ProductPageConfig,
  options: {
    url: string;
    image?: string;
    inStock?: boolean;
  },
) {
  const offer = config.offers.find((o) => o.recommended) ?? config.offers[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: config.hero.nameAr,
    description: config.hero.subtitle,
    image: options.image ? [options.image] : config.hero.images.slice(0, 4),
    brand: {
      "@type": "Brand",
      name: "LIMORA",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: config.hero.rating,
      reviewCount: config.hero.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: options.url,
      priceCurrency: "SAR",
      price: offer?.price ?? 0,
      availability: options.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "LIMORA",
      },
    },
  };
}

export function buildOrganizationJsonLd(siteUrl: string, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}
