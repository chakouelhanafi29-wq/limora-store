export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAllProducts } from "@/lib/supabase/queries";

export default async function LegacyProductBuilderPage() {
  const products = await getAllProducts({ ensureOfficial: true });
  if (products.length > 0) {
    redirect(`/admin/products/${products[0].id}/builder`);
  }
  redirect("/admin/products");
}
