"use client";

import { useEffect, useState } from "react";

type Props = {
  label?: string;
  href?: string;
  preview?: boolean;
};

export default function HomeStickyMobileCTA({
  label = "تسوقي LIMORA الآن",
  href = "#products",
  preview = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (preview) {
      setVisible(true);
      return;
    }

    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preview]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-champagne/15 bg-ivory/95 px-4 pt-3 backdrop-blur-xl transition-all duration-500 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-lg space-y-2">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[10px] text-muted">
          <span>✓ دفع عند الاستلام</span>
          <span>✓ شحن مجاني</span>
          <span>✓ تأكيد هاتفي</span>
        </div>
        <a
          href={href}
          className="luxury-focus-ring block w-full rounded-full bg-foreground py-3.5 text-center text-sm font-semibold text-ivory transition hover:bg-champagne hover:text-foreground"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
