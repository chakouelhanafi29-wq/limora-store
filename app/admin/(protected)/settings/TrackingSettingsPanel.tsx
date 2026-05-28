"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type ProviderKey = "meta" | "tiktok" | "snapchat";

type ProviderStatus = {
  pixelConfigured: boolean;
  tokenConfigured: boolean;
  capiConfigured: boolean;
  tokenPreview: string | null;
};

type TrackingSettingsResponse = {
  pixels: {
    facebook_pixel_id: string;
    tiktok_pixel_id: string;
    snapchat_pixel_id: string;
  };
  testEventCodes: {
    meta: string;
    tiktok: string;
    snapchat: string;
  };
  status: Record<ProviderKey, ProviderStatus>;
  serviceRoleConfigured: boolean;
};

type PlatformConfig = {
  key: ProviderKey;
  title: string;
  subtitle: string;
  pixelKey: "facebook_pixel_id" | "tiktok_pixel_id" | "snapchat_pixel_id";
  pixelLabel: string;
  pixelPlaceholder: string;
  tokenLabel: string;
  tokenPlaceholder: string;
  testCodeLabel: string;
  testCodePlaceholder: string;
  clearTokenKey: "clear_meta_token" | "clear_tiktok_token" | "clear_snapchat_token";
  tokenFieldKey:
    | "meta_capi_access_token"
    | "tiktok_events_access_token"
    | "snapchat_capi_access_token";
  testCodeFieldKey:
    | "meta_test_event_code"
    | "tiktok_test_event_code"
    | "snapchat_test_event_code";
  testCodeResponseKey: "meta" | "tiktok" | "snapchat";
  capiLabel: string;
};

const PLATFORMS: PlatformConfig[] = [
  {
    key: "meta",
    title: "Meta (Facebook / Instagram)",
    subtitle: "Browser Pixel + Conversion API",
    pixelKey: "facebook_pixel_id",
    pixelLabel: "Meta Pixel ID",
    pixelPlaceholder: "1234567890123456",
    tokenLabel: "Meta Conversion API Access Token",
    tokenPlaceholder: "EAAxxxxxxxx...",
    testCodeLabel: "Meta Test Event Code (اختياري)",
    testCodePlaceholder: "TEST12345",
    clearTokenKey: "clear_meta_token",
    tokenFieldKey: "meta_capi_access_token",
    testCodeFieldKey: "meta_test_event_code",
    testCodeResponseKey: "meta",
    capiLabel: "Meta CAPI",
  },
  {
    key: "tiktok",
    title: "TikTok",
    subtitle: "Browser Pixel + Events API",
    pixelKey: "tiktok_pixel_id",
    pixelLabel: "TikTok Pixel ID",
    pixelPlaceholder: "CXXXXXXXXXXXXXXX",
    tokenLabel: "TikTok Events API Access Token",
    tokenPlaceholder: "xxxxxxxxxxxxxxxx",
    testCodeLabel: "TikTok Test Event Code (اختياري)",
    testCodePlaceholder: "TEST12345",
    clearTokenKey: "clear_tiktok_token",
    tokenFieldKey: "tiktok_events_access_token",
    testCodeFieldKey: "tiktok_test_event_code",
    testCodeResponseKey: "tiktok",
    capiLabel: "TikTok Events API",
  },
  {
    key: "snapchat",
    title: "Snapchat",
    subtitle: "Browser Pixel + Conversion API",
    pixelKey: "snapchat_pixel_id",
    pixelLabel: "Snapchat Pixel ID",
    pixelPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    tokenLabel: "Snapchat Conversion API Access Token",
    tokenPlaceholder: "xxxxxxxx-xxxx-xxxx",
    testCodeLabel: "Snapchat Test Event Code (اختياري)",
    testCodePlaceholder: "TEST12345",
    clearTokenKey: "clear_snapchat_token",
    tokenFieldKey: "snapchat_capi_access_token",
    testCodeFieldKey: "snapchat_test_event_code",
    testCodeResponseKey: "snapchat",
    capiLabel: "Snap CAPI",
  },
];

