export const dynamic = "force-dynamic";

import { ensureHomePageConfigSynced } from "@/lib/home-builder/queries";
import { getActiveReviews, getOfficialProductsWithOffers } from "@/lib/supabase/queries";
import { mapHomeReviews } from "@/lib/storefront";
import { buildHomepageFeaturedProductCards } from "@/lib/storefront/homepage-featured-products";
import { applyDynamicHomePricing } from "@/lib/storefront/product-pricing";
import { testimonials as staticTestimonials } from "@/app/lib/data";
import HomeBuilder from "./HomeBuilder";

export default async function HomeBuilderPage() {
  const [config, reviews, catalog] = await Promise.all([
    ensureHomePageConfigSynced("home"),
    getActiveReviews(),
    getOfficialProductsWithOffers(),
  ]);

  const products = buildHomepageFeaturedProductCards(catalog);
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
