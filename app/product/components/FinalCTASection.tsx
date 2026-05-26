import type { FinalCtaConfig } from "@/lib/page-builder/types";

type Props = {
  config: FinalCtaConfig;
  productName: string;
  urgency: string;
  onOrder: () => void;
  ctaLabel: string;
  price: number;
  codTrust: string[];
};

export default function FinalCTASection({
  config,
  productName,
  urgency,
  onOrder,
  ctaLabel,
  price,
  codTrust,
}: Props) {
  if (!config.enabled) return null;

  const title = config.title || `جاهزة لتجربة ${productName}؟`;
  const subtitle = config.subtitle || urgency;

  return (
    <section className="border-t border-champagne/10 bg-gradient-to-b from-beige/60 to-ivory py-12 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {config.label ? (
          <p className="section-label mb-3 text-xs text-champagne">{config.label}</p>
        ) : null}
        <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-muted">{subtitle}</p>

        {config.showTrustBadges && codTrust.length > 0 ? (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {codTrust.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full border border-champagne/15 bg-white/80 px-3 py-1.5 text-[11px] font-medium text-foreground/80"
              >
                <span className="text-champagne">✓</span>
                {item}
              </span>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOrder}
          className="group relative mx-auto w-full max-w-md overflow-hidden rounded-full bg-foreground py-4 text-lg font-medium text-ivory transition hover:shadow-2xl"
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
