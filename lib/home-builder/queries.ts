import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import {
  getDefaultHomePageConfig,
  homePageConfigNeedsManagedSync,
  mergeHomePageConfig,
} from "@/lib/home-builder/default-config";
import type { HomePageConfig } from "@/lib/home-builder/types";

export async function saveHomePageConfig(
  slug: string,
  config: HomePageConfig,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase not configured" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("home_page_configs").upsert(
      { slug, config: { ...config, slug } },
      { onConflict: "slug" },
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function ensureHomePageConfigSynced(
  slug = "home",
): Promise<HomePageConfig> {
  const defaults = getDefaultHomePageConfig(slug);

  if (!isSupabaseConfigured()) {
    return defaults;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("home_page_configs")
      .select("config")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data?.config) {
      return defaults;
    }

    const saved = data.config as HomePageConfig;
    const synced = mergeHomePageConfig(saved, slug);

    if (homePageConfigNeedsManagedSync(saved, synced)) {
      await saveHomePageConfig(slug, synced);
    }

    return synced;
  } catch {
    return defaults;
  }
}

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

    const saved = data.config as HomePageConfig;
    const synced = mergeHomePageConfig(saved, slug);

    if (homePageConfigNeedsManagedSync(saved, synced)) {
      const persist = await saveHomePageConfig(slug, synced);
      if (!persist.ok) {
        try {
          await supabase.rpc("sync_home_before_after_managed");
        } catch {
          // RPC may not exist until home-transformations-sync.sql is applied.
        }
      }
    }

    return synced;
  } catch {
    return getDefaultHomePageConfig(slug);
  }
}
