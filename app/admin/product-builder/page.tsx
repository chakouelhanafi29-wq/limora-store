export const dynamic = "force-dynamic";

import { getProductPageConfig } from "@/lib/page-builder/queries";
import ProductBuilder from "./ProductBuilder";

export default async function ProductBuilderPage() {
  const slug = "glow";
  const config = await getProductPageConfig(slug);

  return (
    <div className="-m-4 lg:-m-8">
      <ProductBuilder initialConfig={config} slug={slug} />
    </div>
  );
}
