import type { MetadataRoute } from "next";
import { getEnvSiteUrl } from "@/lib/env";
import { getSiteConfig } from "@/lib/site/config";
import { productPagePath } from "@/lib/seo/metadata";
import { getActiveProductSlugs } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, productSlugs] = await Promise.all([
    getSiteConfig(),
    getActiveProductSlugs(),
  ]);

  const base = site.url || getEnvSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/returns`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${base}${productPagePath(slug)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
