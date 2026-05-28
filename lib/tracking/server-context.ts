import type { ServerRequestContext } from "./types";

export function getServerRequestContext(request: Request): ServerRequestContext {
  const forwarded = request.headers.get("x-forwarded-for");
  const client_ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    null;
  const user_agent = request.headers.get("user-agent");

  return {
    client_ip,
    user_agent,
  };
}

export function buildEventSourceUrl(
  siteUrl: string,
  pagePath?: string | null,
): string {
  const base = siteUrl.replace(/\/$/, "");
  const path = pagePath?.startsWith("/") ? pagePath : `/${pagePath ?? ""}`;
  return `${base}${path === "/" ? "" : path}`;
}
