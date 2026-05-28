"use client";

import { createClient } from "@/lib/supabase/client";
import { uploadBuilderImage } from "@/lib/page-builder/upload-image";
import type { PageSection, SectionType } from "@/lib/page-builder/types";
import { normalizeQualityTrustItems, type QualityTrustItem } from "@/lib/page-builder/quality-trust-content";

type Props = {
  section: PageSection;
  slug: string;
  onChange: (section: PageSection) => void;
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const className =
    "w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function ListControls({
  onAdd,
  addLabel,
}: {
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="rounded-full border border-champagne/30 px-3 py-1.5 text-xs text-champagne hover:bg-beige"
    >
      + {addLabel}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-red-500 hover:underline"
    >
      حذف
    </button>
  );
}

function ImageUploadField({
  label,
  value,
  slug,
  onChange,
}: {
  label: string;
  value: string;
  slug: string;
  onChange: (url: string) => void;
}) {
  const upload = async (file: File) => {
    const supabase = createClient();
    if (!supabase) return;
    const url = await uploadBuilderImage(supabase, slug, file, "builder/sections");
    if (url) onChange(url);
  };

  return (
    <div className="space-y-2 rounded-xl border border-champagne/10 bg-white/60 p-3">
      <span className="block text-xs font-medium text-muted">{label}</span>
      {value ? (
        <div className="space-y-2">
          <img
            src={value}
            alt=""
            className="h-28 w-full max-w-[220px] rounded-xl object-cover shadow-sm"
          />
          <div className="flex flex-wrap gap-2">
            <label className="inline-block cursor-pointer rounded-full border border-champagne/30 px-3 py-1.5 text-xs hover:bg-beige">
              استبدال
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
            >
              إزالة الصورة
            </button>
          </div>
        </div>
      ) : (
        <label className="inline-block cursor-pointer rounded-full border border-champagne/30 px-3 py-1.5 text-xs hover:bg-beige">
          + رفع صورة
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
      )}
      <Field label="رابط الصورة (اختياري)" value={value} onChange={onChange} />
    </div>
  );
}

