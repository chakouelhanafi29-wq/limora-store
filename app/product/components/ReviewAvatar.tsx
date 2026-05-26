import Image from "next/image";
import {
  getReviewAvatarGradient,
  getReviewInitial,
  hasCustomReviewImage,
} from "@/lib/review-images";

type Props = {
  name: string;
  image?: string | null;
  size?: "sm" | "md";
};

const SIZE_CLASSES = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
} as const;

export default function ReviewAvatar({ name, image, size = "md" }: Props) {
  const sizeClass = SIZE_CLASSES[size];

  if (hasCustomReviewImage(image)) {
    return (
      <div
        className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-full ring-2 ring-champagne/20`}
      >
        <Image
          src={image!.trim()}
          alt={name}
          fill
          className="object-cover"
          sizes={size === "sm" ? "40px" : "48px"}
        />
      </div>
    );
  }

  const initial = getReviewInitial(name);
  const gradient = getReviewAvatarGradient(name);

  return (
    <div
      className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${gradient} ring-2 ring-champagne/20 shadow-sm`}
      aria-hidden={!name.trim()}
    >
      <span className="font-serif font-semibold text-foreground/75">{initial}</span>
    </div>
  );
}
