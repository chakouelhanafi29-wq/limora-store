"use client";

import { useEffect, useState } from "react";
import type { DatePreset } from "@/lib/analytics/date-range";
import type { DateFilterDraft } from "@/lib/analytics/admin-date-filter";

export type { DateFilterDraft };

type Props = {
  applied: DateFilterDraft;
  onApply: (draft: DateFilterDraft) => void;
  loading?: boolean;
};

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: "today", label: "اليوم" },
  { id: "yesterday", label: "أمس" },
  { id: "7d", label: "آخر 7 أيام" },
  { id: "30d", label: "آخر 30 يوم" },
  { id: "month", label: "هذا الشهر" },
  { id: "custom", label: "نطاق مخصص" },
];

export default function AnalyticsDateFilter({
  applied,
  onApply,
  loading,
}: Props) {
  const [draft, setDraft] = useState<DateFilterDraft>(applied);

  useEffect(() => {
    setDraft(applied);
  }, [applied.preset, applied.customStart, applied.customEnd]);

  const canApply =
    draft.preset !== "custom" ||
    (Boolean(draft.customStart) &&
      Boolean(draft.customEnd) &&
      draft.customStart <= draft.customEnd);

  const isDirty =
    draft.preset !== applied.preset ||
    (draft.preset === "custom" &&
      (draft.customStart !== applied.customStart ||
        draft.customEnd !== applied.customEnd));

  return (
    <div className="rounded-2xl border border-champagne/10 bg-white p-5 luxury-shadow sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">الفترة الزمنية</p>
          <p className="mt-1 text-sm text-muted">
            اختاري الفترة ثم اضغطي «تطبيق» لتحديث كل المؤشرات
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading}
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  preset: item.id,
                }))
              }
              className={`rounded-full px-4 py-2.5 text-xs font-medium transition ${
                draft.preset === item.id
                  ? "bg-foreground text-ivory ring-2 ring-champagne/30"
                  : "border border-champagne/20 bg-beige/30 text-foreground hover:bg-beige"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {draft.preset === "custom" ? (
        <div className="mt-5 grid gap-3 border-t border-champagne/10 pt-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-foreground">من</span>
            <input
              type="date"
              dir="ltr"
              value={draft.customStart}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, customStart: e.target.value }))
              }
              className="w-full rounded-xl border border-champagne/20 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-foreground">إلى</span>
            <input
              type="date"
              dir="ltr"
              value={draft.customEnd}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, customEnd: e.target.value }))
              }
              className="w-full rounded-xl border border-champagne/20 px-3 py-2.5"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-champagne/10 pt-5">
        <button
          type="button"
          disabled={loading || !canApply}
          onClick={() => onApply(draft)}
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-ivory transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "جاري التحديث..." : "تطبيق"}
        </button>
        {isDirty && !loading ? (
          <span className="text-xs text-champagne">تغييرات غير مُطبّقة — اضغطي تطبيق</span>
        ) : null}
        {!canApply && draft.preset === "custom" ? (
          <span className="text-xs text-red-600">تحققي من صحة تاريخ البداية والنهاية</span>
        ) : null}
      </div>
    </div>
  );
}
