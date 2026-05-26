import { isHalalTrustBadge } from "@/lib/page-builder/hero-trust";

function isShippingBadge(label: string): boolean {
  return /شحن|shipping|delivery/i.test(label);
}

function isCodBadge(label: string): boolean {
  return /دفع|cod|استلام/i.test(label);
}

function isQualityBadge(label: string): boolean {
  return /ضمان|quality|جودة/i.test(label);
}

export function TrustBadgeIcon({ label }: { label: string }) {
  if (isHalalTrustBadge(label)) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 via-white to-champagne/20 ring-1 ring-emerald-200/60"
        aria-hidden
      >
        <span className="font-serif text-[9px] font-bold leading-none text-emerald-900/90">
          ح
        </span>
      </span>
    );
  }

  if (isShippingBadge(label)) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor">
          <path
            d="M3 6.5h10l2.5 2.5V14H15"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </span>
    );
  }

  if (isCodBadge(label)) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor">
          <rect x="3.5" y="6" width="13" height="8" rx="1.5" strokeWidth="1.3" />
          <path d="M6.5 9.5h4M11.5 9.5h2" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  if (isQualityBadge(label)) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-champagne"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor">
          <path
            d="M10 3.5l1.6 3.2 3.5.5-2.5 2.4.6 3.5L10 11.8l-3.2 1.8.6-3.5-2.5-2.4 3.5-.5L10 3.5z"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/10 text-[11px] text-champagne"
      aria-hidden
    >
      ✓
    </span>
  );
}

export function HeroTrustBadge({
  label,
  compact = false,
  variant = "default",
}: {
  label: string;
  compact?: boolean;
  variant?: "default" | "purchase";
}) {
  const halal = isHalalTrustBadge(label);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] ${
          halal ? "font-medium text-emerald-900/85" : "text-muted"
        }`}
      >
        <TrustBadgeIcon label={label} />
        {label}
      </span>
    );
  }

  if (variant === "purchase") {
    return (
      <span
        className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-[10px] font-medium sm:text-[11px] ${
          halal
            ? "border-emerald-200/50 bg-gradient-to-l from-emerald-50/90 via-white/80 to-champagne/10 text-emerald-900/90"
            : "border-champagne/15 bg-white/80 text-foreground/85"
        }`}
      >
        <TrustBadgeIcon label={label} />
        <span className="leading-tight">{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-sm ${
        halal
          ? "border-emerald-200/45 bg-gradient-to-l from-emerald-50/85 via-white/75 to-champagne/10 text-emerald-900/90"
          : "border-champagne/20 bg-white/70 text-foreground/85"
      }`}
    >
      <TrustBadgeIcon label={label} />
      {label}
    </span>
  );
}
