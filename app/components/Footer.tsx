import Link from "next/link";
import { brand, footer } from "../lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-champagne/10 bg-[#2a201e] text-ivory/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:gap-20">
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-[0.15em] text-ivory">
                {brand.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/50">
              {footer.tagline}
            </p>
            <p className="mt-4 text-xs tracking-wide text-ivory/40">
              {footer.location}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ivory">روابط سريعة</h4>
            <ul className="space-y-3 text-sm text-ivory/50">
              {footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-champagne-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ivory/10 pt-8">
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {["شحن مجاني", "الدفع عند الاستلام", "ضمان الجودة", "دعم العملاء"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-ivory/15 bg-ivory/5 px-3 py-1.5 text-[11px] text-ivory/70"
                >
                  ✓ {item}
                </span>
              ),
            )}
          </div>
          <p className="text-center text-xs text-ivory/40">
            © 2026 {brand.name}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
