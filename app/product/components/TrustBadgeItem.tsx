export function isHalalTrustBadge(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return normalized === "حلال" || normalized.includes("halal");
}

export function TrustBadgeIcon({ label }: { label: string }) {
  if (isHalalTrustBadge(label)) {
    return (
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-champagne/20 ring-1 ring-emerald-200/50"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-2.5 w-2.5 text-emerald-800/90">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M10 4.5v11M7 7.5c1.2-1 2.2-1 3 0s1.8 1 3 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return <span className="text-champagne">✓</span>;
}

export function HeroTrustBadge({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  const halal = isHalalTrustBadge(label);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] ${
          halal ? "font-medium text-emerald-900/85" : "text-muted"
        }`}
      >
        <TrustBadgeIcon label={label} />
        {label}
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
