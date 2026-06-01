"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Ga4AdminSettingsSnapshot } from "@/lib/analytics/ga4/admin-settings";

export type Ga4SettingsHandle = {
  save: () => Promise<boolean>;
};

type Props = {
  initial: Ga4AdminSettingsSnapshot;
};

const Ga4SettingsPanel = forwardRef<Ga4SettingsHandle, Props>(
  function Ga4SettingsPanel({ initial }, ref) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState(initial);
    const [measurementId, setMeasurementId] = useState(initial.measurementId);
    const [propertyId, setPropertyId] = useState(initial.propertyId);
    const [serviceAccountJson, setServiceAccountJson] = useState("");
    const [clearServiceAccount, setClearServiceAccount] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testMessage, setTestMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const refreshStatus = useCallback(async () => {
      try {
        const res = await fetch("/api/admin/ga4-settings");
        if (!res.ok) return;
        const data = (await res.json()) as Ga4AdminSettingsSnapshot;
        setStatus(data);
        setMeasurementId(data.measurementId ?? "");
        setPropertyId(data.propertyId ?? "");
      } catch {
        // keep current form values
      }
    }, []);

    useEffect(() => {
      setStatus(initial);
      setMeasurementId(initial.measurementId);
      setPropertyId(initial.propertyId);
    }, [initial]);

    const hasPropertyId = Boolean(normalizePropertyId(propertyId));
    const hasCredentials =
      Boolean(serviceAccountJson.trim()) ||
      (status.dataApiConfigured && !clearServiceAccount);
    const canTest = hasPropertyId;

    const save = useCallback(async () => {
      setSaving(true);
      setError(null);
      setSaved(false);
      try {
        const res = await fetch("/api/admin/ga4-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            measurementId,
            propertyId,
            ga4_service_account_json: serviceAccountJson,
            clear_ga4_service_account: clearServiceAccount,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "فشل حفظ إعدادات GA4");
        }
        setStatus(data);
        setMeasurementId(data.measurementId ?? measurementId);
        setPropertyId(data.propertyId ?? propertyId);
        setServiceAccountJson("");
        setClearServiceAccount(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "فشل الحفظ");
        return false;
      } finally {
        setSaving(false);
      }
    }, [
      measurementId,
      propertyId,
      serviceAccountJson,
      clearServiceAccount,
    ]);

    useImperativeHandle(ref, () => ({ save }), [save]);

    const runTest = async () => {
      setTesting(true);
      setTestMessage(null);
      setError(null);
      try {
        const res = await fetch("/api/admin/ga4-settings/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId,
            serviceAccountJson: clearServiceAccount
              ? ""
              : serviceAccountJson || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setTestMessage(data.error || "فشل الاتصال بـ GA4 Data API");
        } else {
          setTestMessage(
            `متصل ✓ — ${data.sessions ?? 0} جلسة خلال آخر 7 أيام`,
          );
        }
      } catch {
        setTestMessage("فشل اختبار الاتصال");
      } finally {
        setTesting(false);
      }
    };

    const onJsonFile = (file: File | undefined) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? "");
        setServiceAccountJson(text);
        setClearServiceAccount(false);
      };
      reader.readAsText(file);
    };

    return (
      <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-6 luxury-shadow sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-emerald-800 uppercase">
              GOOGLE ANALYTICS 4
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
              GA4 + Data API
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Measurement ID يُفعّل التتبع على المتجر (gtag). Property ID و Service
              Account يُفعّلان لوحة التحليلات عبر Google Analytics Data API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <StatusPill ok={status.measurementConfigured} label="Measurement ID" />
            <StatusPill ok={status.dataApiConfigured} label="Data API" />
            <StatusPill
              ok={status.serviceAccountConfigured}
              label="Service Account"
            />
          </div>
        </div>

        {!status.serviceRoleConfigured ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            أضيفي{" "}
            <code dir="ltr" className="text-xs">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            في Vercel لقراءة Service Account من قاعدة البيانات.
          </div>
        ) : null}

        {status.migrationHint ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {status.migrationHint}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              GA4 Measurement ID
            </span>
            <span className="mb-2 block text-xs text-muted">
              من GA4 → Data streams → Web — يبدأ بـ G-
            </span>
            <input
              dir="ltr"
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">GA4 Property ID</span>
            <span className="mb-2 block text-xs text-muted">
              رقم فقط (ليس G-…) — Admin → Property settings
            </span>
            <input
              dir="ltr"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="123456789"
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
            />
          </label>

          <div className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">
              Service Account JSON (Data API)
            </span>
            <span className="mb-2 block text-xs text-muted">
              ملف JSON من Google Cloud → IAM → Service Accounts → Keys
            </span>
            {status.serviceAccountPreview && !clearServiceAccount ? (
              <p className="mb-2 rounded-lg bg-white/80 px-3 py-2 text-xs text-muted" dir="ltr">
                محفوظ: {status.serviceAccountPreview}
                <span className="block text-foreground/70">
                  اتركي الحقل فارغاً للإبقاء على الملف الحالي
                </span>
              </p>
            ) : (
              <p className="mb-2 text-xs text-muted">لم يُرفع Service Account بعد</p>
            )}
            <textarea
              dir="ltr"
              rows={6}
              value={serviceAccountJson}
              onChange={(e) => setServiceAccountJson(e.target.value)}
              placeholder='{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n..."}'
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 font-mono text-xs leading-relaxed"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-champagne/30 bg-white px-4 py-2 text-xs hover:bg-beige"
              >
                رفع ملف JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => onJsonFile(e.target.files?.[0])}
              />
              {status.serviceAccountPreview ? (
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={clearServiceAccount}
                    onChange={(e) => setClearServiceAccount(e.target.checked)}
                  />
                  حذف Service Account المحفوظ
                </label>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-emerald-200/40 pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-full bg-foreground px-6 py-2.5 text-sm text-ivory hover:bg-champagne disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ GA4"}
          </button>
          <button
            type="button"
            disabled={testing || !canTest}
            onClick={() => void runTest()}
            title={
              !hasPropertyId
                ? "أدخلي GA4 Property ID أولاً"
                : !hasCredentials
                  ? "ألصقي Service Account JSON واحفظي، أو اختبري بعد الحفظ"
                  : undefined
            }
            className="rounded-full border border-emerald-300 bg-white px-6 py-2.5 text-sm font-medium text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
          >
            {testing ? "جاري الاختبار..." : "اختبار Data API"}
          </button>
          <button
            type="button"
            onClick={() => void refreshStatus()}
            className="rounded-full border border-champagne/20 px-4 py-2 text-xs text-muted hover:bg-beige"
          >
            تحديث الحالة
          </button>
        </div>

        {saved ? (
          <p className="mt-3 text-sm font-medium text-emerald-700">تم حفظ GA4 بنجاح ✓</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {testMessage ? (
          <p
            className={`mt-3 text-sm ${testMessage.includes("✓") ? "text-emerald-700" : "text-red-600"}`}
          >
            {testMessage}
          </p>
        ) : null}

        {hasPropertyId && !hasCredentials ? (
          <p className="mt-3 text-sm text-amber-800">
            Measurement ID وحده يُفعّل التتبع على المتجر فقط. لاختبار Data API وللوحة
            التحليلات: ارفعي Service Account JSON (Viewer على Property) ثم احفظي GA4.
          </p>
        ) : null}

        <p className="mt-4 text-xs text-muted">
          Measurement ID = gtag على المتجر. Property ID + Service Account = لوحة
          التحليلات عبر Google Analytics Data API. بعد الحفظ افتحي{" "}
          <strong>/admin/analytics</strong> — البيانات من GA4 قد تتأخر 24–48 ساعة
          عن Realtime.
        </p>
      </section>
    );
  },
);

function normalizePropertyId(value: string) {
  return value.trim().replace(/\D/g, "");
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ${
        ok
          ? "bg-emerald-100 text-emerald-900 ring-emerald-200"
          : "bg-stone-100 text-stone-600 ring-stone-200"
      }`}
    >
      <span aria-hidden>{ok ? "✓" : "○"}</span>
      {label}
    </span>
  );
}

export default Ga4SettingsPanel;