export default function SectionEditor({ section, slug, onChange }: Props) {
  const content = section.content as Record<string, unknown>;

  const updateContent = (key: string, value: unknown) => {
    onChange({
      ...section,
      content: { ...content, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <Field
        label="Label (EN)"
        value={String(content.label ?? "")}
        onChange={(v) => updateContent("label", v)}
      />
      <Field
        label="العنوان"
        value={String(content.title ?? "")}
        onChange={(v) => updateContent("title", v)}
      />
      {"subtitle" in content || section.type !== "faq" ? (
        <Field
          label="الوصف / Subtitle"
          value={String(content.subtitle ?? "")}
          onChange={(v) => updateContent("subtitle", v)}
          multiline
        />
      ) : null}

      {(section.type === "reviews" || section.type === "guarantee") && (
        <>
          <Field
            label="نص CTA بين الأقسام"
            value={String(content.ctaSubtitle ?? "")}
            onChange={(v) => updateContent("ctaSubtitle", v)}
            multiline
          />
          <Field
            label="سطر الثقة تحت CTA"
            value={String(content.ctaFootnote ?? "")}
            onChange={(v) => updateContent("ctaFootnote", v)}
          />
        </>
      )}

      {section.type === "lifestyle" && (
        <>
          <Field
            label="النص العاطفي"
            value={String(content.body ?? "")}
            onChange={(v) => updateContent("body", v)}
            multiline
          />
          <ImageUploadField
            label="صورة Lifestyle"
            value={String(content.image ?? "")}
            slug={slug}
            onChange={(v) => updateContent("image", v)}
          />
          <label className="block">
            <span className="mb-1 block text-xs text-muted">موضع الصورة</span>
            <select
              value={String(content.imagePosition ?? "right")}
              onChange={(e) => updateContent("imagePosition", e.target.value)}
              className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
            >
              <option value="right">يمين</option>
              <option value="left">يسار</option>
            </select>
          </label>
        </>
      )}

      {section.type === "faq" && (
        <FAQEditor
          items={(content.items as { question: string; answer: string }[]) ?? []}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "benefits" && (
        <BenefitsEditor
          slug={slug}
          items={
            (content.items as {
              icon: string;
              title: string;
              description: string;
              image?: string;
            }[]) ?? []
          }
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "reviews" && (
        <ReviewItemsEditor
          slug={slug}
          items={
            (content.items as {
              name: string;
              location: string;
              text: string;
              image: string;
              rating?: number;
            }[]) ?? []
          }
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "transformation" && (
        <BeforeAfterEditor
          slug={slug}
          items={
            (content.beforeAfter as {
              before: string;
              after: string;
              quote: string;
              days: string;
            }[]) ?? []
          }
          onChange={(items) => updateContent("beforeAfter", items)}
        />
      )}

      {section.type === "problem_solution" && (
        <>
          <ProblemsEditor
            slug={slug}
            items={
              (content.problems as {
                title: string;
                description: string;
                icon?: string;
                image?: string;
              }[]) ?? []
            }
            onChange={(items) => updateContent("problems", items)}
          />
          <p className="text-xs font-semibold text-muted">الحل</p>
          <Field
            label="عنوان الحل"
            value={String((content.solution as { title?: string })?.title ?? "")}
            onChange={(v) =>
              updateContent("solution", {
                ...(content.solution as object),
                title: v,
              })
            }
          />
          <Field
            label="وصف الحل"
            value={String((content.solution as { description?: string })?.description ?? "")}
            onChange={(v) =>
              updateContent("solution", {
                ...(content.solution as object),
                description: v,
              })
            }
            multiline
          />
          <Field
            label="نقاط الحل (سطر لكل نقطة)"
            value={
              ((content.solution as { highlights?: string[] })?.highlights ?? []).join(
                "\n",
              )
            }
            onChange={(v) =>
              updateContent("solution", {
                ...(content.solution as object),
                highlights: v.split("\n").filter(Boolean),
              })
            }
            multiline
          />
          <ImageUploadField
            label="صورة الحل / التحول"
            value={String((content.solution as { image?: string })?.image ?? "")}
            slug={slug}
            onChange={(v) =>
              updateContent("solution", {
                ...(content.solution as object),
                image: v,
              })
            }
          />
          <Field
            label="تعليق عاطفي (اختياري)"
            value={String((content.solution as { caption?: string })?.caption ?? "")}
            onChange={(v) =>
              updateContent("solution", {
                ...(content.solution as object),
                caption: v,
              })
            }
            multiline
          />
        </>
      )}

      {section.type === "results_timeline" && (
        <ResultsTimelineEditor
          slug={slug}
          weeks={
            (content.weeks as {
              title: string;
              description: string;
              progress?: number;
              image?: string;
            }[]) ?? []
          }
          onChange={(weeks) => updateContent("weeks", weeks)}
        />
      )}

      {section.type === "comparison" && (
        <ComparisonEditor
          rows={
            (content.rows as { feature: string; limora: boolean; others: boolean }[]) ??
            []
          }
          onChange={(rows) => updateContent("rows", rows)}
        />
      )}

      {section.type === "how_to_use" && (
        <ItemsEditor
          label="الخطوات"
          items={
            (content.steps as { step: string; title: string; description: string }[]) ??
            []
          }
          fields={[
            { key: "step", label: "رقم" },
            { key: "title", label: "العنوان" },
            { key: "description", label: "الوصف" },
          ]}
          onChange={(items) => updateContent("steps", items)}
          onAdd={() =>
            updateContent("steps", [
              ...((content.steps as object[]) ?? []),
              { step: "0", title: "خطوة", description: "" },
            ])
          }
        />
      )}

      {section.type === "ingredients" && (
        <IngredientEditor
          slug={slug}
          items={(content.items as { name: string; benefit: string; image: string }[]) ?? []}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "guarantee" && (
        <ItemsEditor
          label="نقاط الضمان"
          items={
            (content.points as { icon: string; title: string; description: string }[]) ??
            []
          }
          fields={[
            { key: "icon", label: "أيقونة" },
            { key: "title", label: "العنوان" },
            { key: "description", label: "الوصف" },
          ]}
          onChange={(items) => updateContent("points", items)}
          onAdd={() =>
            updateContent("points", [
              ...((content.points as object[]) ?? []),
              { icon: "✦", title: "نقطة", description: "" },
            ])
          }
        />
      )}

      {section.type === "quality_trust" && (
        <>
          <Field
            label="نص الطمأنينة العاطفي"
            value={String(content.reassurance ?? "")}
            onChange={(v) => updateContent("reassurance", v)}
            multiline
          />
          <QualityTrustCardsEditor
            slug={slug}
            items={normalizeQualityTrustItems(content)}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      )}

      {section.type === "related_products" && (
        <RelatedProductsEditor
          slug={slug}
          items={
            (content.items as {
              id: string;
              name: string;
              nameEn: string;
              benefit: string;
              price: string;
              image: string;
              href: string;
            }[]) ?? []
          }
          onChange={(items) => updateContent("items", items)}
        />
      )}
    </div>
  );
}

function ProblemsEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: { title: string; description: string; icon?: string; image?: string }[];
  onChange: (items: { title: string; description: string; icon?: string; image?: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">بطاقات المشاكل</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input
            value={item.icon ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, icon: e.target.value };
              onChange(next);
            }}
            placeholder="أيقونة (emoji)"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, title: e.target.value };
              onChange(next);
            }}
            placeholder="العنوان"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, description: e.target.value };
              onChange(next);
            }}
            placeholder="الوصف"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <ImageUploadField
            label="صورة المشكلة (بجانب النص)"
            value={item.image ?? ""}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="مشكلة"
        onAdd={() =>
          onChange([
            ...items,
            { icon: "✦", title: "مشكلة جديدة", description: "", image: "" },
          ])
        }
      />
    </div>
  );
}

