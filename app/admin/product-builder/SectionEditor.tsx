"use client";

import type { PageSection, SectionType } from "@/lib/page-builder/types";

type Props = {
  section: PageSection;
  onChange: (section: PageSection) => void;
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

export default function SectionEditor({ section, onChange }: Props) {
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
      {"subtitle" in content && (
        <Field
          label="الوصف"
          value={String(content.subtitle ?? "")}
          onChange={(v) => updateContent("subtitle", v)}
          multiline
        />
      )}

      {section.type === "faq" && (
        <FAQEditor
          items={(content.items as { question: string; answer: string }[]) ?? []}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "benefits" && (
        <ItemsEditor
          items={(content.items as { icon: string; title: string; description: string }[]) ?? []}
          fields={["icon", "title", "description"]}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "reviews" && (
        <ReviewItemsEditor
          items={
            (content.items as {
              name: string;
              location: string;
              text: string;
              image: string;
            }[]) ?? []
          }
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "transformation" && (
        <BeforeAfterEditor
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
          <ItemsEditor
            items={
              (content.problems as { title: string; description: string }[]) ?? []
            }
            fields={["title", "description"]}
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
        </>
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
          items={
            (content.steps as { step: string; title: string; description: string }[]) ??
            []
          }
          fields={["step", "title", "description"]}
          onChange={(items) => updateContent("steps", items)}
        />
      )}

      {section.type === "ingredients" && (
        <ItemsEditor
          items={(content.items as { name: string; benefit: string; image: string }[]) ?? []}
          fields={["name", "benefit", "image"]}
          onChange={(items) => updateContent("items", items)}
        />
      )}

      {section.type === "guarantee" && (
        <ItemsEditor
          items={
            (content.points as { icon: string; title: string; description: string }[]) ??
            []
          }
          fields={["icon", "title", "description"]}
          onChange={(items) => updateContent("points", items)}
        />
      )}

      {section.type === "related_products" && (
        <ItemsEditor
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
          fields={["name", "nameEn", "benefit", "price", "image", "href"]}
          onChange={(items) => updateContent("items", items)}
        />
      )}
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
        <div key={i} className="rounded-xl bg-beige/40 p-3 space-y-2">
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
    </div>
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

function ReviewItemsEditor({
  items,
  onChange,
}: {
  items: { name: string; location: string; text: string; image: string }[];
  onChange: (items: { name: string; location: string; text: string; image: string }[]) => void;
}) {
  return (
    <ItemsEditor
      items={items}
      fields={["name", "location", "text", "image"]}
      onChange={onChange as (items: Record<string, string>[]) => void}
    />
  );
}

function BeforeAfterEditor({
  items,
  onChange,
}: {
  items: { before: string; after: string; quote: string; days: string }[];
  onChange: (items: { before: string; after: string; quote: string; days: string }[]) => void;
}) {
  return (
    <ItemsEditor
      items={items}
      fields={["before", "after", "quote", "days"]}
      onChange={onChange as (items: Record<string, string>[]) => void}
    />
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
        <div key={i} className="rounded-xl bg-beige/40 p-3 space-y-2">
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
            المنافسون ✓
          </label>
        </div>
      ))}
    </div>
  );
}

export function createBlankSection(type: SectionType): PageSection {
  return {
    id: `sec-${Date.now()}`,
    type,
    enabled: true,
    order: 99,
    content: { label: "NEW", title: "عنوان جديد", subtitle: "" },
  };
}
