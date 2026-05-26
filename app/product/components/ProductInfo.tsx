import type { StorefrontProduct } from "@/lib/storefront";
import { HeroTrustBadge } from "./TrustBadgeItem";

type Props = {
  product: StorefrontProduct;
  codTrust?: string[];
};

function Stars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.round(rating);
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="flex gap-0.5 text-champagne">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < fullStars ? "fill-current" : "fill-champagne/20"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">{rating}/5</span>
      {reviewCount > 0 && (
        <a
          href="#reviews"
          className="text-sm text-champagne underline-offset-2 hover:underline"
        >
          ({reviewCount.toLocaleString("ar-SA")}+ تقييم)
        </a>
      )}
    </div>
  );
}

function TrustBadges({ items }: { items: string[] }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <HeroTrustBadge key={item} label={item} />
      ))}
    </div>
  );
}

export default function ProductInfo({ product, codTrust = [] }: Props) {
  return (
    <div className="flex flex-col">
      <p
        className="mb-2 text-xs tracking-[0.25em] uppercase"
        style={{ color: "var(--builder-accent, var(--champagne))" }}
      >
        {product.nameEn}
      </p>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
        {product.name}
      </h1>
      <p className="mb-4 text-lg font-medium text-rose-gold">{product.subtitle}</p>

      <Stars rating={product.rating} reviewCount={product.reviewCount} />

      {codTrust.length > 0 && <TrustBadges items={codTrust} />}

      {product.emotionalHook ? (
        <p className="mb-5 rounded-2xl border border-rose-200/40 bg-rose-50/50 px-4 py-3 text-sm font-semibold leading-relaxed text-rose-gold/95">
          {product.emotionalHook}
        </p>
      ) : null}

      <ul className="mb-6 space-y-3">
        {product.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-sm text-foreground/80"
          >
            <span className="mt-0.5 text-champagne">✦</span>
            {bullet}
          </li>
        ))}
      </ul>

      <p className="mb-2 rounded-2xl border border-champagne/30 bg-champagne/10 px-4 py-3 text-sm font-medium text-foreground">
        {product.urgency}
      </p>
    </div>
  );
}
