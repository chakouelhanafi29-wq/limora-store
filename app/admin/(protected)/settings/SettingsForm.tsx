"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types/database";
import Ga4SettingsPanel, { type Ga4SettingsHandle } from "./Ga4SettingsPanel";
import MetaDomainSetupPanel from "./MetaDomainSetupPanel";
import TrackingSettingsPanel, {
  type TrackingSettingsHandle,
} from "./TrackingSettingsPanel";
import type { Ga4AdminSettingsSnapshot } from "@/lib/analytics/ga4/admin-settings";

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
  ga4Initial,
}: {
  initialSettings: Settings | null;
  ga4Initial: Ga4AdminSettingsSnapshot;
}) {
  const router = useRouter();
  const trackingRef = useRef<TrackingSettingsHandle>(null);
  const ga4Ref = useRef<Ga4SettingsHandle>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    site_url:
      initialSettings?.site_url ?? "https://www.limorashop.co",
    site_domain: initialSettings?.site_domain ?? "limorashop.co",
    meta_domain_verification:
      initialSettings?.meta_domain_verification ?? "",
    site_name: initialSettings?.site_name ?? "LIMORA",
    logo_url: initialSettings?.logo_url ?? "",
    favicon_url: initialSettings?.favicon_url ?? "",
    seo_title: initialSettings?.seo_title ?? "",
    seo_description: initialSettings?.seo_description ?? "",
    seo_keywords: initialSettings?.seo_keywords ?? "",
    og_image_url: initialSettings?.og_image_url ?? "",
    twitter_handle: initialSettings?.twitter_handle ?? "",
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
        meta_domain_verification: form.meta_domain_verification?.trim() || null,
        site_name: form.site_name || "LIMORA",
        logo_url: form.logo_url || null,
        favicon_url: form.favicon_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        seo_keywords: form.seo_keywords || null,
        og_image_url: form.og_image_url || null,
        twitter_handle: form.twitter_handle || null,
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

    await Promise.all([
      trackingRef.current?.save(),
      ga4Ref.current?.save(),
    ]);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

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
            اربطي نطاق الإعلانات (www.limorashop.co) — يُستخدم في SEO و CAPI
            و event_source_url.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Site URL</span>
            <span className="mb-2 block text-xs text-muted">
              مثال: https://www.limorashop.co (بدون / في النهاية)
            </span>
            <input
              dir="ltr"
              placeholder="https://www.limorashop.co"
              value={form.site_url}
              onChange={(e) => setForm({ ...form, site_url: e.target.value })}
              className="w-full rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Domain</span>
            <input
              dir="ltr"
              placeholder="limorashop.co"
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

      <Ga4SettingsPanel ref={ga4Ref} initial={ga4Initial} />

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">
            META ADS TRACKING
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold">
            Meta · TikTok · Snapchat
          </h2>
          <p className="mt-2 text-sm text-muted">
            Pixel IDs للمتصفح + Conversion API — بدون تعديل Vercel في كل مرة.
          </p>
        </div>

        <MetaDomainSetupPanel
          siteUrl={form.site_url}
          siteDomain={form.site_domain}
          metaDomainVerification={form.meta_domain_verification}
          onMetaDomainVerificationChange={(value) =>
            setForm({ ...form, meta_domain_verification: value })
          }
        />

        <div className="my-6" />

        <TrackingSettingsPanel ref={trackingRef} />

        <div className="mt-6 rounded-xl bg-beige/40 p-4 text-xs leading-relaxed text-muted">
          أحداث المتجر (جميع المنصات + GA4): PageView · ViewContent · AddToCart
          · InitiateCheckout · Lead · Purchase
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
