"use client";

import Link from "next/link";
import { sortProductImages } from "@/lib/product-images";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Product, ProductOffer } from "@/lib/types/database";

type ProductWithRelations = Product & {
  product_images?: { id: string; url: string; sort_order?: number; is_primary?: boolean }[];
  product_offers?: ProductOffer[];
};

export default function ProductsManager({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts as ProductWithRelations[]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name_ar: "",
    name_en: "",
    subtitle: "",
    description: "",
    price: "",
    original_price: "",
    badge: "",
    urgency_text: "",
  });

  const getClient = () => {
    if (!isSupabaseConfigured()) {
      alert("اربط Supabase أولاً عبر .env.local");
      return null;
    }
    return createClient();
  };

  const startEdit = (product: ProductWithRelations) => {
    setEditingId(product.id);
    setEditForm({
      name_ar: product.name_ar,
      name_en: product.name_en,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : "",
      badge: product.badge ?? "",
      urgency_text: product.urgency_text ?? "",
    });
  };

  const saveEdit = async (id: string) => {
    const supabase = getClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("products")
      .update({
        name_ar: editForm.name_ar,
        name_en: editForm.name_en,
        subtitle: editForm.subtitle,
        description: editForm.description,
        price: Number(editForm.price),
        original_price: editForm.original_price
          ? Number(editForm.original_price)
          : null,
        badge: editForm.badge || null,
        urgency_text: editForm.urgency_text || null,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);
    router.refresh();
  };

  const toggleActive = async (product: Product) => {
    const supabase = getClient();
    if (!supabase) return;

    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    router.refresh();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p,
      ),
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("حذف هذا المنتج؟")) return;
    const supabase = getClient();
    if (!supabase) return;

    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadImage = async (productId: string, file: File) => {
    const supabase = getClient();
    if (!supabase) return;

    setUploading(productId);
    const ext = file.name.split(".").pop();
    const path = `${productId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    await supabase.from("product_images").insert({
      product_id: productId,
      url: publicUrl,
      storage_path: path,
      is_primary: false,
      sort_order: 99,
    });

    setUploading(null);
    router.refresh();
    alert("تم رفع الصورة بنجاح");
  };

  const saveOffer = async (offer: ProductOffer) => {
    const supabase = getClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("product_offers")
      .update({
        label: offer.label,
        display_label: offer.display_label,
        quantity: offer.quantity,
        price: offer.price,
        badge: offer.badge,
        is_recommended: offer.is_recommended,
      })
      .eq("id", offer.id);

    if (error) alert(error.message);
    else router.refresh();
  };

  const addOffer = async (productId: string) => {
    const supabase = getClient();
    if (!supabase) return;

    const { error } = await supabase.from("product_offers").insert({
      product_id: productId,
      label: "عرض جديد",
      display_label: "عرض جديد",
      quantity: 1,
      price: 199,
      is_recommended: false,
      sort_order: 99,
    });

    if (error) alert(error.message);
    else router.refresh();
  };

  return (
    <div className="space-y-4">
      {products.length === 0 && (
        <p className="rounded-2xl border border-champagne/10 bg-white p-8 text-center text-sm text-muted luxury-shadow">
          لا توجد منتجات — أضيفي منتجاً جديداً أو شغّلي schema.sql في Supabase
        </p>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-champagne">{product.name_en}</p>
              <h3 className="font-serif text-xl font-semibold">
                {product.name_ar}
              </h3>
              <p className="mt-1 text-sm text-muted">{product.subtitle}</p>
              <p className="mt-2 font-semibold">
                {product.price} ر.س
                {product.original_price && (
                  <span className="mr-2 text-sm text-muted line-through">
                    {product.original_price}
                  </span>
                )}
              </p>

              {product.product_images?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sortProductImages(product.product_images)
                    .slice(0, 4)
                    .map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt=""
                      className="h-16 w-16 rounded-xl border border-champagne/10 bg-beige/40 object-contain p-1"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/products/${product.id}/builder`}
                className="rounded-full bg-champagne/20 px-4 py-2 text-xs font-medium text-foreground hover:bg-champagne/30"
              >
                محرر الصفحة
              </Link>
              <button
                type="button"
                onClick={() => startEdit(product)}
                className="rounded-full border border-champagne/30 px-4 py-2 text-xs"
              >
                تعديل
              </button>
              <label className="cursor-pointer rounded-full border border-champagne/30 px-4 py-2 text-xs hover:bg-beige">
                {uploading === product.id ? "جاري الرفع..." : "رفع صورة"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(product.id, file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => toggleActive(product)}
                className="rounded-full border border-champagne/30 px-4 py-2 text-xs"
              >
                {product.is_active ? "إيقاف" : "تفعيل"}
              </button>
              <button
                type="button"
                onClick={() => deleteProduct(product.id)}
                className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-600"
              >
                حذف
              </button>
            </div>
          </div>

          {editingId === product.id && (
            <div className="mt-6 grid gap-3 border-t border-champagne/10 pt-6 sm:grid-cols-2">
              {(
                Object.keys(editForm) as Array<keyof typeof editForm>
              ).map((key) => (
                <input
                  key={key}
                  placeholder={key}
                  value={editForm[key]}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [key]: e.target.value })
                  }
                  className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
                />
              ))}
              <div className="sm:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => saveEdit(product.id)}
                  className="rounded-full bg-foreground px-6 py-2 text-sm text-ivory"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-full border border-champagne/30 px-6 py-2 text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-champagne/10 pt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">عروض COD</h4>
              <button
                type="button"
                onClick={() => addOffer(product.id)}
                className="text-xs text-champagne hover:underline"
              >
                + إضافة عرض
              </button>
            </div>
            <div className="space-y-2">
              {(product.product_offers ?? []).map((offer) => (
                <OfferRow key={offer.id} offer={offer} onSave={saveOffer} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OfferRow({
  offer,
  onSave,
}: {
  offer: ProductOffer;
  onSave: (offer: ProductOffer) => void;
}) {
  const [draft, setDraft] = useState(offer);

  return (
    <div className="grid gap-2 rounded-xl bg-beige/40 p-3 sm:grid-cols-6">
      <input
        value={draft.label}
        onChange={(e) => setDraft({ ...draft, label: e.target.value })}
        placeholder="التسمية"
        className="rounded-lg border border-champagne/20 px-3 py-2 text-xs sm:col-span-2"
      />
      <input
        value={draft.display_label ?? ""}
        onChange={(e) =>
          setDraft({ ...draft, display_label: e.target.value })
        }
        placeholder="عرض العرض"
        className="rounded-lg border border-champagne/20 px-3 py-2 text-xs sm:col-span-2"
      />
      <input
        type="number"
        value={draft.quantity}
        onChange={(e) =>
          setDraft({ ...draft, quantity: Number(e.target.value) })
        }
        placeholder="الكمية"
        className="rounded-lg border border-champagne/20 px-3 py-2 text-xs"
      />
      <input
        type="number"
        value={draft.price}
        onChange={(e) =>
          setDraft({ ...draft, price: Number(e.target.value) })
        }
        placeholder="السعر"
        className="rounded-lg border border-champagne/20 px-3 py-2 text-xs"
      />
      <label className="flex items-center gap-2 text-xs sm:col-span-6">
        <input
          type="checkbox"
          checked={draft.is_recommended}
          onChange={(e) =>
            setDraft({ ...draft, is_recommended: e.target.checked })
          }
        />
        العرض الموصى به
      </label>
      <button
        type="button"
        onClick={() => onSave(draft)}
        className="rounded-full bg-foreground px-4 py-1.5 text-xs text-ivory sm:col-span-6 sm:w-fit"
      >
        حفظ العرض
      </button>
    </div>
  );
}

export function NewProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    name_ar: "",
    name_en: "",
    subtitle: "",
    description: "",
    price: "",
    original_price: "",
    badge: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      alert("اربط Supabase أولاً عبر .env.local");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: form.slug,
        name_ar: form.name_ar,
        name_en: form.name_en,
        subtitle: form.subtitle,
        description: form.description,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        badge: form.badge || null,
        is_featured: true,
        is_active: true,
      })
      .select("id")
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    if (data?.id) {
      router.push(`/admin/products/${data.id}/builder`);
      return;
    }
    router.refresh();
    setForm({
      slug: "",
      name_ar: "",
      name_en: "",
      subtitle: "",
      description: "",
      price: "",
      original_price: "",
      badge: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow"
    >
      <h2 className="mb-4 font-semibold">إضافة منتج جديد</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          Object.keys(form) as Array<keyof typeof form>
        ).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="rounded-xl border border-champagne/20 px-4 py-2.5 text-sm"
            required={["slug", "name_ar", "name_en", "price"].includes(key)}
          />
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 rounded-full bg-foreground px-6 py-2.5 text-sm text-ivory hover:bg-champagne"
      >
        إضافة المنتج
      </button>
    </form>
  );
}
