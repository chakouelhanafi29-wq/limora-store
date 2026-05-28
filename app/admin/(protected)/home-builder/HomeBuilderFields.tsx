"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  SECTION_PADDING_OPTIONS,
  type HomeSectionStyle,
} from "@/lib/home-builder/section-style";
import { uploadBuilderImage } from "@/lib/page-builder/upload-image";

export function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
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
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-champagne/20 px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-xl border border-champagne/10 bg-beige/20 p-3">
      <span>
        <span className="block text-xs font-medium text-foreground">{label}</span>
        {hint ? <span className="mt-0.5 block text-[11px] text-muted">{hint}</span> : null}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-champagne"
      />
    </label>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "builder/home",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const upload = async (file: File) => {
    const supabase = createClient();
    if (!supabase) return;
    const url = await uploadBuilderImage(supabase, "home", file, folder);
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

function SortableItemShell({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`rounded-xl border border-champagne/10 bg-beige/30 p-3 ${
        isDragging ? "z-10 scale-[1.01] border-champagne shadow-md" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg px-2 py-1 text-xs text-muted hover:bg-white"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
      </div>
      {children}
    </div>
  );
}

export function SortableListEditor<T extends { id?: string }>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel,
  getItemId,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  onAdd: () => T;
  addLabel: string;
  getItemId?: (item: T, index: number) => string;
}) {
  const ids = items.map((item, index) => getItemId?.(item, index) ?? `item-${index}`);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            const id = ids[index];
            const update = (patch: Partial<T>) => {
              const next = [...items];
              next[index] = { ...item, ...patch };
              onChange(next);
            };

            return (
              <SortableItemShell key={id} id={id}>
                <div className="space-y-2">
                  {renderItem(item, index, update)}
                  <button
                    type="button"
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                    className="text-xs text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </SortableItemShell>
            );
          })}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={() => onChange([...items, onAdd()])}
        className="rounded-full border border-champagne/30 px-3 py-1.5 text-xs text-champagne hover:bg-beige"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function SectionStylePanel({
  style,
  onChange,
}: {
  style: HomeSectionStyle;
  onChange: (style: HomeSectionStyle) => void;
}) {
  const update = (patch: Partial<HomeSectionStyle>) => onChange({ ...style, ...patch });

  return (
    <div className="space-y-3 rounded-2xl border border-champagne/10 bg-gradient-to-br from-beige/30 to-white p-4">
      <p className="text-xs font-semibold text-foreground">تصميم القسم</p>
      <Field
        label="لون / تدرج الخلفية"
        value={style.backgroundColor ?? ""}
        onChange={(v) => update({ backgroundColor: v })}
        placeholder="linear-gradient(135deg, #2a201e, #3d2e2a)"
      />
      <Field
        label="كلاس Tailwind إضافي"
        value={style.backgroundClass ?? ""}
        onChange={(v) => update({ backgroundClass: v })}
        placeholder="bg-beige/50"
      />
      <SelectField
        label="المسافات العمودية"
        value={style.paddingY ?? "default"}
        onChange={(v) =>
          update({ paddingY: v as HomeSectionStyle["paddingY"] })
        }
        options={SECTION_PADDING_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
      <Field
        label="Border radius (CSS)"
        value={style.borderRadius ?? ""}
        onChange={(v) => update({ borderRadius: v })}
        placeholder="1.75rem"
      />
      <ToggleField
        label="إخفاء على الجوال"
        checked={Boolean(style.hideOnMobile)}
        onChange={(v) => update({ hideOnMobile: v })}
      />
    </div>
  );
}
