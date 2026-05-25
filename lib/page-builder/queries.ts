import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import {
  getDefaultProductPageConfig,
  mergeProductPageConfig,
} from "@/lib/page-builder/default-config";
import type { ProductPageConfig } from "@/lib/page-builder/types";

export async function getProductPageConfig(
  slug = "glow",
): Promise<ProductPageConfig> {
  if (!isSupabaseConfigured()) {
    return getDefaultProductPageConfig(slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_page_configs")
      .select("config")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data?.config) {
      return getDefaultProductPageConfig(slug);
    }

    return mergeProductPageConfig(data.config as ProductPageConfig, slug);
  } catch {
    return getDefaultProductPageConfig(slug);
  }
}

export async function saveProductPageConfig(
  slug: string,
  config: ProductPageConfig,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_page_configs").upsert(
    {
      slug,
      config: { ...config, slug },
    },
    { onConflict: "slug" },
  );

  if (error) throw new Error(error.message);
}
