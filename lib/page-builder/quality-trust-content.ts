export type QualityTrustItem = {
  icon?: string;
  title: string;
  description: string;
  image?: string;
  enabled?: boolean;
};

export function normalizeQualityTrustItems(
  content: Record<string, unknown>,
): QualityTrustItem[] {
  const items = content.items as QualityTrustItem[] | undefined;
  if (Array.isArray(items) && items.length) {
    return items;
  }

  const badges = content.badges as
    | { icon?: string; label?: string; description?: string }[]
    | undefined;

  if (Array.isArray(badges) && badges.length) {
    return badges.map((badge) => ({
      icon: badge.icon ?? "✦",
      title: badge.label ?? "",
      description: badge.description ?? "",
      enabled: true,
    }));
  }

  return [];
}

export function getEnabledQualityTrustItems(
  content: Record<string, unknown>,
): QualityTrustItem[] {
  return normalizeQualityTrustItems(content).filter((item) => item.enabled !== false);
}
