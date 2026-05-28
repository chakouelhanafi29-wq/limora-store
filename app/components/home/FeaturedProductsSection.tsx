import Image from "next/image";
import Link from "next/link";
import type { FeaturedProductCard } from "@/lib/storefront";

type Props = {
  products: FeaturedProductCard[];
  label?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  buttonRadius?: string;
};

const CARD_ACCENTS = [
  "from-rose-gold/15 via-champagne/8 to-transparent",
  "from-champagne/20 via-amber-100/10 to-transparent",
  "from-[#f5dce3]/40 via-rose-gold/10 to-transparent",
] as const;

export default function FeaturedProductsSection({
  products,
  label = "FEATURED COLLECTION",
  title = "مختارات LIMORA الفاخرة",
  subtitle = "ثلاث تركيبات… ثلاثة تحولات. اختاري ما يليق بجمالكِ.",
  className = "py-20 sm:py-28",
  buttonRadius = "rounded-full",
}: Props) {
  return (
    <section
      id="products"
      data-section="featured-products"
      data-ui-version="2"
      className={`featured-collection-section relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory via-beige/35 to-ivory"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-champagne/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-rose-gold/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-20">
          <span className="featured-collection-label inline-flex items-center justify-center rounded-full border border-champagne/25 bg-white/70 px-5 py-2 text-[10px] font-medium tracking-[0.28em] text-champagne backdrop-blur-sm">
            {label}
          </span>

          <h2 className="featured-collection-title mt-6 font-arabic-kufi text-3xl font-bold leading-[1.35] sm:text-4xl lg:text-[2.75rem]">
            <span className="bg-gradient-to-l from-champagne via-rose-gold to-heading bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-champagne/45 to-transparent" />

          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {products.map((product, index) => {
            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
            const href = `/product/${product.slug}`;

            return (
              <article
                key={product.id}
                className="featured-product-card group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white/92 ring-1 ring-champagne/12 luxury-shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-champagne/10 hover:ring-champagne/25"
              >
                {product.badge ? (
                  <span className="absolute top-5 right-5 z-20 rounded-full bg-gradient-to-l from-champagne to-rose-gold px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-md shadow-champagne/20">
                    {product.badge}
                  </span>
                ) : null}

                <Link
                  href={href}
                  className="relative mx-4 mt-4 block overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-beige/70 to-ivory ring-1 ring-champagne/10"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04] sm:p-5"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-heading/10 via-transparent to-transparent opacity-80" />
                    <div
                      className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${accent} to-transparent`}
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-champagne">
                    {product.nameEn}
                  </p>

                  <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-heading sm:text-2xl">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-rose-gold">
                    {product.benefit}
                  </p>

                  {product.description ? (
                    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                      {product.description}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <div className="mt-6 flex flex-col gap-4 border-t border-champagne/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="text-right">
                      <p className="font-arabic-kufi text-2xl font-bold text-heading">
                        {product.price}
                        <span className="mr-1 text-sm font-normal text-muted">ر.س</span>
                      </p>
                      {product.originalPrice ? (
                        <p className="mt-0.5 text-xs text-muted line-through">
                          {product.originalPrice} ر.س
                        </p>
                      ) : null}
                    </div>

                    <Link
                      href={href}
                      className={`featured-product-cta inline-flex items-center justify-center ${buttonRadius} border border-champagne/30 bg-gradient-to-l from-champagne/15 to-rose-gold/10 px-6 py-2.5 text-sm font-medium text-heading transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white hover:shadow-lg hover:shadow-champagne/20`}
                    >
                      {product.cta}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
