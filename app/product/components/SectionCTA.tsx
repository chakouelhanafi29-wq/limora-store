import {
  buildPrimaryCtaClassName,
} from "@/lib/page-builder/product-page-theme";

type Props = {
  onOrder: () => void;
  ctaLabel: string;
  price: number;
  subtitle?: string;
  footnote?: string;
  buttonStyle?: "rounded-full" | "rounded-xl";
};

export default function SectionCTA({
  onOrder,
  ctaLabel,
  price,
  subtitle = "دفع عند الاستلام · شحن مجاني · ضمان الجودة",
  footnote = "✓ الدفع عند الاستلام · ✓ شحن مجاني · ✓ تأكيد سريع",
  buttonStyle = "rounded-full",
}: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl border border-champagne/20 bg-gradient-to-l from-champagne/10 via-white to-beige/40 p-5 text-center luxury-shadow sm:p-6">
        <p className="mb-3 text-sm text-muted">{subtitle}</p>
        <button
          type="button"
          onClick={onOrder}
          className={buildPrimaryCtaClassName({ buttonStyle })}
        >
          <span className="relative z-10">{ctaLabel}</span>
          <span className="relative z-10 mr-2 text-champagne-light">
            — {price} ر.س
          </span>
          <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
        </button>
        {footnote ? (
          <p className="mt-3 text-[11px] text-muted">{footnote}</p>
        ) : null}
      </div>
    </div>
  );
}
