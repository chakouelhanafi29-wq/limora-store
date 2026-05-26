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

/** True when a review has an intentionally uploaded or curated avatar image. */
export function hasCustomReviewImage(
  imageUrl: string | null | undefined,
): boolean {
  if (!imageUrl?.trim()) return false;
  return !isLegacyReviewImage(imageUrl);
}

export function getReviewInitial(customerName: string): string {
  const trimmed = customerName.trim();
  if (!trimmed) return "ل";
  return trimmed.charAt(0);
}

const REVIEW_AVATAR_GRADIENTS = [
  "from-[#f6d9e2] to-[#e8b4c4]",
  "from-[#ecd9f0] to-[#d4a8dc]",
  "from-[#fde8d8] to-[#f0c4a8]",
  "from-[#dce8f6] to-[#b8cfe8]",
  "from-[#e8f0e0] to-[#c4d4b8]",
  "from-[#f0e0e8] to-[#d4b8c4]",
  "from-[#f5e6dc] to-[#ddb8a8]",
  "from-[#e6dff5] to-[#c4b8e0]",
] as const;

export function getReviewAvatarGradient(customerName: string): string {
  const hash = customerName
    .trim()
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return REVIEW_AVATAR_GRADIENTS[hash % REVIEW_AVATAR_GRADIENTS.length];
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
