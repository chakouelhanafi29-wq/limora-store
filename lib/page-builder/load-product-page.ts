import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import {
  resolvePrimaryProductImage,
  resolveProductGalleryImages,
  getProductGalleryBySlug,
} from "@/lib/product-images";
import { resolveProductSlug } from "@/lib/products/catalog";
import { getProductBySlug } from "@/lib/supabase/queries";
import { getProductPageConfig } from "@/lib/page-builder/queries";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata, productPagePath } from "@/lib/seo/metadata";

export async function loadProductPage(slug: string) {
  noStore();

  const resolvedSlug = resolveProductSlug(slug);
  const dbProduct = await getProductBySlug(resolvedSlug);
  const pageConfig = await getProductPageConfig(resolvedSlug, {
    product: dbProduct,
  });

  return {
    pageConfig,
    dbProduct,
    galleryImages: resolveProductGalleryImages(
      dbProduct?.product_images,
      pageConfig.hero.images.length
        ? pageConfig.hero.images
        : getProductGalleryBySlug(resolvedSlug),
    ),
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
  const primaryImage = resolvePrimaryProductImage(
    dbProduct?.product_images,
    pageConfig.hero.images[0],
  );

  return buildPageMetadata(site, {
    title: `${title} — ${site.name}`,
    description,
    path: productPagePath(resolvedSlug),
    ogImage: primaryImage,
  });
}
