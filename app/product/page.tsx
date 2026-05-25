import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/supabase/queries";
import { getProductPageConfig } from "@/lib/page-builder/queries";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata, productPagePath } from "@/lib/seo/metadata";
import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { slug = "glow" } = await searchParams;
  const [site, pageConfig, dbProduct] = await Promise.all([
    getSiteConfig(),
    getProductPageConfig(slug),
    getProductBySlug(slug),
  ]);

  const title =
    dbProduct?.name_ar ||
    pageConfig.hero.nameAr ||
    "منتج LIMORA";
  const description =
    dbProduct?.subtitle ||
    pageConfig.hero.subtitle ||
    site.seo.description;
  const primaryImage =
    dbProduct?.product_images?.find((img) => img.is_primary)?.url ||
    dbProduct?.product_images?.[0]?.url ||
    pageConfig.hero.images[0] ||
    null;

  return buildPageMetadata(site, {
    title: `${title} — ${site.name}`,
    description,
    path: productPagePath(slug),
    ogImage: primaryImage,
  });
}

export default async function ProductPage({ searchParams }: Props) {
  const { slug = "glow" } = await searchParams;
  const [pageConfig, dbProduct] = await Promise.all([
    getProductPageConfig(slug),
    getProductBySlug(slug),
  ]);

  return (
    <ProductPageClient
      pageConfig={pageConfig}
      productId={dbProduct?.id}
    />
  );
}
