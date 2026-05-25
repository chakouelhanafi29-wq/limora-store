"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getOfferDisplayLabel } from "@/lib/storefront";
import type { StorefrontProduct } from "@/lib/storefront";
import {
  getAttributionForOrder,
  trackEvent,
} from "@/lib/analytics/events";
import { saudiCities, type Offer } from "../../lib/product-data";

type Props = {
  open: boolean;
  onClose: () => void;
  offer: Offer;
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
};

export default function OrderModal({
  open,
  onClose,
  offer,
  product,
  productId,
  productSlug = "glow",
  offerLabels = {},
  orderModal,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const offerLabel = getOfferDisplayLabel(offer, offerLabels[offer.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      trackEvent("Lead", {
        product_name: product.orderName,
        product_slug: productSlug,
        offer_label: offerLabel,
        value: offer.price,
        page_path: "/product",
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          city,
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

      const params = new URLSearchParams({
        product: product.orderName,
        offer: offerLabel,
        price: String(offer.price),
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
    setError("");
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

        <div className="mb-6 rounded-2xl bg-beige/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">{product.name}</p>
              <p className="text-sm text-muted">{offer.label}</p>
            </div>
            <p className="font-serif text-xl font-semibold text-foreground">
              {offer.price} <span className="text-sm">ر.س</span>
            </p>
          </div>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: نورة العتيبي"
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/20"
            />
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/20"
            />
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
        </form>
      </div>
    </div>
  );
}