export type TrackingSettingsHandle = {
  save: () => Promise<boolean>;
};

type TrackingSettingsPanelProps = {
  onSaved?: () => void;
};

const TrackingSettingsPanel = forwardRef<
  TrackingSettingsHandle,
  TrackingSettingsPanelProps
>(function TrackingSettingsPanel({ onSaved }, ref) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [serviceRoleConfigured, setServiceRoleConfigured] = useState(true);
  const [status, setStatus] = useState<Record<ProviderKey, ProviderStatus> | null>(
    null,
  );
  const [testResults, setTestResults] = useState<
    Partial<Record<ProviderKey, { ok: boolean; message: string }>>
  >({});
  const [testing, setTesting] = useState<ProviderKey | null>(null);

  const [pixels, setPixels] = useState({
    facebook_pixel_id: "",
    tiktok_pixel_id: "",
    snapchat_pixel_id: "",
  });
  const [tokens, setTokens] = useState({
    meta_capi_access_token: "",
    tiktok_events_access_token: "",
    snapchat_capi_access_token: "",
  });
  const [testCodes, setTestCodes] = useState({
    meta_test_event_code: "",
    tiktok_test_event_code: "",
    snapchat_test_event_code: "",
  });
  const [clearTokens, setClearTokens] = useState({
    clear_meta_token: false,
    clear_tiktok_token: false,
    clear_snapchat_token: false,
  });

  const applyResponse = useCallback((data: TrackingSettingsResponse) => {
    setPixels(data.pixels);
    setTestCodes({
      meta_test_event_code: data.testEventCodes.meta,
      tiktok_test_event_code: data.testEventCodes.tiktok,
      snapchat_test_event_code: data.testEventCodes.snapchat,
    });
    setStatus(data.status);
    setServiceRoleConfigured(data.serviceRoleConfigured);
    setTokens({
      meta_capi_access_token: "",
      tiktok_events_access_token: "",
      snapchat_capi_access_token: "",
    });
    setClearTokens({
      clear_meta_token: false,
      clear_tiktok_token: false,
      clear_snapchat_token: false,
    });
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/tracking-settings");
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "تعذّر تحميل إعدادات التتبع");
      }
      const data = (await response.json()) as TrackingSettingsResponse;
      applyResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ في التحميل");
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveSettings = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/admin/tracking-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pixels,
          ...tokens,
          ...testCodes,
          ...clearTokens,
        }),
      });
      const data = (await response.json()) as TrackingSettingsResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "تعذّر حفظ إعدادات التتبع");
      }
      applyResponse(data);
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ في الحفظ");
      return false;
    } finally {
      setSaving(false);
    }
  }, [applyResponse, clearTokens, onSaved, pixels, testCodes, tokens]);

  useImperativeHandle(ref, () => ({ save: saveSettings }), [saveSettings]);

  const runTest = async (provider: ProviderKey) => {
    setTesting(provider);
    setTestResults((prev) => ({ ...prev, [provider]: undefined }));
    try {
      const response = await fetch("/api/admin/tracking-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string | null;
      };
      setTestResults((prev) => ({
        ...prev,
        [provider]: {
          ok: data.ok,
          message: data.ok
            ? "تم إرسال حدث اختبار بنجاح"
            : data.error ?? "فشل إرسال حدث الاختبار",
        },
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [provider]: { ok: false, message: "تعذّر الاتصال بالخادم" },
      }));
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-champagne/10 bg-beige/20 p-6 text-sm text-muted">
        جاري تحميل إعدادات التتبع...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!serviceRoleConfigured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          أضيفي <code dir="ltr">SUPABASE_SERVICE_ROLE_KEY</code> في Vercel مرة واحدة
          لتفعيل قراءة التوكنات من قاعدة البيانات على الخادم. بعد ذلك يمكنكِ
          إدارة كل التوكنات من هنا دون تعديل Vercel.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {PLATFORMS.map((platform) => {
        const providerStatus = status?.[platform.key];
        const testResult = testResults[platform.key];
        const tokenPreview = providerStatus?.tokenPreview;
        const capiConfigured = providerStatus?.capiConfigured;
        const pixelConfigured = providerStatus?.pixelConfigured;

        return (
          <article
            key={platform.key}
            className="rounded-2xl border border-champagne/15 bg-beige/20 p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{platform.title}</h3>
                <p className="mt-1 text-xs text-muted">{platform.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <StatusBadge
                  ok={Boolean(pixelConfigured)}
                  label={pixelConfigured ? "Pixel نشط" : "Pixel غير مُعد"}
                />
                <StatusBadge
                  ok={Boolean(capiConfigured)}
                  label={
                    capiConfigured
                      ? `${platform.capiLabel} مُعد`
                      : `${platform.capiLabel} غير مُعد`
                  }
                />
                {testResult ? (
                  <StatusBadge ok={testResult.ok} label={testResult.message} />
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">
                  {platform.pixelLabel}
                </span>
                <input
                  dir="ltr"
                  placeholder={platform.pixelPlaceholder}
                  value={pixels[platform.pixelKey]}
                  onChange={(e) =>
                    setPixels((prev) => ({
                      ...prev,
                      [platform.pixelKey]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">
                  {platform.tokenLabel}
                </span>
                {tokenPreview ? (
                  <p className="mb-2 text-xs text-muted" dir="ltr">
                    محفوظ: {tokenPreview} — اتركي الحقل فارغاً للإبقاء عليه
                  </p>
                ) : null}
                <input
                  dir="ltr"
                  type="password"
                  autoComplete="new-password"
                  placeholder={platform.tokenPlaceholder}
                  value={tokens[platform.tokenFieldKey]}
                  onChange={(e) =>
                    setTokens((prev) => ({
                      ...prev,
                      [platform.tokenFieldKey]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
                />
                {tokenPreview ? (
                  <label className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={clearTokens[platform.clearTokenKey]}
                      onChange={(e) =>
                        setClearTokens((prev) => ({
                          ...prev,
                          [platform.clearTokenKey]: e.target.checked,
                        }))
                      }
                    />
                    حذف التوكن المحفوظ
                  </label>
                ) : null}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">
                  {platform.testCodeLabel}
                </span>
                <input
                  dir="ltr"
                  placeholder={platform.testCodePlaceholder}
                  value={testCodes[platform.testCodeFieldKey]}
                  onChange={(e) =>
                    setTestCodes((prev) => ({
                      ...prev,
                      [platform.testCodeFieldKey]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={testing === platform.key || !capiConfigured}
                onClick={() => void runTest(platform.key)}
                className="rounded-full border border-champagne/30 bg-white px-4 py-2 text-xs font-medium hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50"
              >
                {testing === platform.key ? "جاري الاختبار..." : "إرسال حدث اختبار"}
              </button>
            </div>
          </article>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => void saveSettings()}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm text-ivory hover:bg-champagne disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ إعدادات التتبع"}
        </button>
        {saved ? (
          <span className="text-sm text-emerald-600">تم حفظ التتبع بنجاح ✓</span>
        ) : null}
      </div>

      <div className="rounded-xl bg-beige/40 p-4 text-xs leading-relaxed text-muted">
        التوكنات تُخزَّن في جدول محمي (admin-only) ولا تُعرض أبداً للمتجر.
        المتصفح يستخدم Pixel IDs فقط. الخادم يرسل Conversion API / Events API
        تلقائياً بعد الحفظ.
      </div>
    </div>
  );
});

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
        ok
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-stone-100 text-stone-600 ring-1 ring-stone-200"
      }`}
    >
      <span aria-hidden>{ok ? "✅" : "○"}</span>
      {label}
    </span>
  );
}

export default TrackingSettingsPanel;
