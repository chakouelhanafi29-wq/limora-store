import Link from "next/link";

export default function SchemaSetupBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="font-semibold text-amber-900">
        قاعدة البيانات غير مكتملة — بعض جداول Supabase مفقودة
      </p>
      <p className="mt-1 text-sm text-amber-900/80">
        شغّلي ملفات SQL في Supabase SQL Editor لإكمال الإعداد دون تعطيل لوحة التحكم.
      </p>
      <Link
        href="/admin/setup"
        className="mt-3 inline-block text-sm font-medium text-champagne hover:underline"
      >
        عرض خطوات الإعداد ←
      </Link>
    </div>
  );
}
