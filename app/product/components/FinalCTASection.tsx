import type { FinalCtaConfig } from "@/lib/page-builder/types";
import { resolveHeroTrustBadges } from "@/lib/page-builder/hero-trust";
import { getSectionPaddingClass } from "@/lib/page-builder/section-spacing";
import {
  buildPrimaryCtaClassName,
} from "@/lib/page-builder/product-page-theme";
import type { ProductPageTheme } from "@/lib/page-builder/types";
import { HeroTrustBadge } from "./TrustBadgeItem";

type Props = {
  config: FinalCtaConfig;
  productName: string;
  urgency: string;
  onOrder: () => void;
  ctaLabel: string;
  price: number;
  codTrust: string[];
  surfaceClass?: string;
  theme?: ProductPageTheme;
};

export default function FinalCTASection({
  config,
  productName,
  urgency,
  onOrder,
  ctaLabel,
  price,
  codTrust,
  surfaceClass = "bg-ivory",
  theme,
}: Props) {
  if (!config.enabled) return null;

  const title = config.title || `جاهزة لتجربة ${productName}؟`;
  const subtitle = config.subtitle || urgency;

  const trustBadges = resolveHeroTrustBadges(codTrust);
  const paddingClass = theme ? getSectionPaddingClass(theme) : "py-12 sm:py-14";
  const buttonStyle = theme?.buttonStyle ?? "rounded-full";

  return (
    <section className={`border-t border-champagne/10 ${surfaceClass} ${paddingClass}`}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {config.label ? (
          <p className="section-label mb-3 text-xs text-champagne">{config.label}</p>
        ) : null}
        <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-muted">{subtitle}</p>

        {config.showTrustBadges && trustBadges.length > 0 ? (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {trustBadges.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOrder}
          className={`${buildPrimaryCtaClassName({ buttonStyle, sizeClass: "py-4 text-lg", fullWidth: false })} mx-auto max-w-md`}
        >
          <span className="relative z-10">{ctaLabel}</span>
          <span className="relative z-10 mr-2 text-champagne-light">
            — {price} ر.س
          </span>
          <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
        </button>

        {config.footnote ? (
          <p className="mt-4 text-xs text-muted">{config.footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
