export const dynamic = "force-dynamic";

import { getAllOrders } from "@/lib/supabase/queries";
import OrdersManager from "./OrdersManager";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">إدارة الطلبات</h1>
        <p className="mt-1 text-sm text-muted">
          جميع طلبات الدفع عند الاستلام (COD)
        </p>
      </div>
      <OrdersManager initialOrders={orders} />
    </div>
  );
}
