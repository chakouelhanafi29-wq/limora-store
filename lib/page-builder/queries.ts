import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/lib/supabase/queries";
import { resolveProductSlug } from "@/lib/products/catalog";
import {
  getDefaultProductPageConfig,
  mergeProductPageConfig,
} from "@/lib/page-builder/default-config";
import { upsertProductPageConfigRow } from "@/lib/page-builder/save-config";
import type { ProductWithRelations } from "@/lib/types/database";
import type { ProductPageConfig } from "@/lib/page-builder/types";

type ProductPageConfigOptions = {
  product?: ProductWithRelations | null;
};

export async function getProductPageConfig(
  slug = "collagen-glow",
  options?: ProductPageConfigOptions,
): Promise<ProductPageConfig> {
  const resolvedSlug = resolveProductSlug(slug);
  const product =
    options?.product !== undefined
      ? options.product
      : await getProductBySlug(resolvedSlug);

  if (!isSupabaseConfigured()) {
    return getDefaultProductPageConfig(resolvedSlug, product);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_page_configs")
      .select("config")
      .eq("slug", resolvedSlug)
      .maybeSingle();

    if (error || !data?.config) {
      return getDefaultProductPageConfig(resolvedSlug, product);
    }

    return mergeProductPageConfig(
      data.config as ProductPageConfig,
      resolvedSlug,
      product,
    );
  } catch {
    return getDefaultProductPageConfig(resolvedSlug, product);
  }
}

export async function saveProductPageConfig(
  slug: string,
  config: ProductPageConfig,
  productId?: string,
) {
  const resolvedSlug = resolveProductSlug(slug);
  const supabase = await createClient();
  const result = await upsertProductPageConfigRow(
    supabase,
    resolvedSlug,
    config,
    productId,
  );

  if (!result.ok) {
    throw new Error(result.error ?? "Failed to save product page config");
  }
}
