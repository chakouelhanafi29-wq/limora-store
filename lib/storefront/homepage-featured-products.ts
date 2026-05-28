import { OFFICIAL_PRODUCT_SLUGS } from "@/lib/product-images";
import type { HomePageConfig } from "@/lib/home-builder/types";
import { mapFeaturedProducts, type FeaturedProductCard } from "@/lib/storefront";
import type { ProductWithRelations } from "@/lib/types/database";

/** Homepage featured cards only — does not affect checkout or product pages. */
export const HOMEPAGE_FEATURED_DISPLAY_PRICE = "199";

export function buildHomepageFeaturedProductCards(
  catalog: ProductWithRelations[],
): FeaturedProductCard[] {
  const catalogBySlug = new Map(catalog.map((product) => [product.slug, product]));
  const staticBySlug = new Map(
    mapFeaturedProducts([]).map((card) => [card.slug, card]),
  );

  const cards = OFFICIAL_PRODUCT_SLUGS.map((slug) => {
    const dbProduct = catalogBySlug.get(slug);
    if (dbProduct) {
      return mapFeaturedProducts([dbProduct])[0];
    }
    return staticBySlug.get(slug) ?? null;
  }).filter((card): card is FeaturedProductCard => Boolean(card));

  return cards.map((card) => ({
    ...card,
    price: HOMEPAGE_FEATURED_DISPLAY_PRICE,
    originalPrice: "",
  }));
}

export function resolveHomepageFeaturedProducts(
  config: HomePageConfig,
  catalogProducts: FeaturedProductCard[],
): FeaturedProductCard[] {
  const section = config.sections.find((item) => item.type === "products");
  if (!section) return catalogProducts;

  const content = section.content as Record<string, unknown>;
  if (content.useDynamicProducts === false) {
    const manual = content.productCards as FeaturedProductCard[] | undefined;
    if (manual?.length) return manual;
    return catalogProducts;
  }

  const displayPrice = String(
    content.homepageDisplayPrice ?? HOMEPAGE_FEATURED_DISPLAY_PRICE,
  );
  return catalogProducts.map((product) => ({
    ...product,
    price: displayPrice,
    originalPrice: "",
  }));
}
