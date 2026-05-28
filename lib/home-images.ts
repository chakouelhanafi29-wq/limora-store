export const HOME_TRANSFORMATION_IMAGES = {
  collagenGlow: "/home/transformations/collagen-glow.webp",
  hairRevive: "/home/transformations/hair-revive.webp",
  feminineBalance: "/home/transformations/feminine-balance.webp",
} as const;

export type HomeTransformationItem = {
  productName: string;
  title: string;
  emotionalLine: string;
  description: string;
  image: string;
  stat: string;
  statLabel: string;
  href: string;
  accent: "rose" | "gold" | "sage";
};
