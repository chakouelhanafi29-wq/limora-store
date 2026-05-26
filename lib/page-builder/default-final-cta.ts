import type { FinalCtaConfig } from "./types";

export function createDefaultFinalCta(productName = "LIMORA"): FinalCtaConfig {
  return {
    enabled: true,
    label: "READY TO GLOW",
    title: `جاهزة لتجربة ${productName}؟`,
    subtitle: "✨ شحن مجاني + الدفع عند الاستلام داخل السعودية",
    footnote: "🔒 طلبكِ آمن · الدفع عند الاستلام فقط · لا بطاقة ائتمان",
    showTrustBadges: true,
  };
}