function FAQEditor({
  items,
  onChange,
}: {
  items: { question: string; answer: string }[];
  onChange: (items: { question: string; answer: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">أسئلة FAQ</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            />
          </div>
          <input
            value={item.question}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, question: e.target.value };
              onChange(next);
            }}
            placeholder="السؤال"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.answer}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, answer: e.target.value };
              onChange(next);
            }}
            placeholder="الجواب"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
        </div>
      ))}
      <ListControls
        addLabel="سؤال"
        onAdd={() => onChange([...items, { question: "", answer: "" }])}
      />
    </div>
  );
}

function ItemsEditor({
  label,
  items,
  fields,
  onChange,
  onAdd,
}: {
  label: string;
  items: Record<string, string>[];
  fields: { key: string; label: string }[];
  onChange: (items: Record<string, string>[]) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            />
          </div>
          {fields.map((field) => (
            <input
              key={field.key}
              value={item[field.key] ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, [field.key]: e.target.value };
                onChange(next);
              }}
              placeholder={field.label}
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
          ))}
        </div>
      ))}
      <ListControls addLabel="عنصر" onAdd={onAdd} />
    </div>
  );
}

function BenefitsEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: { icon: string; title: string; description: string; image?: string }[];
  onChange: (items: { icon: string; title: string; description: string; image?: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">بطاقات الفوائد</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input
            value={item.icon}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, icon: e.target.value };
              onChange(next);
            }}
            placeholder="أيقونة"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, title: e.target.value };
              onChange(next);
            }}
            placeholder="العنوان"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, description: e.target.value };
              onChange(next);
            }}
            placeholder="الوصف"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <ImageUploadField
            label="صورة (اختياري)"
            value={item.image ?? ""}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="فائدة"
        onAdd={() =>
          onChange([...items, { icon: "✨", title: "فائدة جديدة", description: "" }])
        }
      />
    </div>
  );
}

function ReviewItemsEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: {
    name: string;
    location: string;
    text: string;
    image: string;
    rating?: number;
    transformationImage?: string;
  }[];
  onChange: (
    items: {
      name: string;
      location: string;
      text: string;
      image: string;
      rating?: number;
      transformationImage?: string;
    }[],
  ) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">التقييمات</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input
            value={item.name}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, name: e.target.value };
              onChange(next);
            }}
            placeholder="الاسم"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            value={item.location}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, location: e.target.value };
              onChange(next);
            }}
            placeholder="المدينة"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={item.rating ?? 5}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, rating: Number(e.target.value) };
              onChange(next);
            }}
            placeholder="التقييم"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.text}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, text: e.target.value };
              onChange(next);
            }}
            placeholder="التعليق"
            rows={3}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <ImageUploadField
            label="صورة العميلة (اختياري — بدون صورة يظهر Avatar بالحرف الأول)"
            value={item.image}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
          {!item.image?.trim() && item.name.trim() ? (
            <p className="text-[11px] text-muted">
              معاينة: Avatar تلقائي بالحرف «{item.name.trim().charAt(0)}»
            </p>
          ) : null}
          <ImageUploadField
            label="صورة التحول (اختياري)"
            value={item.transformationImage ?? ""}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, transformationImage: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="تقييم"
        onAdd={() =>
          onChange([
            ...items,
            { name: "", location: "", text: "", image: "", rating: 5, transformationImage: "" },
          ])
        }
      />
    </div>
  );
}

function BeforeAfterEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: {
    image?: string;
    before?: string;
    after?: string;
    title?: string;
    quote?: string;
    caption?: string;
    resultText?: string;
    days?: string;
  }[];
  onChange: (
    items: {
      image?: string;
      title?: string;
      caption?: string;
      resultText?: string;
    }[],
  ) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">قبل / بعد — صورة موحدة</p>
      <p className="text-[11px] leading-relaxed text-muted">
        ارفعي صورة واحدة تجمع قبل/بعد (يسار = قبل · يمين = بعد).
      </p>
      {items.map((item, i) => {
        const image =
          item.image?.trim() || item.after?.trim() || item.before?.trim() || "";
        const title = item.title?.trim() || "";
        const caption = item.quote?.trim() || item.caption?.trim() || "";
        const resultText = item.resultText?.trim() || item.days?.trim() || "";

        return (
          <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
            <div className="flex justify-end">
              <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </div>
            <ImageUploadField
              label="صورة التحول الموحدة (قبل / بعد)"
              value={image}
              slug={slug}
              onChange={(v) => {
                const next = [...items];
                next[i] = {
                  image: v,
                  title: next[i].title,
                  caption: next[i].caption ?? next[i].quote,
                  resultText: next[i].resultText ?? next[i].days,
                };
                onChange(next);
              }}
            />
            <input
              value={title}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], title: e.target.value };
                onChange(next);
              }}
              placeholder="عنوان اختياري"
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
            <textarea
              value={caption}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], caption: e.target.value, quote: e.target.value };
                onChange(next);
              }}
              placeholder="تعليق عاطفي (اختياري)"
              rows={2}
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
            <input
              value={resultText}
              onChange={(e) => {
                const next = [...items];
                next[i] = {
                  ...next[i],
                  resultText: e.target.value,
                  days: e.target.value,
                };
                onChange(next);
              }}
              placeholder="نص النتيجة (مثال: 21 يوم · نتيجة حقيقية)"
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
          </div>
        );
      })}
      <ListControls
        addLabel="تحول"
        onAdd={() =>
          onChange([
            ...items,
            {
              image: "",
              title: "",
              caption: "",
              resultText: "",
            },
          ])
        }
      />
    </div>
  );
}

function IngredientEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: { name: string; benefit: string; image: string; icon?: string }[];
  onChange: (items: { name: string; benefit: string; image: string; icon?: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">المكونات</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input
            value={item.icon ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, icon: e.target.value };
              onChange(next);
            }}
            placeholder="أيقونة (emoji)"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            value={item.name}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, name: e.target.value };
              onChange(next);
            }}
            placeholder="اسم المكون"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.benefit}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, benefit: e.target.value };
              onChange(next);
            }}
            placeholder="الفائدة"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <ImageUploadField
            label="صورة المكون (اختياري)"
            value={item.image}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="مكون"
        onAdd={() => onChange([...items, { name: "", benefit: "", image: "", icon: "✦" }])}
      />
    </div>
  );
}

