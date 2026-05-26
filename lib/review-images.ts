export const REVIEW_AVATARS = {
  noura: "/reviews/noura-alotaibi.webp",
  fatima: "/reviews/fatima-aldosari.webp",
  maryam: "/reviews/maryam-alqahtani.webp",
  sara: "/reviews/sara-alharbi.webp",
  lama: "/reviews/lama-alshammari.webp",
  hind: "/reviews/hind-alzahrani.webp",
  reem: "/reviews/reem-alqahtani.webp",
  dana: "/reviews/dana-almutairi.webp",
} as const;

export const DEFAULT_REVIEW_AVATAR = REVIEW_AVATARS.noura;

const REVIEW_IMAGE_BY_NAME: Record<string, string> = {
  "نورة العتيبي": REVIEW_AVATARS.noura,
  "فاطمة الدوسري": REVIEW_AVATARS.fatima,
  "مريم القحطاني": REVIEW_AVATARS.maryam,
  "سارة الحربي": REVIEW_AVATARS.sara,
  "لمى الشمري": REVIEW_AVATARS.lama,
  "هند الزهراني": REVIEW_AVATARS.hind,
  "ريم القحطاني": REVIEW_AVATARS.reem,
  "ريم الشمري": REVIEW_AVATARS.reem,
  "دانة المطيري": REVIEW_AVATARS.dana,
  "دانة القحطاني": REVIEW_AVATARS.dana,
};

export function resolveReviewAvatar(
  customerName: string,
  fallback = DEFAULT_REVIEW_AVATAR,
): string {
  return REVIEW_IMAGE_BY_NAME[customerName.trim()] ?? fallback;
}

export function isLegacyReviewImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  return (
    url.includes("unsplash.com") ||
    url.includes("images.unsplash") ||
    url.startsWith("https://images.unsplash")
  );
}

export function normalizeReviewImage(
  customerName: string,
  imageUrl: string | null | undefined,
): string {
  if (isLegacyReviewImage(imageUrl)) {
    return resolveReviewAvatar(customerName);
  }
  return imageUrl?.trim() || resolveReviewAvatar(customerName);
}
