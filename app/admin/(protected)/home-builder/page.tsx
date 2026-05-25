export const dynamic = "force-dynamic";

import { getHomePageConfig } from "@/lib/home-builder/queries";
import { getActiveReviews, getFeaturedProducts } from "@/lib/supabase/queries";
import { mapFeaturedProducts, mapHomeReviews } from "@/lib/storefront";
import { testimonials as staticTestimonials } from "@/app/lib/data";
import HomeBuilder from "./HomeBuilder";

export default async function HomeBuilderPage() {
  const [config, featuredProducts, reviews] = await Promise.all([
    getHomePageConfig("home"),
    getFeaturedProducts(),
    getActiveReviews(),
  ]);

  const products = mapFeaturedProducts(featuredProducts);
  const dynamicReviews = mapHomeReviews(reviews);
  const testimonials = dynamicReviews.items.length
    ? dynamicReviews
    : staticTestimonials;

  return (
    <div className="-m-4 lg:-m-8">
      <HomeBuilder
        initialConfig={config}
        products={products}
        testimonials={testimonials}
      />
    </div>
  );
}
