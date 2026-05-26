export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProductById } from "@/lib/supabase/queries";
import { getProductPageConfig } from "@/lib/page-builder/queries";
import ProductBuilder from "@/app/admin/(protected)/product-builder/ProductBuilder";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductBuilderAdminPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const config = await getProductPageConfig(product.slug, { product });

  return (
    <div className="-m-4 lg:-m-8">
      <ProductBuilder
        initialConfig={config}
        slug={product.slug}
        productId={product.id}
        productName={product.name_ar}
      />
    </div>
  );
}