function ResultsTimelineEditor({
  slug,
  weeks,
  onChange,
}: {
  slug: string;
  weeks: {
    title: string;
    description: string;
    progress?: number;
    image?: string;
  }[];
  onChange: (
    weeks: {
      title: string;
      description: string;
      progress?: number;
      image?: string;
    }[],
  ) => void;
}) {
  const moveWeek = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= weeks.length) return;
    const next = [...weeks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">خط زمني للنتائج</p>
      {weeks.map((week, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-champagne">الأسبوع {i + 1}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => moveWeek(i, -1)}
                className="text-xs text-champagne disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === weeks.length - 1}
                onClick={() => moveWeek(i, 1)}
                className="text-xs text-champagne disabled:opacity-30"
              >
                ↓
              </button>
              <RemoveButton onClick={() => onChange(weeks.filter((_, idx) => idx !== i))} />
            </div>
          </div>
          <input
            value={week.title}
            onChange={(e) => {
              const next = [...weeks];
              next[i] = { ...week, title: e.target.value };
              onChange(next);
            }}
            placeholder="عنوان الأسبوع"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={week.description}
            onChange={(e) => {
              const next = [...weeks];
              next[i] = { ...week, description: e.target.value };
              onChange(next);
            }}
            placeholder="وصف النتيجة"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <label className="block">
            <span className="mb-1 block text-xs text-muted">
              نسبة التقدم ({week.progress ?? 0}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={week.progress ?? 0}
              onChange={(e) => {
                const next = [...weeks];
                next[i] = { ...week, progress: Number(e.target.value) };
                onChange(next);
              }}
              className="w-full"
            />
          </label>
          <ImageUploadField
            label="صورة الأسبوع (اختياري)"
            value={week.image ?? ""}
            slug={slug}
            onChange={(v) => {
              const next = [...weeks];
              next[i] = { ...week, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="أسبوع"
        onAdd={() =>
          onChange([
            ...weeks,
            {
              title: `الأسبوع ${weeks.length + 1}`,
              description: "",
              progress: Math.min(100, (weeks.length + 1) * 25),
              image: "",
            },
          ])
        }
      />
    </div>
  );
}

function RelatedProductsEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: {
    id: string;
    name: string;
    nameEn: string;
    benefit: string;
    price: string;
    image: string;
    href: string;
  }[];
  onChange: (items: {
    id: string;
    name: string;
    nameEn: string;
    benefit: string;
    price: string;
    image: string;
    href: string;
  }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">منتجات ذات صلة</p>
      {items.map((item, i) => (
        <div key={item.id || i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          {(["name", "nameEn", "benefit", "price", "href"] as const).map((key) => (
            <input
              key={key}
              value={item[key]}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, [key]: e.target.value };
                onChange(next);
              }}
              placeholder={key}
              className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
            />
          ))}
          <ImageUploadField
            label="صورة المنتج"
            value={item.image}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="منتج"
        onAdd={() =>
          onChange([
            ...items,
            {
              id: `rel-${Date.now()}`,
              name: "",
              nameEn: "",
              benefit: "",
              price: "",
              image: "",
              href: "/product/",
            },
          ])
        }
      />
    </div>
  );
}

function QualityTrustCardsEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: QualityTrustItem[];
  onChange: (items: QualityTrustItem[]) => void;
}) {
  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">بطاقات الجودة والثقة</p>
      {items.map((item, i) => (
        <div
          key={i}
          className={`space-y-2 rounded-xl p-3 ${item.enabled === false ? "bg-beige/20 opacity-70" : "bg-beige/40"}`}
        >
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={item.enabled !== false}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, enabled: e.target.checked };
                  onChange(next);
                }}
              />
              مفعّلة
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => moveItem(i, -1)}
                className="text-xs text-champagne disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => moveItem(i, 1)}
                className="text-xs text-champagne disabled:opacity-30"
              >
                ↓
              </button>
              <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </div>
          </div>
          <input
            value={item.icon ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, icon: e.target.value };
              onChange(next);
            }}
            placeholder="أيقونة (emoji)"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <input
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, title: e.target.value };
              onChange(next);
            }}
            placeholder="العنوان"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <textarea
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, description: e.target.value };
              onChange(next);
            }}
            placeholder="الوصف"
            rows={2}
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <ImageUploadField
            label="صورة اختيارية (داخل البطاقة)"
            value={item.image ?? ""}
            slug={slug}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, image: v };
              onChange(next);
            }}
          />
        </div>
      ))}
      <ListControls
        addLabel="بطاقة ثقة"
        onAdd={() =>
          onChange([
            ...items,
            {
              icon: "✦",
              title: "بطاقة جديدة",
              description: "",
              enabled: true,
            },
          ])
        }
      />
    </div>
  );
}

