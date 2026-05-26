const HALAL_LABEL = "\u062D\u0644\u0627\u0644";

export function isHalalTrustBadge(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return normalized === HALAL_LABEL || normalized.includes("halal");
}

export const DEFAULT_HERO_TRUST_BADGES = [
  "شحن سريع",
  "دفع عند الاستلام",
  "ضمان الجودة",
  HALAL_LABEL,
] as const;

/** Ensures saved hero trust badges always include halal for Gulf-market trust. */
export function resolveHeroTrustBadges(custom?: string[] | null): string[] {
  const source = custom?.map((item) => item.trim()).filter(Boolean) ?? [];

  if (!source.length) {
    return [...DEFAULT_HERO_TRUST_BADGES];
  }

  if (source.some(isHalalTrustBadge)) {
    return source;
  }

  return [...source, HALAL_LABEL];
}
