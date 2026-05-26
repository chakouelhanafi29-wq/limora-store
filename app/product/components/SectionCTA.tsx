type Props = {
  onOrder: () => void;
  ctaLabel: string;
  price: number;
  subtitle?: string;
  footnote?: string;
};

export default function SectionCTA({
  onOrder,
  ctaLabel,
  price,
  subtitle = "دفع عند الاستلام · شحن مجاني · ضمان الجودة",
  footnote = "✓ الدفع عند الاستلام · ✓ شحن مجاني · ✓ تأكيد سريع",
}: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 pb-4 pt-2 sm:px-6">
      <div className="rounded-3xl border border-champagne/20 bg-gradient-to-l from-champagne/10 via-white to-beige/40 p-6 text-center luxury-shadow">
        <p className="mb-3 text-sm text-muted">{subtitle}</p>
        <button
          type="button"
          onClick={onOrder}
          className="group relative w-full overflow-hidden rounded-full bg-foreground py-4 text-base font-medium text-ivory transition hover:shadow-xl"
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
