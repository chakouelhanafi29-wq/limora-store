import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/thank-you"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
