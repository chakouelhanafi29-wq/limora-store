import type { StorefrontProduct } from "@/lib/storefront";

type Props = {
  product: StorefrontProduct;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 text-champagne">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">
        {rating}/5
      </span>
    </div>
  );
}

export default function ProductInfo({ product }: Props) {
  return (
    <div className="flex flex-col">
      <p className="mb-2 text-xs tracking-[0.25em] uppercase" style={{ color: "var(--builder-accent, var(--champagne))" }}>
        {product.nameEn}
      </p>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
        {product.name}
      </h1>
      {product.emotionalHook ? (
        <p className="mb-2 text-sm font-semibold text-rose-gold/90">
          {product.emotionalHook}
        </p>
      ) : null}
      <p className="mb-5 text-lg font-medium text-rose-gold">
        {product.subtitle}
      </p>

      <Stars rating={product.rating} />

      <ul className="my-8 space-y-3">
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

      <p className="mb-6 rounded-2xl border border-champagne/30 bg-champagne/10 px-4 py-3 text-sm font-medium text-foreground">
        {product.urgency}
      </p>
    </div>
  );
}
