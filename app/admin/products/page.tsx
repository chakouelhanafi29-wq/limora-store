export const dynamic = "force-dynamic";

import { getAllProducts } from "@/lib/supabase/queries";
import ProductsManager, { NewProductForm } from "./ProductsManager";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">إدارة المنتجات</h1>
        <p className="mt-1 text-sm text-muted">
          أضيفي منتجات، صور، وعروض الأسعار
        </p>
      </div>
      <NewProductForm />
      <ProductsManager initialProducts={products} />
    </div>
  );
}
