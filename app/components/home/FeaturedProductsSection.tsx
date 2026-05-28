import Image from "next/image";
import Link from "next/link";
import type { FeaturedProductCard } from "@/lib/storefront";
import "./featured-products.css";

type Props = {
  products: FeaturedProductCard[];
  label?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  buttonRadius?: string;
};

export default function FeaturedProductsSection({
  products,
  label = "FEATURED COLLECTION",
  title = "مختارات LIMORA الفاخرة",
  subtitle = "ثلاث تركيبات… ثلاثة تحولات. اختاري ما يليق بجمالكِ.",
  className = "",
  buttonRadius = "rounded-full",
}: Props) {
  const ctaClass =
    buttonRadius === "rounded-xl"
      ? "featured-product-card__cta featured-product-card__cta--rounded-xl"
      : "featured-product-card__cta";

  return (
    <section
      id="products"
      data-section="featured-products"
      data-ui-version="3"
      className={`featured-collection-section ${className}`.trim()}
    >
      <div className="featured-collection-section__inner">
        <header className="featured-collection-section__header">
          <span className="featured-collection-section__label">{label}</span>
          <h2 className="featured-collection-section__title">{title}</h2>
          <div className="featured-collection-section__divider" aria-hidden="true" />
          {subtitle ? (
            <p className="featured-collection-section__subtitle">{subtitle}</p>
          ) : null}
        </header>

        <div className="featured-collection-section__grid">
          {products.map((product) => {
            const href = `/product/${product.slug}`;

            return (
              <article key={product.id} className="featured-product-card">
                {product.badge ? (
                  <span className="featured-product-card__badge">{product.badge}</span>
                ) : null}

                <Link href={href} className="featured-product-card__media-wrap">
                  <div className="featured-product-card__media">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="featured-product-card__media-overlay" aria-hidden="true" />
                  </div>
                </Link>

                <div className="featured-product-card__body">
                  <p className="featured-product-card__brand">{product.nameEn}</p>
                  <h3 className="featured-product-card__name">{product.name}</h3>
                  <p className="featured-product-card__benefit">{product.benefit}</p>

                  {product.description ? (
                    <p className="featured-product-card__description">
                      {product.description}
                    </p>
                  ) : (
                    <div style={{ flex: 1 }} aria-hidden="true" />
                  )}

                  <div className="featured-product-card__footer">
                    <div>
                      <p className="featured-product-card__price">
                        {product.price}
                        <span className="featured-product-card__price-unit">ر.س</span>
                      </p>
                      {product.originalPrice ? (
                        <p className="featured-product-card__price-old">
                          {product.originalPrice} ر.س
                        </p>
                      ) : null}
                    </div>

                    <Link href={href} className={ctaClass}>
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
