import { OFFICIAL_PRODUCT_SLUGS } from "@/lib/product-images";
import type { HomePageConfig } from "@/lib/home-builder/types";
import type { ProductPageConfig } from "@/lib/page-builder/types";
import type { ProductOffer, ProductWithRelations } from "@/lib/types/database";

export type ProductPricingSource = {
  price: number;
  original_price: number | null;
  product_offers?: ProductOffer[];
};

export function resolveDisplayOffer(
  offers: ProductOffer[] | undefined | null,
): ProductOffer | null {
  if (!offers?.length) return null;

  const sorted = [...offers].sort((a, b) => a.sort_order - b.sort_order);
  return (
    sorted.find((offer) => offer.is_recommended) ??
    sorted.find((offer) => offer.quantity === 1) ??
    sorted[0] ??
    null
  );
}

export function resolveProductDisplayPrice(source: ProductPricingSource): {
  price: number;
  originalPrice: number | null;
} {
  const offer = resolveDisplayOffer(source.product_offers);

  if (offer) {
    return {
      price: Number(offer.price),
      originalPrice: source.original_price,
    };
  }

  return {
    price: Number(source.price),
    originalPrice: source.original_price,
  };
}

export function formatPriceNumber(price: number): string {
  if (Number.isInteger(price)) return String(price);
  return price.toFixed(2).replace(/\.?0+$/, "");
}

export function buildBundlePriceNote(
  products: ProductWithRelations[],
): string {
  const bundleProducts = OFFICIAL_PRODUCT_SLUGS.map((slug) =>
    products.find((product) => product.slug === slug),
  ).filter((product): product is ProductWithRelations => Boolean(product));

  if (bundleProducts.length !== OFFICIAL_PRODUCT_SLUGS.length) {
    return "";
  }

  let bundlePrice = 0;
  let originalTotal = 0;

  for (const product of bundleProducts) {
    const { price, originalPrice } = resolveProductDisplayPrice(product);
    bundlePrice += price;
    originalTotal += originalPrice ?? price;
  }

  return `${formatPriceNumber(bundlePrice)} ر.س بدلاً من ${formatPriceNumber(originalTotal)} ر.س — شحن مجاني + الدفع عند الاستلام`;
}

function slugFromProductHref(href: string): string | null {
  const match = href.match(/\/product\/([^/?#]+)/);
  return match?.[1] ?? null;
}

function catalogBySlug(products: ProductWithRelations[]) {
  return new Map(products.map((product) => [product.slug, product]));
}

export function enrichRelatedProductItems<
  T extends { href?: string; price?: string },
>(items: T[], catalog: ProductWithRelations[]): T[] {
  const bySlug = catalogBySlug(catalog);

  return items.map((item) => {
    const slug = slugFromProductHref(String(item.href ?? ""));
    if (!slug) return item;

    const product = bySlug.get(slug);
    if (!product) return item;

    const { price } = resolveProductDisplayPrice(product);
    return {
      ...item,
      price: formatPriceNumber(price),
    };
  });
}

export function applyDynamicHomePricing(
  config: HomePageConfig,
  catalog: ProductWithRelations[],
): HomePageConfig {
  const priceNote = buildBundlePriceNote(catalog);
  if (!priceNote) return config;

  return {
    ...config,
    sections: config.sections.map((section) => {
      if (section.type !== "promo_banner") return section;

      const content = section.content as Record<string, unknown>;
      const title = String(content.title ?? "");
      if (!title.includes("مجموعة LIMORA")) return section;

      return {
        ...section,
        content: {
          ...content,
          priceNote,
        },
      };
    }),
  };
}

export function applyDynamicProductPagePricing(
  pageConfig: ProductPageConfig,
  catalog: ProductWithRelations[],
): ProductPageConfig {
  return {
    ...pageConfig,
    sections: pageConfig.sections.map((section) => {
      if (section.type !== "related_products") return section;

      const content = section.content as Record<string, unknown>;
      const items = content.items;
      if (!Array.isArray(items)) return section;

      return {
        ...section,
        content: {
          ...content,
          items: enrichRelatedProductItems(
            items as { href?: string; price?: string }[],
            catalog,
          ).filter((item) => {
            const slug = slugFromProductHref(String(item.href ?? ""));
            return slug && slug !== pageConfig.slug;
          }),
        },
      };
    }),
  };
}
