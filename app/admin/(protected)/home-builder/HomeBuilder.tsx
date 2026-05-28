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
  type HomeSection,
  type HomeSectionType,
} from "@/lib/home-builder/types";
import type { FeaturedProductCard } from "@/lib/storefront";
import { resolveHomepageFeaturedProducts } from "@/lib/storefront/homepage-featured-products";
import HomeFlowEditor, { type HomeFlowEditorTab } from "./HomeFlowEditor";
import HomeSectionEditor from "./HomeSectionEditor";
import { Field } from "./HomeBuilderFields";

type Tab = HomeFlowEditorTab;
type TestimonialsData = {
  label: string;
  title: string;
  subtitle: string;
  items: {
    name: string;
    location: string;
    product: string;
    rating: number;
    text: string;
    image: string;
  }[];
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
  const [tab, setTab] = useState<Tab>("sections");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialConfig.sections.find((section) => section.type === "hero")?.id ??
      initialConfig.sections[0]?.id ??
      null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewMobile, setPreviewMobile] = useState(false);

  const heroSection = useMemo(
    () => config.sections.find((section) => section.type === "hero"),
    [config.sections],
  );
  const selectedSection =
    config.sections.find((section) => section.id === selectedSectionId) ?? null;
  const previewProducts = useMemo(
    () => resolveHomepageFeaturedProducts(config, products),
    [config, products],
  );

  const updateConfig = useCallback((patch: Partial<HomePageConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }, []);

  const updateSection = (updated: HomeSection) => {
    updateConfig({
      sections: config.sections.map((section) =>
        section.id === updated.id ? updated : section,
      ),
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
    const payload: HomePageConfig = {
      ...config,
      slug: "home",
      customized: true,
    };
    const { error } = await supabase.from("home_page_configs").upsert(
      { slug: "home", config: payload },
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

    try {
      await fetch("/api/revalidate/home", { method: "POST" });
    } catch (revalidateError) {
      console.warn("Homepage revalidation failed:", revalidateError);
    }

    setConfig(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const applyLayoutChange = (sections: HomeSection[]) => {
    updateConfig({
      sections: normalizeHomeSectionOrders(sections),
      mobile: { ...config.mobile, sectionOrder: null },
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "sections", label: "الأقسام" },
    { id: "hero", label: "Hero" },
    { id: "navbar", label: "Navbar" },
    { id: "theme", label: "التصميم" },
    { id: "mobile", label: "الجوال" },
  ];

  const editorSection =
    tab === "hero"
      ? heroSection
      : tab === "sections"
        ? selectedSection
        : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col xl:flex-row">
      <div className="flex w-full flex-col border-l border-champagne/10 bg-white xl:w-[min(520px,42vw)] xl:shrink-0">
        <div className="flex items-center justify-between border-b border-champagne/10 p-4">
          <div>
            <p className="text-xs text-champagne">HOME BUILDER</p>
            <h2 className="font-serif text-lg font-semibold">محرر الصفحة الرئيسية</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              تحكم كامل — أقسام، صور، نصوص، ترتيب، ومعاينة مباشرة
            </p>
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
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs ${
                tab === item.id
                  ? "bg-champagne/20 text-foreground"
                  : "text-muted hover:bg-beige"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "sections" && (
            <div className="space-y-4">
              <HomeFlowEditor
                config={config}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onOpenTab={setTab}
                onLayoutChange={applyLayoutChange}
                onToggleSection={(sectionId) =>
                  updateConfig({
                    sections: config.sections.map((section) =>
                      section.id === sectionId
                        ? { ...section, enabled: !section.enabled }
                        : section,
                    ),
                  })
                }
                onDuplicateSection={(sectionId) => {
                  const section = config.sections.find((item) => item.id === sectionId);
                  if (!section) return;
                  const duplicate = duplicateHomeSection(section);
                  updateConfig({
                    sections: normalizeHomeSectionOrders([
                      ...config.sections,
                      duplicate,
                    ]),
                  });
                  setSelectedSectionId(duplicate.id);
                }}
                onDeleteSection={(sectionId) => {
                  updateConfig({
                    sections: config.sections.filter(
                      (section) => section.id !== sectionId,
                    ),
                  });
                  if (selectedSectionId === sectionId) {
                    setSelectedSectionId(null);
                  }
                }}
              />

              <select
                className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                defaultValue=""
                onChange={(event) => {
                  if (!event.target.value) return;
                  const section = createBlankHomeSection(
                    event.target.value as HomeSectionType,
                  );
                  updateConfig({
                    sections: normalizeHomeSectionOrders([
                      ...config.sections,
                      section,
                    ]),
                  });
                  setSelectedSectionId(section.id);
                  event.target.value = "";
                }}
              >
                <option value="">+ إضافة قسم</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {HOME_SECTION_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tab === "hero" && heroSection && (
            <HomeSectionEditor
              section={heroSection}
              onChange={updateSection}
              catalogProducts={products}
            />
          )}

          {tab === "navbar" && (
            <div className="space-y-3">
              <Field
                label="اسم العلامة"
                value={config.navbar.brandName}
                onChange={(value) =>
                  updateConfig({ navbar: { ...config.navbar, brandName: value } })
                }
              />
              <Field
                label="زر CTA"
                value={config.navbar.ctaLabel}
                onChange={(value) =>
                  updateConfig({ navbar: { ...config.navbar, ctaLabel: value } })
                }
              />
              <Field
                label="رابط CTA"
                value={config.navbar.ctaHref}
                onChange={(value) =>
                  updateConfig({ navbar: { ...config.navbar, ctaHref: value } })
                }
              />
              {config.navbar.links.map((link, index) => (
                <div
                  key={`${link.href}-${index}`}
                  className="grid grid-cols-2 gap-2 rounded-xl bg-beige/30 p-3"
                >
                  <input
                    value={link.label}
                    onChange={(event) => {
                      const links = [...config.navbar.links];
                      links[index] = { ...link, label: event.target.value };
                      updateConfig({ navbar: { ...config.navbar, links } });
                    }}
                    className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    placeholder="Label"
                  />
                  <input
                    value={link.href}
                    onChange={(event) => {
                      const links = [...config.navbar.links];
                      links[index] = { ...link, href: event.target.value };
                      updateConfig({ navbar: { ...config.navbar, links } });
                    }}
                    className="rounded-lg border border-champagne/20 px-3 py-2 text-sm"
                    placeholder="Href"
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "theme" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">Accent color</span>
                <input
                  type="color"
                  value={config.theme.accentColor}
                  onChange={(event) =>
                    updateConfig({
                      theme: { ...config.theme, accentColor: event.target.value },
                    })
                  }
                  className="h-10 w-full rounded-xl"
                />
              </label>
              {(
                [
                  ["buttonStyle", "شكل الزر", ["rounded-full", "rounded-xl"]],
                  ["heroGradient", "Hero", ["luxury", "soft", "minimal"]],
                  ["sectionSpacing", "المسافات", ["compact", "normal", "spacious"]],
                  ["sectionBackground", "الخلفية", ["ivory", "beige", "white"]],
                ] as const
              ).map(([key, label, options]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-xs text-muted">{label}</span>
                  <select
                    value={config.theme[key]}
                    onChange={(event) =>
                      updateConfig({
                        theme: { ...config.theme, [key]: event.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
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
                <span className="mb-1 block text-xs text-muted">
                  مقياس المسافات ({config.mobile.spacingScale})
                </span>
                <input
                  type="range"
                  min="0.85"
                  max="1.15"
                  step="0.05"
                  value={config.mobile.spacingScale}
                  onChange={(event) =>
                    updateConfig({
                      mobile: {
                        ...config.mobile,
                        spacingScale: Number(event.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted">
                  حجم الخط ({config.mobile.fontScale})
                </span>
                <input
                  type="range"
                  min="0.9"
                  max="1.1"
                  step="0.05"
                  value={config.mobile.fontScale}
                  onChange={(event) =>
                    updateConfig({
                      mobile: {
                        ...config.mobile,
                        fontScale: Number(event.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
              </label>
              <div>
                <p className="mb-2 text-xs text-muted">ترتيب الأقسام على الجوال</p>
                {(
                  config.mobile.sectionOrder ??
                  config.sections
                    .filter((section) => section.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((section) => section.id)
                ).map((sectionId, index, orderList) => {
                  const section = config.sections.find((item) => item.id === sectionId);
                  if (!section) return null;
                  return (
                    <div
                      key={sectionId}
                      className="mb-2 flex items-center gap-2 rounded-xl border border-champagne/10 bg-beige/30 p-2"
                    >
                      <span className="flex-1 text-right text-xs">
                        {HOME_SECTION_LABELS[section.type]}
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
                <button
                  type="button"
                  onClick={() =>
                    updateConfig({
                      mobile: { ...config.mobile, sectionOrder: null },
                    })
                  }
                  className="text-xs text-muted underline"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          )}

          {tab === "sections" && editorSection && editorSection.type !== "hero" && (
            <div className="mt-6 rounded-2xl border border-champagne/10 bg-beige/20 p-4">
              <p className="mb-3 text-xs font-semibold text-champagne">
                {HOME_SECTION_LABELS[editorSection.type]}
              </p>
              <HomeSectionEditor
                section={editorSection}
                onChange={updateSection}
                catalogProducts={products}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[#ece8e1]">
        <div className="flex items-center justify-between border-b border-champagne/10 bg-white px-4 py-3">
          <p className="text-sm font-medium">معاينة مباشرة</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewMobile(false)}
              className={`rounded-full px-3 py-1 text-xs ${
                !previewMobile ? "bg-foreground text-ivory" : "bg-beige"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMobile(true)}
              className={`rounded-full px-3 py-1 text-xs ${
                previewMobile ? "bg-foreground text-ivory" : "bg-beige"
              }`}
            >
              Mobile
            </button>
            <a
              href="/"
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
            <ConfigurableHomePage
              config={config}
              products={previewProducts}
              testimonials={testimonials}
              preview
              previewMobile={previewMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
