import { resolveHeroTrustBadges } from "@/lib/page-builder/hero-trust";
import { HeroTrustBadge } from "./TrustBadgeItem";

export default function PurchaseTrustStrip({ items }: { items: string[] }) {
  const badges = resolveHeroTrustBadges(items);

  return (
    <div className="mt-4 rounded-2xl border border-champagne/15 bg-gradient-to-l from-white/95 via-beige/25 to-white/90 p-3 shadow-sm sm:mt-5 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {badges.map((label) => (
          <HeroTrustBadge key={label} label={label} variant="purchase" />
        ))}
      </div>
    </div>
  );
}
