export const dynamic = "force-dynamic";

import { getCustomersFromOrders } from "@/lib/supabase/queries";

export default async function AdminCustomersPage() {
  const customers = await getCustomersFromOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">العملاء</h1>
        <p className="mt-1 text-sm text-muted">
          قائمة العملاء من طلبات COD
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-champagne/10 bg-white luxury-shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-champagne/10 bg-beige/30 text-muted">
              <th className="px-4 py-3 text-right">الاسم</th>
              <th className="px-4 py-3 text-right">الجوال</th>
              <th className="px-4 py-3 text-right">المدينة</th>
              <th className="px-4 py-3 text-right">عدد الطلبات</th>
              <th className="px-4 py-3 text-right">إجمالي الإنفاق</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  لا يوجد عملاء بعد
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.phone} className="border-b border-champagne/5">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3">{c.city}</td>
                  <td className="px-4 py-3">{c.orders.length}</td>
                  <td className="px-4 py-3">
                    {c.orders.reduce((s, o) => s + Number(o.total_price), 0)}{" "}
                    ر.س
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
