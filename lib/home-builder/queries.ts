import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import {
  getDefaultHomePageConfig,
  mergeHomePageConfig,
} from "@/lib/home-builder/default-config";
import type { HomePageConfig } from "@/lib/home-builder/types";

export async function getHomePageConfig(slug = "home"): Promise<HomePageConfig> {
  if (!isSupabaseConfigured()) {
    return getDefaultHomePageConfig(slug);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("home_page_configs")
      .select("config")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data?.config) {
      return getDefaultHomePageConfig(slug);
    }

    return mergeHomePageConfig(data.config as HomePageConfig, slug);
  } catch {
    return getDefaultHomePageConfig(slug);
  }
}
