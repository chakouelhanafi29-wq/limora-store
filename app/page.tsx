export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ConfigurableHomePage from "@/app/components/home/ConfigurableHomePage";
import { testimonials as staticTestimonials } from "@/app/lib/data";
import { getHomePageConfig } from "@/lib/home-builder/queries";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getActiveReviews,
  getOfficialProductsWithOffers,
} from "@/lib/supabase/queries";
import {
  mapHomeReviews,
} from "@/lib/storefront";
import { buildHomepageFeaturedProductCards } from "@/lib/storefront/homepage-featured-products";
import { applyDynamicHomePricing } from "@/lib/storefront/product-pricing";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: site.seo.title,
    description: site.seo.description,
    path: "/",
  });
}

export default async function Home() {
  const [pageConfig, reviews, catalog] = await Promise.all([
    getHomePageConfig("home"),
    getActiveReviews(),
    getOfficialProductsWithOffers(),
  ]);

  const products = buildHomepageFeaturedProductCards(catalog);
  const config = applyDynamicHomePricing(pageConfig, catalog);
  const dynamicReviews = mapHomeReviews(reviews);
  const testimonials = dynamicReviews.items.length
    ? dynamicReviews
    : staticTestimonials;

  return (
    <ConfigurableHomePage
      config={config}
      products={products}
      testimonials={testimonials}
    />
  );
}
