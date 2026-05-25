import { getEnvSiteName, getEnvSiteUrl } from "@/lib/env";
import { getSettings } from "@/lib/supabase/queries";
import type { Settings } from "@/lib/types/database";

export type SiteConfig = {
  url: string;
  domain: string;
  name: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  seo: {
    title: string;
    description: string;
    keywords: string | null;
    ogImageUrl: string | null;
  };
  twitterHandle: string | null;
};

const DEFAULT_SEO = {
  title: "LIMORA | ليمورا — العلامة الأولى لمكملات التجميل الفاخرة",
  description:
    "LIMORA — أنتِ تستحقين أن تتوهجي كل يوم. مكملات بودر فاخرة للبشرة المتوهجة، نمو الشعر، والثقة الأنثوية. شحن مجاني + دفع عند الاستلام داخل السعودية.",
  keywords:
    "ليمورا, LIMORA, مكملات تجميل, بشرة متوهجة, السعودية, دفع عند الاستلام, COD",
};

function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "localhost";
  }
}

export function buildSiteConfig(settings: Settings | null): SiteConfig {
  const envUrl = getEnvSiteUrl();
  const url = settings?.site_url?.trim() || envUrl;
  const domain =
    settings?.site_domain?.trim() || domainFromUrl(url);
  const name = settings?.site_name?.trim() || getEnvSiteName();

  return {
    url,
    domain,
    name,
    logoUrl: settings?.logo_url?.trim() || null,
    faviconUrl: settings?.favicon_url?.trim() || null,
    seo: {
      title: settings?.seo_title?.trim() || DEFAULT_SEO.title,
      description: settings?.seo_description?.trim() || DEFAULT_SEO.description,
      keywords: settings?.seo_keywords?.trim() || DEFAULT_SEO.keywords,
      ogImageUrl: settings?.og_image_url?.trim() || null,
    },
    twitterHandle: settings?.twitter_handle?.trim() || null,
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const settings = await getSettings();
  return buildSiteConfig(settings);
}

export function absoluteUrl(site: SiteConfig, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalized}`;
}
