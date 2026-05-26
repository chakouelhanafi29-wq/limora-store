import type { Metadata } from "next";
import {
  resolvePrimaryProductImage,
  resolveProductGalleryImages,
} from "@/lib/product-images";
import { getProductBySlug } from "@/lib/supabase/queries";
import { getProductPageConfig } from "@/lib/page-builder/queries";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata, productPagePath } from "@/lib/seo/metadata";

export async function loadProductPage(slug: string) {
  const [pageConfig, dbProduct] = await Promise.all([
    getProductPageConfig(slug),
    getProductBySlug(slug),
  ]);

  return {
    pageConfig,
    dbProduct,
    galleryImages: resolveProductGalleryImages(
      dbProduct?.product_images,
      pageConfig.hero.images,
    ),
  };
}

export async function buildProductPageMetadata(slug: string): Promise<Metadata> {
  const [site, pageConfig, dbProduct] = await Promise.all([
    getSiteConfig(),
    getProductPageConfig(slug),
    getProductBySlug(slug),
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
    path: productPagePath(slug),
    ogImage: primaryImage,
  });
}
