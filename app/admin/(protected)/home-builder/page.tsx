export const dynamic = "force-dynamic";

import { ensureHomePageConfigSynced } from "@/lib/home-builder/queries";
import { getActiveReviews, getFeaturedProducts, getOfficialProductsWithOffers } from "@/lib/supabase/queries";
import { mapFeaturedProducts, mapHomeReviews } from "@/lib/storefront";
import { applyDynamicHomePricing } from "@/lib/storefront/product-pricing";
import { testimonials as staticTestimonials } from "@/app/lib/data";
import HomeBuilder from "./HomeBuilder";

export default async function HomeBuilderPage() {
  const [config, featuredProducts, reviews, catalog] = await Promise.all([
    ensureHomePageConfigSynced("home"),
    getFeaturedProducts(),
    getActiveReviews(),
    getOfficialProductsWithOffers(),
  ]);

  const products = mapFeaturedProducts(
    featuredProducts.length ? featuredProducts : catalog,
  );
  const syncedConfig = applyDynamicHomePricing(config, catalog);
  const dynamicReviews = mapHomeReviews(reviews);
  const testimonials = dynamicReviews.items.length
    ? dynamicReviews
    : staticTestimonials;

  return (
    <div className="-m-4 lg:-m-8">
      <HomeBuilder
        initialConfig={syncedConfig}
        products={products}
        testimonials={testimonials}
      />
    </div>
  );
}
