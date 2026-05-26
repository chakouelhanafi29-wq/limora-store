"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  duplicateSection,
  normalizeSectionOrders,
} from "@/lib/page-builder/default-config";
import type { ProductPageConfig, SectionType } from "@/lib/page-builder/types";
import { SECTION_LABELS } from "@/lib/page-builder/types";
import ProductPageClient from "@/app/product/ProductPageClient";
import SectionEditor, { createBlankSection } from "./SectionEditor";

type Tab = "hero" | "offers" | "sections" | "theme" | "mobile" | "popup";

const SECTION_TYPES = Object.keys(SECTION_LABELS) as SectionType[];

export default function ProductBuilder({
  initialConfig,
  slug,
  productId,
  productName,
}: {
  initialConfig: ProductPageConfig;
  slug: string;
  productId?: string;
  productName?: string;
}) {
  const [config, setConfig] = useState<ProductPageConfig>(initialConfig);
  const [tab, setTab] = useState<Tab>("hero");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    config.sections[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [previewMobile, setPreviewMobile] = useState(false);

  const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

  const updateConfig = useCallback((patch: Partial<ProductPageConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }, []);

  const save = async () => {
    if (!isSupabaseConfigured()) {
      alert("Supabase غير مُفعّل");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;

    setSaving(true);
    const row: Record<string, unknown> = {
      slug,
      config: { ...config, slug },
    };
    if (productId) {
      row.product_id = productId;
    }
    const { error } = await supabase.from("product_page_configs").upsert(row, {
      onConflict: "slug",
    });
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadHeroImage = async (file: File) => {
    const supabase = createClient();
    if (!supabase) return;
    const path = `builder/${slug}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (error) {
      alert(error.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);
    updateConfig({
      hero: { ...config.hero, images: [...config.hero.images, publicUrl] },
    });
  };

  const reorderSections = (fromId: string, toId: string) => {
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const fromIndex = sorted.findIndex((s) => s.id === fromId);
    const toIndex = sorted.findIndex((s) => s.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = sorted.splice(fromIndex, 1);
    sorted.splice(toIndex, 0, moved);
    updateConfig({ sections: normalizeSectionOrders(sorted) });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "Hero" },
    { id: "offers", label: "العروض" },
    { id: "sections", label: "الأقسام" },
    { id: "theme", label: "التصميم" },
    { id: "mobile", label: "الجوال" },
    { id: "popup", label: "نافذة الطلب" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Editor panel */}
      <div className="flex w-full flex-col border-l border-champagne/10 bg-white lg:w-[420px] lg:shrink-0">
        <div className="flex items-center justify-between border-b border-champagne/10 p-4">
          <div>
            <Link
              href="/admin/products"
              className="mb-1 inline-block text-xs text-muted hover:text-champagne"
            >
              ← المنتجات
            </Link>
            <p className="text-xs text-champagne">PRODUCT BUILDER · {slug}</p>
            <h2 className="font-serif text-lg font-semibold">
              {productName ?? "محرر صفحة المنتج"}
            </h2>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-foreground px-5 py-2 text-xs text-ivory hover:bg-champagne disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : saved ? "تم ✓" : "حفظ"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-champagne/10 p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                tab === t.id
                  ? "bg-champagne/20 text-foreground"
                  : "text-muted hover:bg-beige"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "hero" && (
            <div className="space-y-3">
              {(
                [
                  ["nameAr", "الاسم (AR)"],
                  ["nameEn", "الاسم (EN)"],
                  ["subtitle", "العنوان الفرعي"],
                  ["urgency", "رسالة الإلحاح"],
                  ["ctaLabel", "نص زر الطلب"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs text-muted">{label}</span>
                  <input
                    value={config.hero[key]}
                    onChange={(e) =>
                      updateConfig({
                        hero: { ...config.hero, [key]: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-xs text-muted">النقاط (سطر لكل نقطة)</span>
                <textarea
                  value={config.hero.bullets.join("\n")}
                  onChange={(e) =>
                    updateConfig({
                      hero: {
                        ...config.hero,
                        bullets: e.target.value.split("\n").filter(Boolean),
                      },
                    })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted">Trust badges</span>
                <textarea
                  value={config.hero.codTrust.join("\n")}
                  onChange={(e) =>
                    updateConfig({
                      hero: {
                        ...config.hero,
                        codTrust: e.target.value.split("\n").filter(Boolean),
                      },
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                />
              </label>
              <div>
                <p className="mb-2 text-xs text-muted">معرض الصور</p>
                <div className="flex flex-wrap gap-2">
                  {config.hero.images.map((url, i) => (
                    <div key={url} className="relative">
                      <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({
                            hero: {
                              ...config.hero,
                              images: config.hero.images.filter((_, idx) => idx !== i),
                            },
                          })
                        }
                        className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <label className="mt-2 inline-block cursor-pointer rounded-full border border-champagne/30 px-4 py-2 text-xs hover:bg-beige">
                  + رفع صورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadHeroImage(file);
                    }}
                  />
                </label>
              </div>
              <div className="border-t border-champagne/10 pt-4">
                <p className="mb-2 text-xs font-medium text-muted">شريط الإعلان العلوي</p>
                <label className="mb-2 flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={config.stickyBar.enabled}
                    onChange={(e) =>
                      updateConfig({
                        stickyBar: {
                          ...config.stickyBar,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                  تفعيل الشريط
                </label>
                <textarea
                  value={config.stickyBar.messages.join("\n")}
                  onChange={(e) =>
                    updateConfig({
                      stickyBar: {
                        ...config.stickyBar,
                        messages: e.target.value.split("\n").filter(Boolean),
                      },
                    })
                  }
                  rows={3}
                  placeholder="رسالة لكل سطر"
                  className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {tab === "offers" && (
            <div className="space-y-4">
              {config.offers.map((offer, i) => (
                <div key={offer.id} className="rounded-xl border border-champagne/10 p-4">
                  <div className="grid gap-2">
                    <input
                      placeholder="التسمية"
                      value={offer.label}
                      onChange={(e) => {
                        const offers = [...config.offers];
                        offers[i] = { ...offer, label: e.target.value };
                        updateConfig({ offers });
                      }}
                      className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="التسمية المعروضة"
                      value={offer.displayLabel}
                      onChange={(e) => {
                        const offers = [...config.offers];
                        offers[i] = { ...offer, displayLabel: e.target.value };
                        updateConfig({ offers });
                      }}
                      className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="السعر"
                      type="number"
                      value={offer.price}
                      onChange={(e) => {
                        const offers = [...config.offers];
                        offers[i] = { ...offer, price: Number(e.target.value) };
                        updateConfig({ offers });
                      }}
                      className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Badge"
                      value={offer.badge ?? ""}
                      onChange={(e) => {
                        const offers = [...config.offers];
                        offers[i] = {
                          ...offer,
                          badge: e.target.value || null,
                        };
                        updateConfig({ offers });
                      }}
                      className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="نص التوفير"
                      value={offer.savingsText ?? ""}
                      onChange={(e) => {
                        const offers = [...config.offers];
                        offers[i] = {
                          ...offer,
                          savingsText: e.target.value || null,
                        };
                        updateConfig({ offers });
                      }}
                      className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    />
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={offer.recommended}
                        onChange={(e) => {
                          const offers = config.offers.map((o, idx) => ({
                            ...o,
                            recommended: idx === i ? e.target.checked : false,
                          }));
                          updateConfig({ offers });
                        }}
                      />
                      العرض الموصى به
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "sections" && (
            <div className="space-y-4">
              <div className="space-y-2">
                {[...config.sections]
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => setDragId(section.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragId) reorderSections(dragId, section.id);
                        setDragId(null);
                      }}
                      className={`flex items-center gap-2 rounded-xl border p-3 ${
                        selectedSectionId === section.id
                          ? "border-champagne bg-champagne/10"
                          : "border-champagne/10"
                      }`}
                    >
                      <span className="cursor-grab text-muted">⋮⋮</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSectionId(section.id)}
                        className="flex-1 text-right text-sm"
                      >
                        {SECTION_LABELS[section.type]}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({
                            sections: config.sections.map((s) =>
                              s.id === section.id
                                ? { ...s, enabled: !s.enabled }
                                : s,
                            ),
                          })
                        }
                        className={`text-xs ${section.enabled ? "text-emerald-600" : "text-muted"}`}
                      >
                        {section.enabled ? "ON" : "OFF"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig({
                            sections: normalizeSectionOrders([
                              ...config.sections,
                              duplicateSection(section),
                            ]),
                          })
                        }
                        className="text-xs text-champagne"
                      >
                        نسخ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateConfig({
                            sections: config.sections.filter(
                              (s) => s.id !== section.id,
                            ),
                          });
                          if (selectedSectionId === section.id) {
                            setSelectedSectionId(null);
                          }
                        }}
                        className="text-xs text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>

              <select
                className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  const section = createBlankSection(
                    e.target.value as SectionType,
                  );
                  updateConfig({
                    sections: normalizeSectionOrders([
                      ...config.sections,
                      section,
                    ]),
                  });
                  setSelectedSectionId(section.id);
                  e.target.value = "";
                }}
              >
                <option value="">+ إضافة قسم</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {SECTION_LABELS[type]}
                  </option>
                ))}
              </select>

              {selectedSection && (
                <div className="rounded-xl border border-champagne/10 bg-beige/20 p-4">
                  <SectionEditor
                    section={selectedSection}
                    onChange={(updated) =>
                      updateConfig({
                        sections: config.sections.map((s) =>
                          s.id === updated.id ? updated : s,
                        ),
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}

          {tab === "theme" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">لون Accent</span>
                <input
                  type="color"
                  value={config.theme.accentColor}
                  onChange={(e) =>
                    updateConfig({
                      theme: { ...config.theme, accentColor: e.target.value },
                    })
                  }
                  className="h-10 w-full rounded-xl"
                />
              </label>
              {(
                [
                  ["buttonStyle", "شكل الزر", ["rounded-full", "rounded-xl"]],
                  ["heroGradient", "Hero gradient", ["luxury", "soft", "minimal", "pink"]],
                  ["sectionSpacing", "المسافات", ["compact", "normal", "spacious"]],
                  ["sectionBackground", "خلفية", ["ivory", "beige", "white"]],
                ] as const
              ).map(([key, label, options]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs text-muted">{label}</span>
                  <select
                    value={config.theme[key]}
                    onChange={(e) =>
                      updateConfig({
                        theme: {
                          ...config.theme,
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}

          {tab === "mobile" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">حجم زر CTA</span>
                <select
                  value={config.mobile.ctaSize}
                  onChange={(e) =>
                    updateConfig({
                      mobile: {
                        ...config.mobile,
                        ctaSize: e.target.value as "sm" | "md" | "lg",
                      },
                    })
                  }
                  className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted">نسبة الصورة</span>
                <select
                  value={config.mobile.imageAspect}
                  onChange={(e) =>
                    updateConfig({
                      mobile: {
                        ...config.mobile,
                        imageAspect: e.target.value as "square" | "portrait",
                      },
                    })
                  }
                  className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                >
                  <option value="square">مربع</option>
                  <option value="portrait">Portrait</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted">
                  مقياس المسافات ({config.mobile.spacingScale})
                </span>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={config.mobile.spacingScale}
                  onChange={(e) =>
                    updateConfig({
                      mobile: {
                        ...config.mobile,
                        spacingScale: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
              </label>
              <div>
                <p className="mb-2 text-xs text-muted">ترتيب الأقسام على الجوال</p>
                <p className="mb-3 text-[11px] text-muted/80">
                  اسحبي لإعادة الترتيب. اتركي فارغاً لاستخدام ترتيب سطح المكتب.
                </p>
                <div className="space-y-2">
                  {(config.mobile.sectionOrder ??
                    config.sections
                      .filter((s) => s.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((s) => s.id)).map((sectionId, index, orderList) => {
                    const section = config.sections.find((s) => s.id === sectionId);
                    if (!section) return null;
                    return (
                      <div
                        key={sectionId}
                        className="flex items-center gap-2 rounded-xl border border-champagne/10 bg-beige/30 p-2"
                      >
                        <span className="text-xs text-muted">{index + 1}</span>
                        <span className="flex-1 text-right text-xs">
                          {SECTION_LABELS[section.type]}
                        </span>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const order = [...orderList];
                            [order[index - 1], order[index]] = [
                              order[index],
                              order[index - 1],
                            ];
                            updateConfig({
                              mobile: { ...config.mobile, sectionOrder: order },
                            });
                          }}
                          className="text-xs text-champagne disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === orderList.length - 1}
                          onClick={() => {
                            const order = [...orderList];
                            [order[index], order[index + 1]] = [
                              order[index + 1],
                              order[index],
                            ];
                            updateConfig({
                              mobile: { ...config.mobile, sectionOrder: order },
                            });
                          }}
                          className="text-xs text-champagne disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateConfig({
                      mobile: { ...config.mobile, sectionOrder: null },
                    })
                  }
                  className="mt-2 text-xs text-muted underline"
                >
                  إعادة تعيين الترتيب
                </button>
              </div>
            </div>
          )}

          {tab === "popup" && (
            <div className="space-y-3">
              {(
                [
                  ["title", "عنوان النافذة"],
                  ["subtitle", "الوصف"],
                  ["submitLabel", "زر التأكيد"],
                  ["trustLine", "سطر الثقة"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs text-muted">{label}</span>
                  <input
                    value={config.orderModal[key]}
                    onChange={(e) =>
                      updateConfig({
                        orderModal: {
                          ...config.orderModal,
                          [key]: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="flex flex-1 flex-col bg-[#ece8e1]">
        <div className="flex items-center justify-between border-b border-champagne/10 bg-white px-4 py-3">
          <p className="text-sm font-medium">معاينة مباشرة</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewMobile(false)}
              className={`rounded-full px-3 py-1 text-xs ${!previewMobile ? "bg-foreground text-ivory" : "bg-beige"}`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMobile(true)}
              className={`rounded-full px-3 py-1 text-xs ${previewMobile ? "bg-foreground text-ivory" : "bg-beige"}`}
            >
              Mobile
            </button>
            <a
              href={`/product/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-champagne/30 px-3 py-1 text-xs hover:bg-beige"
            >
              فتح المتجر ↗
            </a>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div
            className={`mx-auto overflow-hidden rounded-2xl border border-champagne/20 bg-ivory shadow-2xl transition-all ${
              previewMobile ? "max-w-[390px]" : "max-w-5xl"
            }`}
          >
            <ProductPageClient pageConfig={config} preview />
          </div>
        </div>
      </div>
    </div>
  );
}
