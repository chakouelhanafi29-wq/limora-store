"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types/database";

async function uploadBrandAsset(file: File, folder: string) {
  const supabase = createClient();
  if (!supabase) return null;
  const path = `brand/${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) {
    alert(error.message);
    return null;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);
  return publicUrl;
}

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Settings | null;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    site_url: initialSettings?.site_url ?? "",
    site_domain: initialSettings?.site_domain ?? "",
    site_name: initialSettings?.site_name ?? "LIMORA",
    logo_url: initialSettings?.logo_url ?? "",
    favicon_url: initialSettings?.favicon_url ?? "",
    seo_title: initialSettings?.seo_title ?? "",
    seo_description: initialSettings?.seo_description ?? "",
    seo_keywords: initialSettings?.seo_keywords ?? "",
    og_image_url: initialSettings?.og_image_url ?? "",
    twitter_handle: initialSettings?.twitter_handle ?? "",
    facebook_pixel_id: initialSettings?.facebook_pixel_id ?? "",
    tiktok_pixel_id: initialSettings?.tiktok_pixel_id ?? "",
    snapchat_pixel_id: initialSettings?.snapchat_pixel_id ?? "",
    google_analytics_id: initialSettings?.google_analytics_id ?? "",
    whatsapp_number: initialSettings?.whatsapp_number ?? "",
    free_shipping: initialSettings?.free_shipping ?? true,
    cod_enabled: initialSettings?.cod_enabled ?? true,
    announcement_1: initialSettings?.announcement_1 ?? "",
    announcement_2: initialSettings?.announcement_2 ?? "",
    announcement_3: initialSettings?.announcement_3 ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      alert("Supabase غير مُفعّل");
      return;
    }

    const { error } = await supabase
      .from("settings")
      .update({
        site_url: form.site_url || null,
        site_domain: form.site_domain || null,
        site_name: form.site_name || "LIMORA",
        logo_url: form.logo_url || null,
        favicon_url: form.favicon_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        seo_keywords: form.seo_keywords || null,
        og_image_url: form.og_image_url || null,
        twitter_handle: form.twitter_handle || null,
        facebook_pixel_id: form.facebook_pixel_id || null,
        tiktok_pixel_id: form.tiktok_pixel_id || null,
        snapchat_pixel_id: form.snapchat_pixel_id || null,
        google_analytics_id: form.google_analytics_id || null,
        whatsapp_number: form.whatsapp_number || null,
        free_shipping: form.free_shipping,
        cod_enabled: form.cod_enabled,
        announcement_1: form.announcement_1,
        announcement_2: form.announcement_2,
        announcement_3: form.announcement_3,
      })
      .eq("id", 1);

    if (error) {
      alert(error.message);
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  const trackingFields = [
    {
      key: "facebook_pixel_id" as const,
      label: "Meta Pixel ID",
      hint: "Facebook / Instagram Ads",
      placeholder: "1234567890123456",
    },
    {
      key: "tiktok_pixel_id" as const,
      label: "TikTok Pixel ID",
      hint: "TikTok Ads Manager",
      placeholder: "CXXXXXXXXXXXXXXX",
    },
    {
      key: "snapchat_pixel_id" as const,
      label: "Snapchat Pixel ID",
      hint: "Snap Ads Manager",
      placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
    {
      key: "google_analytics_id" as const,
      label: "Google Analytics ID",
      hint: "GA4 Measurement ID",
      placeholder: "G-XXXXXXXXXX",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">
            DOMAIN & BRANDING
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">
            النطاق والهوية
          </h2>
          <p className="mt-2 text-sm text-muted">
            اربطي نطاقكِ المخصص (مثل limora.sa) — يُستخدم في SEO والروابط
            الأساسية و sitemap.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Site URL</span>
            <span className="mb-2 block text-xs text-muted">
              مثال: https://limora.sa (بدون / في النهاية)
            </span>
            <input
              dir="ltr"
              placeholder="https://limora.sa"
              value={form.site_url}
              onChange={(e) => setForm({ ...form, site_url: e.target.value })}
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Domain</span>
            <input
              dir="ltr"
              placeholder="limora.sa"
              value={form.site_domain}
              onChange={(e) =>
                setForm({ ...form, site_domain: e.target.value })
              }
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">اسم العلامة</span>
            <input
              value={form.site_name}
              onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <BrandAssetField
            label="الشعار (Logo URL)"
            value={form.logo_url}
            onChange={(url) => setForm({ ...form, logo_url: url })}
            onUpload={(file) =>
              uploadBrandAsset(file, "logo").then((url) => {
                if (url) setForm((prev) => ({ ...prev, logo_url: url }));
              })
            }
          />
          <BrandAssetField
            label="Favicon URL"
            value={form.favicon_url}
            onChange={(url) => setForm({ ...form, favicon_url: url })}
            onUpload={(file) =>
              uploadBrandAsset(file, "favicon").then((url) => {
                if (url) setForm((prev) => ({ ...prev, favicon_url: url }));
              })
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">SEO</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">
            تحسين محركات البحث
          </h2>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Meta Title</span>
            <input
              value={form.seo_title}
              onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Meta Description</span>
            <textarea
              value={form.seo_description}
              onChange={(e) =>
                setForm({ ...form, seo_description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Keywords</span>
            <input
              value={form.seo_keywords}
              onChange={(e) =>
                setForm({ ...form, seo_keywords: e.target.value })
              }
              placeholder="ليمورا, مكملات تجميل, السعودية"
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Open Graph Image URL</span>
            <input
              dir="ltr"
              value={form.og_image_url}
              onChange={(e) =>
                setForm({ ...form, og_image_url: e.target.value })
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Twitter Handle</span>
            <input
              dir="ltr"
              value={form.twitter_handle}
              onChange={(e) =>
                setForm({ ...form, twitter_handle: e.target.value })
              }
              placeholder="@limora"
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">
            TRACKING & ANALYTICS
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">
            تتبع الإعلانات والتحليلات
          </h2>
          <p className="mt-2 text-sm text-muted">
            اربطي منصات الإعلانات و Google Analytics — يتم حقن الأكواد تلقائياً
            في المتجر وتتبع التحويلات.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trackingFields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1 block text-sm font-medium">{field.label}</span>
              <span className="mb-2 block text-xs text-muted">{field.hint}</span>
              <input
                dir="ltr"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-beige/40 p-4 text-xs leading-relaxed text-muted">
          الأحداث المتتبعة: PageView · ViewContent · AddToCart · InitiateCheckout
          · Lead · Purchase
        </div>
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <h2 className="mb-4 font-semibold">التواصل والشحن</h2>
        <input
          placeholder="WhatsApp Number (9665XXXXXXXX)"
          dir="ltr"
          value={form.whatsapp_number}
          onChange={(e) =>
            setForm({ ...form, whatsapp_number: e.target.value })
          }
          className="mb-3 w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.free_shipping}
            onChange={(e) =>
              setForm({ ...form, free_shipping: e.target.checked })
            }
          />
          شحن مجاني
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.cod_enabled}
            onChange={(e) =>
              setForm({ ...form, cod_enabled: e.target.checked })
            }
          />
          تفعيل الدفع عند الاستلام
        </label>
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <h2 className="mb-4 font-semibold">شريط الإعلانات</h2>
        {[1, 2, 3].map((n) => {
          const key = `announcement_${n}` as
            | "announcement_1"
            | "announcement_2"
            | "announcement_3";
          return (
            <input
              key={n}
              placeholder={`رسالة ${n}`}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mb-2 w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          );
        })}
      </section>

      <button
        type="submit"
        className="rounded-full bg-foreground px-8 py-3 text-sm text-ivory hover:bg-champagne"
      >
        حفظ الإعدادات
      </button>
      {saved && (
        <p className="text-sm text-emerald-600">تم الحفظ بنجاح ✓</p>
      )}
    </form>
  );
}

function BrandAssetField({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{label}</span>
        <input
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
      </label>
      {value ? (
        <img src={value} alt="" className="mt-2 h-12 w-auto rounded-lg object-contain" />
      ) : null}
      <label className="mt-2 inline-block cursor-pointer rounded-full border border-champagne/30 px-4 py-2 text-xs hover:bg-beige">
        + رفع ملف
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
      </label>
    </div>
  );
}
