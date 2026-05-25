"use client";

import { useCallback, useMemo, useState } from "react";
import ConfigurableHomePage from "@/app/components/home/ConfigurableHomePage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createBlankHomeSection,
  duplicateHomeSection,
  normalizeHomeSectionOrders,
} from "@/lib/home-builder/default-config";
import {
  HOME_SECTION_LABELS,
  type HomePageConfig,
  type HomeSectionType,
} from "@/lib/home-builder/types";
import type { FeaturedProductCard } from "@/lib/storefront";
import HomeSectionEditor from "./HomeSectionEditor";

type Tab = "hero" | "navbar" | "sections" | "theme" | "mobile";
type TestimonialsData = {
  label: string;
  title: string;
  subtitle: string;
  items: { name: string; location: string; product: string; rating: number; text: string; image: string }[];
};

const SECTION_TYPES = Object.keys(HOME_SECTION_LABELS) as HomeSectionType[];

export default function HomeBuilder({
  initialConfig,
  products,
  testimonials,
}: {
  initialConfig: HomePageConfig;
  products: FeaturedProductCard[];
  testimonials: TestimonialsData;
}) {
  const [config, setConfig] = useState(initialConfig);
  const [tab, setTab] = useState<Tab>("hero");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialConfig.sections.find((s) => s.type === "hero")?.id ?? initialConfig.sections[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [previewMobile, setPreviewMobile] = useState(false);

  const heroSection = useMemo(
    () => config.sections.find((s) => s.type === "hero"),
    [config.sections],
  );
  const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

  const updateConfig = useCallback((patch: Partial<HomePageConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }, []);

  const updateSection = (updated: (typeof config.sections)[0]) => {
    updateConfig({
      sections: config.sections.map((s) => (s.id === updated.id ? updated : s)),
    });
  };

  const save = async () => {
    if (!isSupabaseConfigured()) {
      alert("Supabase غير مُفعّل");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from("home_page_configs").upsert(
      { slug: "home", config: { ...config, slug: "home" } },
      { onConflict: "slug" },
    );
    setSaving(false);
    if (error) {
      const message = error.message.includes("home_page_configs")
        ? "جدول home_page_configs غير موجود. شغّلي supabase/ensure-migrations.sql في Supabase SQL Editor."
        : error.message;
      alert(message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadImage = async (file: File, sectionId: string, field: string) => {
    const supabase = createClient();
    if (!supabase) return;
    const path = `builder/home/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      alert(error.message);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    const section = config.sections.find((s) => s.id === sectionId);
    if (!section) return;
    updateSection({
      ...section,
      content: { ...section.content, [field]: publicUrl },
    });
  };

  const reorderSections = (fromId: string, toId: string) => {
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const fromIndex = sorted.findIndex((s) => s.id === fromId);
    const toIndex = sorted.findIndex((s) => s.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = sorted.splice(fromIndex, 1);
    sorted.splice(toIndex, 0, moved);
    updateConfig({ sections: normalizeHomeSectionOrders(sorted) });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "Hero" },
    { id: "navbar", label: "Navbar" },
    { id: "sections", label: "الأقسام" },
    { id: "theme", label: "التصميم" },
    { id: "mobile", label: "الجوال" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <div className="flex w-full flex-col border-l border-champagne/10 bg-white lg:w-[420px] lg:shrink-0">
        <div className="flex items-center justify-between border-b border-champagne/10 p-4">
          <div>
            <p className="text-xs text-champagne">HOME BUILDER</p>
            <h2 className="font-serif text-lg font-semibold">محرر الصفحة الرئيسية</h2>
          </div>
          <button type="button" onClick={save} disabled={saving} className="rounded-full bg-foreground px-5 py-2 text-xs text-ivory hover:bg-champagne disabled:opacity-60">
            {saving ? "جاري الحفظ..." : saved ? "تم ✓" : "حفظ"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-champagne/10 p-2">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-full px-3 py-1.5 text-xs ${tab === t.id ? "bg-champagne/20 text-foreground" : "text-muted hover:bg-beige"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "hero" && heroSection && (
            <HomeSectionEditor
              section={heroSection}
              onChange={updateSection}
              onUploadImage={(file, field) => uploadImage(file, heroSection.id, field)}
            />
          )}

          {tab === "navbar" && (
            <div className="space-y-3">
              <Field label="اسم العلامة" value={config.navbar.brandName} onChange={(v) => updateConfig({ navbar: { ...config.navbar, brandName: v } })} />
              <Field label="زر CTA" value={config.navbar.ctaLabel} onChange={(v) => updateConfig({ navbar: { ...config.navbar, ctaLabel: v } })} />
              <Field label="رابط CTA" value={config.navbar.ctaHref} onChange={(v) => updateConfig({ navbar: { ...config.navbar, ctaHref: v } })} />
              {config.navbar.links.map((link, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-xl bg-beige/30 p-3">
                  <input value={link.label} onChange={(e) => { const links = [...config.navbar.links]; links[i] = { ...link, label: e.target.value }; updateConfig({ navbar: { ...config.navbar, links } }); }} className="rounded-lg border border-champagne/20 px-3 py-2 text-sm" placeholder="Label" />
                  <input value={link.href} onChange={(e) => { const links = [...config.navbar.links]; links[i] = { ...link, href: e.target.value }; updateConfig({ navbar: { ...config.navbar, links } }); }} className="rounded-lg border border-champagne/20 px-3 py-2 text-sm" placeholder="Href" />
                </div>
              ))}
            </div>
          )}

          {tab === "sections" && (
            <div className="space-y-4">
              <div className="space-y-2">
                {[...config.sections].sort((a, b) => a.order - b.order).map((section) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => setDragId(section.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragId) reorderSections(dragId, section.id); setDragId(null); }}
                    className={`flex items-center gap-2 rounded-xl border p-3 ${selectedSectionId === section.id ? "border-champagne bg-champagne/10" : "border-champagne/10"}`}
                  >
                    <span className="cursor-grab text-muted">⋮⋮</span>
                    <button type="button" onClick={() => setSelectedSectionId(section.id)} className="flex-1 text-right text-sm">
                      {HOME_SECTION_LABELS[section.type]}
                    </button>
                    <button type="button" onClick={() => updateConfig({ sections: config.sections.map((s) => s.id === section.id ? { ...s, enabled: !s.enabled } : s) })} className={`text-xs ${section.enabled ? "text-emerald-600" : "text-muted"}`}>
                      {section.enabled ? "ON" : "OFF"}
                    </button>
                    <button type="button" onClick={() => updateConfig({ sections: normalizeHomeSectionOrders([...config.sections, duplicateHomeSection(section)]) })} className="text-xs text-champagne">نسخ</button>
                    <button type="button" onClick={() => { updateConfig({ sections: config.sections.filter((s) => s.id !== section.id) }); if (selectedSectionId === section.id) setSelectedSectionId(null); }} className="text-xs text-red-500">×</button>
                  </div>
                ))}
              </div>
              <select className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm" defaultValue="" onChange={(e) => {
                if (!e.target.value) return;
                const section = createBlankHomeSection(e.target.value as HomeSectionType);
                updateConfig({ sections: normalizeHomeSectionOrders([...config.sections, section]) });
                setSelectedSectionId(section.id);
                e.target.value = "";
              }}>
                <option value="">+ إضافة قسم</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>{HOME_SECTION_LABELS[type]}</option>
                ))}
              </select>
              {selectedSection && selectedSection.type !== "hero" && (
                <div className="rounded-xl border border-champagne/10 bg-beige/20 p-4">
                  <HomeSectionEditor section={selectedSection} onChange={updateSection} onUploadImage={(file, field) => uploadImage(file, selectedSection.id, field)} />
                </div>
              )}
            </div>
          )}

          {tab === "theme" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">Accent color</span>
                <input type="color" value={config.theme.accentColor} onChange={(e) => updateConfig({ theme: { ...config.theme, accentColor: e.target.value } })} className="h-10 w-full rounded-xl" />
              </label>
              {([["buttonStyle", "شكل الزر", ["rounded-full", "rounded-xl"]], ["heroGradient", "Hero", ["luxury", "soft", "minimal"]], ["sectionSpacing", "المسافات", ["compact", "normal", "spacious"]], ["sectionBackground", "الخلفية", ["ivory", "beige", "white"]]] as const).map(([key, label, options]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs text-muted">{label}</span>
                  <select value={config.theme[key]} onChange={(e) => updateConfig({ theme: { ...config.theme, [key]: e.target.value } })} className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm">
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              ))}
            </div>
          )}

          {tab === "mobile" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">مقياس المسافات ({config.mobile.spacingScale})</span>
                <input type="range" min="0.85" max="1.15" step="0.05" value={config.mobile.spacingScale} onChange={(e) => updateConfig({ mobile: { ...config.mobile, spacingScale: Number(e.target.value) } })} className="w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted">حجم الخط ({config.mobile.fontScale})</span>
                <input type="range" min="0.9" max="1.1" step="0.05" value={config.mobile.fontScale} onChange={(e) => updateConfig({ mobile: { ...config.mobile, fontScale: Number(e.target.value) } })} className="w-full" />
              </label>
              <div>
                <p className="mb-2 text-xs text-muted">ترتيب الأقسام على الجوال</p>
                {(config.mobile.sectionOrder ?? config.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order).map((s) => s.id)).map((sectionId, index, orderList) => {
                  const section = config.sections.find((s) => s.id === sectionId);
                  if (!section) return null;
                  return (
                    <div key={sectionId} className="mb-2 flex items-center gap-2 rounded-xl border border-champagne/10 bg-beige/30 p-2">
                      <span className="flex-1 text-right text-xs">{HOME_SECTION_LABELS[section.type]}</span>
                      <button type="button" disabled={index === 0} onClick={() => { const order = [...orderList]; [order[index - 1], order[index]] = [order[index], order[index - 1]]; updateConfig({ mobile: { ...config.mobile, sectionOrder: order } }); }} className="text-xs text-champagne disabled:opacity-30">↑</button>
                      <button type="button" disabled={index === orderList.length - 1} onClick={() => { const order = [...orderList]; [order[index], order[index + 1]] = [order[index + 1], order[index]]; updateConfig({ mobile: { ...config.mobile, sectionOrder: order } }); }} className="text-xs text-champagne disabled:opacity-30">↓</button>
                    </div>
                  );
                })}
                <button type="button" onClick={() => updateConfig({ mobile: { ...config.mobile, sectionOrder: null } })} className="text-xs text-muted underline">إعادة تعيين</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[#ece8e1]">
        <div className="flex items-center justify-between border-b border-champagne/10 bg-white px-4 py-3">
          <p className="text-sm font-medium">معاينة مباشرة</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreviewMobile(false)} className={`rounded-full px-3 py-1 text-xs ${!previewMobile ? "bg-foreground text-ivory" : "bg-beige"}`}>Desktop</button>
            <button type="button" onClick={() => setPreviewMobile(true)} className={`rounded-full px-3 py-1 text-xs ${previewMobile ? "bg-foreground text-ivory" : "bg-beige"}`}>Mobile</button>
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-champagne/30 px-3 py-1 text-xs hover:bg-beige">فتح المتجر ↗</a>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className={`mx-auto overflow-hidden rounded-2xl border border-champagne/20 bg-ivory shadow-2xl transition-all ${previewMobile ? "max-w-[390px]" : "max-w-5xl"}`}>
            <ConfigurableHomePage config={config} products={products} testimonials={testimonials} preview previewMobile={previewMobile} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm" />
    </label>
  );
}
