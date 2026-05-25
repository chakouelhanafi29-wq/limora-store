"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/types/database";

export default function ReviewsManager({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({
    customer_name: "",
    location: "",
    product_label: "",
    rating: "5",
    content: "",
    image_url: "",
  });

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      alert("Supabase غير مُفعّل");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      customer_name: form.customer_name,
      location: form.location,
      product_label: form.product_label,
      rating: Number(form.rating),
      content: form.content,
      image_url: form.image_url || null,
      is_active: true,
    });
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
    setForm({
      customer_name: "",
      location: "",
      product_label: "",
      rating: "5",
      content: "",
      image_url: "",
    });
  };

  const deleteReview = async (id: string) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleActive = async (review: Review) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase
      .from("reviews")
      .update({ is_active: !review.is_active })
      .eq("id", review.id);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, is_active: !r.is_active } : r,
      ),
    );
  };

  return (
    <div>
      <form
        onSubmit={addReview}
        className="mb-8 grid gap-3 rounded-2xl border border-champagne/10 bg-white p-6 sm:grid-cols-2 luxury-shadow"
      >
        <h2 className="sm:col-span-2 font-semibold">إضافة تقييم</h2>
        <input
          placeholder="الاسم"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
          required
        />
        <input
          placeholder="المدينة"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
        <input
          placeholder="المنتج"
          value={form.product_label}
          onChange={(e) => setForm({ ...form, product_label: e.target.value })}
          className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
        <input
          placeholder="التقييم 1-5"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
        <textarea
          placeholder="نص التقييم"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="sm:col-span-2 rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
          required
        />
        <input
          placeholder="رابط الصورة (Unsplash)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="sm:col-span-2 rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-foreground py-2.5 text-sm text-ivory hover:bg-champagne"
        >
          إضافة
        </button>
      </form>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-champagne/10 bg-white p-5 luxury-shadow"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-semibold">{review.customer_name}</p>
                <p className="text-xs text-muted">
                  {review.location} · {review.product_label}
                </p>
                <p className="mt-2 text-sm">{review.content}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(review)}
                  className="text-xs text-champagne"
                >
                  {review.is_active ? "إخفاء" : "إظهار"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteReview(review.id)}
                  className="text-xs text-red-500"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
