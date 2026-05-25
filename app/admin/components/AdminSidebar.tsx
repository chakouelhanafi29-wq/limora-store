"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: "◈" },
  { href: "/admin/analytics", label: "التحليلات", icon: "📊" },
  { href: "/admin/product-builder", label: "محرر الصفحة", icon: "🎨" },
  { href: "/admin/orders", label: "الطلبات", icon: "📦" },
  { href: "/admin/products", label: "المنتجات", icon: "✦" },
  { href: "/admin/customers", label: "العملاء", icon: "👤" },
  { href: "/admin/reviews", label: "التقييمات", icon: "★" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙" },
  { href: "/admin/setup", label: "ربط Supabase", icon: "🔗" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase?.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <>
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/admin" className="font-serif text-xl tracking-[0.15em]">
          LIMORA
        </Link>
        <p className="mt-1 text-xs text-ivory/40">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-champagne/20 text-champagne-light"
                  : "text-ivory/60 hover:bg-white/5 hover:text-ivory"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 block rounded-xl px-4 py-2 text-xs text-ivory/50 hover:text-champagne-light"
        >
          ← عرض المتجر
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-2 text-left text-xs text-ivory/50 hover:bg-white/5 hover:text-ivory"
        >
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 right-4 z-50 rounded-xl bg-[#2a201e] px-4 py-2 text-sm text-ivory lg:hidden"
      >
        القائمة
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-white/10 bg-[#2a201e] text-ivory transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
