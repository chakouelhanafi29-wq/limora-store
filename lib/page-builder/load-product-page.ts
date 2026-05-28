import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { resolveBuilderPrimaryImage } from "@/lib/product-images";
import { resolveProductSlug } from "@/lib/products/catalog";
import { getOfficialProductsWithOffers, getProductBySlug } from "@/lib/supabase/queries";
import { getProductPageConfig } from "@/lib/page-builder/queries";
import { applyDynamicProductPagePricing } from "@/lib/storefront/product-pricing";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata, productPagePath } from "@/lib/seo/metadata";

export async function loadProductPage(slug: string) {
  noStore();

  const resolvedSlug = resolveProductSlug(slug);
  const [dbProduct, catalog] = await Promise.all([
    getProductBySlug(resolvedSlug),
    getOfficialProductsWithOffers(),
  ]);
  const pageConfig = await getProductPageConfig(resolvedSlug, {
    product: dbProduct,
  });

  return {
    pageConfig: applyDynamicProductPagePricing(pageConfig, catalog),
    dbProduct,
  };
}

export async function buildProductPageMetadata(slug: string): Promise<Metadata> {
  const resolvedSlug = resolveProductSlug(slug);
  const [site, pageConfig, dbProduct] = await Promise.all([
    getSiteConfig(),
    getProductPageConfig(resolvedSlug),
    getProductBySlug(resolvedSlug),
  ]);

  const title =
    dbProduct?.name_ar || pageConfig.hero.nameAr || "منتج LIMORA";
  const description =
    dbProduct?.subtitle || pageConfig.hero.subtitle || site.seo.description;
  const primaryImage = resolveBuilderPrimaryImage(
    pageConfig.hero.images,
    dbProduct?.product_images,
    resolvedSlug,
  );

  return buildPageMetadata(site, {
    title: `${title} — ${site.name}`,
    description,
    path: productPagePath(resolvedSlug),
    ogImage: primaryImage,
  });
}
