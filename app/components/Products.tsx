import Image from "next/image";
import Link from "next/link";
import type { FeaturedProductCard } from "@/lib/storefront";

type Props = {
  products: FeaturedProductCard[];
};

export default function Products({ products }: Props) {
  return (
    <section id="products" className="bg-beige/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            FEATURED COLLECTION
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            مختارات LIMORA الفاخرة
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            ثلاث تركيبات… ثلاثة تحولات. اختاري ما يليق بجمالكِ.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white luxury-shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-champagne/10"
            >
              {product.badge && (
                <span className="absolute top-4 right-4 z-10 rounded-full bg-champagne px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}

              <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain bg-beige/30 p-3 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="mb-1 text-xs tracking-widest text-champagne uppercase">
                  {product.nameEn}
                </p>
                <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="mb-3 text-sm font-medium text-rose-gold">
                  {product.benefit}
                </p>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>

                <div className="flex items-center justify-between border-t border-champagne/10 pt-5">
                  <div>
                    <span className="font-serif text-2xl font-semibold text-foreground">
                      {product.price}
                    </span>
                    <span className="mr-1 text-sm text-muted">ر.س</span>
                    {product.originalPrice && (
                      <span className="mr-2 text-sm text-muted line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link
                    href={
                      product.slug === "glow"
                        ? "/product"
                        : `/product?slug=${product.slug}`
                    }
                    className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-ivory transition-all hover:bg-champagne hover:shadow-lg"
                  >
                    {product.cta}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