function ComparisonEditor({
  rows,
  onChange,
}: {
  rows: { feature: string; limora: boolean; others: boolean }[];
  onChange: (rows: { feature: string; limora: boolean; others: boolean }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted">جدول المقارنة</p>
      {rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-beige/40 p-3">
          <div className="flex justify-end">
            <RemoveButton onClick={() => onChange(rows.filter((_, idx) => idx !== i))} />
          </div>
          <input
            value={row.feature}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...row, feature: e.target.value };
              onChange(next);
            }}
            placeholder="الميزة"
            className="w-full rounded-lg border border-champagne/20 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={row.limora}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, limora: e.target.checked };
                onChange(next);
              }}
            />
            LIMORA ✓
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={row.others}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, others: e.target.checked };
                onChange(next);
              }}
            />
            المنتجات العادية الأخرى ✓
          </label>
        </div>
      ))}
      <ListControls
        addLabel="صف"
        onAdd={() =>
          onChange([...rows, { feature: "ميزة جديدة", limora: true, others: false }])
        }
      />
    </div>
  );
}

const BLANK_SECTION_CONTENT: Record<SectionType, Record<string, unknown>> = {
  problem_solution: {
    label: "CONCERNS",
    title: "عنوان المشاكل",
    problems: [],
    solution: { title: "", description: "", highlights: [], image: "", caption: "" },
  },
  benefits: { label: "BENEFITS", title: "الفوائد", subtitle: "", items: [] },
  transformation: {
    label: "RESULTS",
    title: "قبل / بعد",
    subtitle: "",
    beforeAfter: [],
  },
  results_timeline: {
    label: "YOUR TRANSFORMATION",
    title: "متى تظهر النتائج؟",
    subtitle: "تحولٌ تدريجي… حقيقي… تُلاحظينه أسبوعاً بعد أسبوع.",
    weeks: [
      {
        title: "الأسبوع الأول",
        description: "بداية الشعور بالترطيب والنضارة",
        progress: 25,
        image: "",
      },
    ],
  },
  comparison: { label: "WHY US", title: "LIMORA vs المنتجات العادية الأخرى", subtitle: "", rows: [] },
  reviews: { label: "REVIEWS", title: "التقييمات", items: [], ctaSubtitle: "" },
  how_to_use: { label: "HOW TO", title: "طريقة الاستخدام", subtitle: "", steps: [] },
  ingredients: { label: "FORMULA", title: "المكونات", subtitle: "", items: [] },
  faq: { label: "FAQ", title: "الأسئلة الشائعة", items: [] },
  guarantee: {
    label: "PROMISE",
    title: "الضمان",
    subtitle: "",
    points: [],
    ctaSubtitle: "",
  },
  quality_trust: {
    label: "TRUSTED QUALITY",
    title: "جودة موثوقة ومعتمدة",
    subtitle: "منتج حقيقي… بمعايير جودة تستحقين ثقتكِ",
    reassurance: "جودة موثوقة لراحة وثقة أكبر مع كل طلب.",
    items: [
      {
        icon: "🧪",
        title: "تصنيع بمعايير عالية",
        description: "تركيبة مصنعة بعناية داخل بيئة احترافية",
        enabled: true,
      },
      {
        icon: "🇸🇦",
        title: "منتج محلي موثوق",
        description: "مصمم ليناسب احتياجات المرأة الخليجية",
        enabled: true,
      },
    ],
  },
  related_products: { label: "RELATED", title: "منتجات ذات صلة", items: [] },
  lifestyle: {
    label: "LIFESTYLE",
    title: "قصة التحول",
    subtitle: "",
    body: "",
    image: "",
    imagePosition: "right",
  },
};

export function createBlankSection(type: SectionType): PageSection {
  return {
    id: `sec-${Date.now()}`,
    type,
    enabled: true,
    order: 99,
    content: structuredClone(BLANK_SECTION_CONTENT[type]),
  };
}
