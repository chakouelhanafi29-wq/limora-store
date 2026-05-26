"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOfferDisplayLabel } from "@/lib/storefront";
import type { StorefrontProduct } from "@/lib/storefront";
import {
  getAttributionForOrder,
  trackEvent,
} from "@/lib/analytics/events";
import {
  formatSaudiPhoneDisplay,
  isValidSaudiPhone,
  normalizeSaudiPhone,
} from "@/lib/validation/saudi-phone";
import { saudiCities, type Offer } from "../../lib/product-data";
import OfferSelection from "./OfferSelection";

type Props = {
  open: boolean;
  onClose: () => void;
  offer: Offer;
  offers: Offer[];
  onSelectOffer: (offer: Offer) => void;
  product: StorefrontProduct;
  productId?: string;
  productSlug?: string;
  offerLabels?: Record<string, string>;
  orderModal?: {
    title: string;
    subtitle: string;
    submitLabel: string;
    trustLine: string;
  };
  codTrust?: string[];
};

export default function OrderModal({
  open,
  onClose,
  offer,
  offers,
  onSelectOffer,
  product,
  productId,
  productSlug = "glow",
  offerLabels = {},
  orderModal,
  codTrust = [],
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const offerLabel = getOfferDisplayLabel(offer, offerLabels[offer.id]);

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError("");
      return;
    }
    if (!isValidSaudiPhone(phone)) {
      setPhoneError("أدخلي رقم جوال سعودي صحيح (05XXXXXXXX)");
    } else {
      setPhoneError("");
      setPhone(formatSaudiPhoneDisplay(phone));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedPhone = normalizeSaudiPhone(phone);
    if (!normalizedPhone) {
      setPhoneError("أدخلي رقم جوال سعودي صحيح (05XXXXXXXX)");
      return;
    }

    if (name.trim().split(/\s+/).length < 2) {
      setError("يرجى إدخال الاسم الكامل (الاسم الأول واسم العائلة)");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: normalizedPhone,
          city,
          district: district.trim(),
          product_id: productId || null,
          product_name: product.orderName,
          product_slug: productSlug,
          offer_id: /^[0-9a-f-]{36}$/i.test(offer.id) ? offer.id : null,
          offer_label: offerLabel,
          offer_quantity: offer.quantity,
          total_price: offer.price,
          ...getAttributionForOrder(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إرسال الطلب");

      trackEvent("Lead", {
        product_name: product.orderName,
        product_slug: productSlug,
        offer_label: offerLabel,
        value: offer.price,
        page_path: `/product/${productSlug}`,
      });

      const params = new URLSearchParams({
        product: product.orderName,
        offer: offerLabel,
        price: String(offer.price),
        slug: productSlug,
      });
      if (data.id) params.set("orderId", data.id);

      onClose();
      router.push(`/thank-you?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setCity("");
    setDistrict("");
    setError("");
    setPhoneError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-ivory p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <button
          type="button"
          aria-label="إغلاق"
          onClick={handleClose}
          className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-beige text-foreground/60 hover:text-foreground"
        >
          ✕
        </button>

        <div className="mb-6 border-b border-champagne/10 pb-6 pt-2 text-center">
          <p className="mb-1 text-xs tracking-widest text-champagne">LIMORA</p>
          <h2
            id="order-modal-title"
            className="font-serif text-2xl font-semibold text-foreground"
          >
            {orderModal?.title ?? "أكّدي طلبكِ"}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {orderModal?.subtitle ?? "دفع عند الاستلام · شحن مجاني"}
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-champagne/15 bg-beige/40 p-4">
          <p className="mb-3 text-xs font-semibold text-champagne">
            اختاري العرض
          </p>
          <OfferSelection
            selected={offer}
            onSelect={onSelectOffer}
            offers={offers}
            compact
          />
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="order-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              الاسم الكامل
            </label>
            <input
              id="order-name"
              type="text"
              required
              minLength={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: نورة العتيبي"
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/20"
            />
            <p className="mt-1 text-[11px] text-muted">
              الاسم الكامل يساعدنا على تأكيد طلبكِ بسرعة
            </p>
          </div>

          <div>
            <label
              htmlFor="order-phone"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              رقم الجوال
            </label>
            <input
              id="order-phone"
              type="tel"
              required
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError("");
              }}
              onBlur={handlePhoneBlur}
              placeholder="05XXXXXXXX"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                phoneError
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-champagne/20 focus:border-champagne focus:ring-champagne/20"
              }`}
            />
            {phoneError ? (
              <p className="mt-1 text-xs text-red-600">{phoneError}</p>
            ) : (
              <p className="mt-1 text-[11px] text-muted">
                سنتواصل معكِ على هذا الرقم لتأكيد الطلب
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="order-city"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              المدينة
            </label>
            <select
              id="order-city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/20"
            >
              <option value="">اختاري مدينتكِ</option>
              {saudiCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="order-district"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              الحي / المنطقة
            </label>
            <input
              id="order-district"
              type="text"
              required
              minLength={2}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: حي النرجس، العليا، اليرموك..."
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/20"
            />
            <p className="mt-1 text-[11px] text-muted">
              يساعد مندوب التوصيل على الوصول إليكِ بسرعة
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group relative mt-2 w-full overflow-hidden rounded-full bg-foreground py-4 text-base font-medium text-ivory transition hover:shadow-xl disabled:opacity-70"
          >
            <span className="relative z-10">
              {submitting
                ? "جاري الإرسال..."
                : `${orderModal?.submitLabel ?? "تأكيد الطلب"} — ${offer.price} ر.س`}
            </span>
            <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
          </button>

          <p className="text-center text-xs text-muted">
            {orderModal?.trustLine ??
              "✦ الدفع عند الاستلام · لا حاجة لبطاقة ائتمان"}
          </p>

          {codTrust.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {codTrust.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-beige/60 px-2.5 py-1 text-[10px] text-muted"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
