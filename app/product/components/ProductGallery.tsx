"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { StorefrontProduct } from "@/lib/storefront";

type Props = {
  product: StorefrontProduct;
  aspectClass?: string;
};

export default function ProductGallery({
  product,
  aspectClass = "aspect-square",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const images = product.images;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  return (
    <div className="space-y-4">
      <div
        className={`group relative overflow-hidden rounded-3xl bg-beige luxury-shadow-lg ${aspectClass}`}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[activeIndex]}
          alt={`${product.name} — صورة ${activeIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-700 ease-out ${
            zoom ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />

        <button
          type="button"
          aria-label="الصورة السابقة"
          onClick={prev}
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        >
          ›
        </button>
        <button
          type="button"
          aria-label="الصورة التالية"
          onClick={next}
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        >
          ‹
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-champagne"
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden grid-cols-4 gap-3 sm:grid">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-square overflow-hidden rounded-xl transition-all ${
              i === activeIndex
                ? "ring-2 ring-champagne ring-offset-2 ring-offset-ivory"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${product.name} — مصغّر ${i + 1}`}
              fill
              className="object-cover"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
