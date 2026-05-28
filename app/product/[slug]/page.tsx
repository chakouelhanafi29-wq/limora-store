import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  buildProductPageMetadata,
  loadProductPage,
} from "@/lib/page-builder/load-product-page";
import { isOfficialProductSlug } from "@/lib/products/catalog";
import { getLegacyProductRedirectPath } from "@/lib/products/legacy-slug-redirects";
import { resolveBuilderPrimaryImage } from "@/lib/product-images";
import { getSiteConfig } from "@/lib/site/config";
import { buildProductJsonLd, jsonLdScript } from "@/lib/seo/structured-data";
import { productPagePath } from "@/lib/seo/metadata";
import ProductPageClient from "../ProductPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildProductPageMetadata(slug);
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const legacyRedirect = getLegacyProductRedirectPath(rawSlug);
  if (legacyRedirect) {
    redirect(legacyRedirect);
  }

  const slug = rawSlug;
  const [site, { pageConfig, dbProduct }] = await Promise.all([
    getSiteConfig(),
    loadProductPage(slug),
  ]);

  if (!dbProduct && !isOfficialProductSlug(slug)) {
    notFound();
  }

  const productUrl = `${site.url}${productPagePath(slug)}`;
  const primaryImage = resolveBuilderPrimaryImage(
    pageConfig.hero.images,
    dbProduct?.product_images,
    pageConfig.slug,
  );
  const jsonLd = buildProductJsonLd(pageConfig, {
    url: productUrl,
    image: primaryImage,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <ProductPageClient
        pageConfig={pageConfig}
        productId={dbProduct?.id}
      />
    </>
  );
}
