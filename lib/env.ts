const DEFAULT_SITE_NAME = "LIMORA";
const DEFAULT_LOCAL_URL = "http://localhost:3000";

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function getEnvSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return DEFAULT_LOCAL_URL;
}

export function getEnvSiteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || DEFAULT_SITE_NAME;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function isVercelPreview() {
  return process.env.VERCEL_ENV === "preview";
}

export function isVercelProduction() {
  return process.env.VERCEL_ENV === "production";
}

export function getSupabaseStorageHost() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
