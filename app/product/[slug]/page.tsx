import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildProductPageMetadata,
  loadProductPage,
} from "@/lib/page-builder/load-product-page";
import ProductPageClient from "../ProductPageClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildProductPageMetadata(slug);
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  const { pageConfig, dbProduct, galleryImages } = await loadProductPage(slug);

  if (!dbProduct && slug !== "glow") {
    notFound();
  }

  return (
    <ProductPageClient
      pageConfig={pageConfig}
      productId={dbProduct?.id}
      galleryImages={galleryImages}
    />
  );
}
