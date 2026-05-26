import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/lib/supabase/queries";
import {
  getDefaultProductPageConfig,
  mergeProductPageConfig,
} from "@/lib/page-builder/default-config";
import type { ProductWithRelations } from "@/lib/types/database";
import type { ProductPageConfig } from "@/lib/page-builder/types";

type ProductPageConfigOptions = {
  product?: ProductWithRelations | null;
};

export async function getProductPageConfig(
  slug = "glow",
  options?: ProductPageConfigOptions,
): Promise<ProductPageConfig> {
  const product =
    options?.product !== undefined
      ? options.product
      : await getProductBySlug(slug);

  if (!isSupabaseConfigured()) {
    return getDefaultProductPageConfig(slug, product);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_page_configs")
      .select("config")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data?.config) {
      return getDefaultProductPageConfig(slug, product);
    }

    return mergeProductPageConfig(
      data.config as ProductPageConfig,
      slug,
      product,
    );
  } catch {
    return getDefaultProductPageConfig(slug, product);
  }
}

export async function saveProductPageConfig(
  slug: string,
  config: ProductPageConfig,
  productId?: string,
) {
  const supabase = await createClient();
  const row: Record<string, unknown> = {
    slug,
    config: { ...config, slug },
  };
  if (productId) {
    row.product_id = productId;
  }

  const { error } = await supabase
    .from("product_page_configs")
    .upsert(row, { onConflict: "slug" });

  if (error) throw new Error(error.message);
}
