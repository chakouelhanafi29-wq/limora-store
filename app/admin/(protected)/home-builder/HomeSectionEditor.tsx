"use client";

import type { HomeSection, HomeSectionType } from "@/lib/home-builder/types";

type Props = {
  section: HomeSection;
  onChange: (section: HomeSection) => void;
  onUploadImage: (file: File, field: string) => void;
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const className = "w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={className} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      )}
    </label>
  );
}

function ItemsEditor({
  items,
  fields,
  onChange,
}: {
  items: Record<string, string>[];
  fields: string[];
  onChange: (items: Record<string, string>[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-beige/40 p-3 space-y-2">
          {fields.map((field) => (
            <input
              key={field}
              value={item[field] ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, [field]: e.target.value };
                onChange(next);
              }}
              placeholder={field}
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HomeSectionEditor({ section, onChange, onUploadImage }: Props) {
  const content = section.content as Record<string, unknown>;

  const updateContent = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...content, [key]: value } });
  };

  return (
    <div className="space-y-4">
      {section.type !== "announcement_bar" && section.type !== "footer" && (
        <>
          <Field label="Label (EN)" value={String(content.label ?? "")} onChange={(v) => updateContent("label", v)} />
          <Field label="العنوان" value={String(content.title ?? content.headline ?? "")} onChange={(v) => updateContent(section.type === "hero" ? "headline" : "title", v)} />
          {"subtitle" in content || section.type !== "hero" ? (
            <Field label="الوصف" value={String(content.subtitle ?? content.subheadline ?? "")} onChange={(v) => updateContent(section.type === "hero" ? "subheadline" : "subtitle", v)} multiline />
          ) : null}
        </>
      )}

      {section.type === "announcement_bar" && (
        <Field
          label="رسائل الشريط (سطر لكل رسالة)"
          value={((content.messages as string[]) ?? []).join("\n")}
          onChange={(v) => updateContent("messages", v.split("\n").filter(Boolean))}
          multiline
        />
      )}

      {section.type === "hero" && (
        <>
          <Field label="Headline accent" value={String(content.headlineAccent ?? "")} onChange={(v) => updateContent("headlineAccent", v)} />
          <Field label="Trust line" value={String(content.trustLine ?? "")} onChange={(v) => updateContent("trustLine", v)} />
          <Field label="CTA Primary" value={String(content.ctaPrimary ?? "")} onChange={(v) => updateContent("ctaPrimary", v)} />
          <Field label="CTA Secondary" value={String(content.ctaSecondary ?? "")} onChange={(v) => updateContent("ctaSecondary", v)} />
          <Field label="Hero image URL" value={String(content.image ?? "")} onChange={(v) => updateContent("image", v)} />
          <label className="inline-block cursor-pointer rounded-full border border-champagne/30 px-4 py-2 text-xs hover:bg-beige">
            + رفع صورة Hero
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadImage(f, "image"); }} />
          </label>
        </>
      )}

      {section.type === "before_after" && (
        <ItemsEditor
          items={(content.transformations as Record<string, string>[]) ?? []}
          fields={["title", "description", "image", "stat", "statLabel"]}
          onChange={(items) => updateContent("transformations", items)}
        />
      )}

      {section.type === "benefits" && (
        <ItemsEditor
          items={(content.pillars as Record<string, string>[]) ?? []}
          fields={["icon", "title", "description"]}
          onChange={(items) => updateContent("pillars", items)}
        />
      )}

      {section.type === "faq" && (
        <ItemsEditor
          items={(content.items as Record<string, string>[]) ?? []}
          fields={["question", "answer"]}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "reviews" && (
        <ItemsEditor
          items={(content.items as Record<string, string>[]) ?? []}
          fields={["name", "location", "product", "text", "image"]}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "brand_story" && (
        <>
          <Field label="Image URL" value={String(content.image ?? "")} onChange={(v) => updateContent("image", v)} />
          <Field label="Paragraphs (one per line)" value={((content.paragraphs as string[]) ?? []).join("\n")} onChange={(v) => updateContent("paragraphs", v.split("\n").filter(Boolean))} multiline />
          <ItemsEditor items={(content.values as Record<string, string>[]) ?? []} fields={["icon", "label"]} onChange={(items) => updateContent("values", items)} />
        </>
      )}

      {section.type === "promo_banner" && (
        <>
          <Field label="CTA Label" value={String(content.ctaLabel ?? "")} onChange={(v) => updateContent("ctaLabel", v)} />
          <Field label="CTA Link" value={String(content.ctaHref ?? "")} onChange={(v) => updateContent("ctaHref", v)} />
          <Field label="Background" value={String(content.backgroundColor ?? "")} onChange={(v) => updateContent("backgroundColor", v)} />
        </>
      )}

      {section.type === "countdown_banner" && (
        <>
          <Field label="Message" value={String(content.message ?? "")} onChange={(v) => updateContent("message", v)} />
          <Field label="End date text" value={String(content.endDate ?? "")} onChange={(v) => updateContent("endDate", v)} />
        </>
      )}

      {section.type === "footer" && (
        <>
          <Field label="Brand name" value={String(content.brandName ?? "")} onChange={(v) => updateContent("brandName", v)} />
          <Field label="Tagline" value={String(content.tagline ?? "")} onChange={(v) => updateContent("tagline", v)} multiline />
          <Field label="Location" value={String(content.location ?? "")} onChange={(v) => updateContent("location", v)} />
          <ItemsEditor items={(content.quickLinks as Record<string, string>[]) ?? []} fields={["label", "href"]} onChange={(items) => updateContent("quickLinks", items)} />
        </>
      )}
    </div>
  );
}

export { createBlankHomeSection } from "@/lib/home-builder/default-config";
