"use client";

import { useEffect, useState } from "react";
import {
  formatAdminDateTime,
  formatAdminMoney,
} from "@/lib/admin/format";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/lib/types/database";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusLabels: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const platformColors: Record<string, string> = {
  facebook: "bg-blue-100 text-blue-700",
  tiktok: "bg-foreground/10 text-foreground",
  snapchat: "bg-yellow-100 text-yellow-800",
  google: "bg-emerald-100 text-emerald-700",
  organic: "bg-teal-100 text-teal-700",
  direct: "bg-beige text-muted",
};

export default function OrdersManager({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
          if (data) setOrders(data as Order[]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-champagne/10 bg-white luxury-shadow">
      {orders.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted">
          لا توجد طلبات بعد
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-champagne/10 bg-beige/30 text-muted">
              <th className="px-4 py-3 text-right">العميل</th>
              <th className="px-4 py-3 text-right">المنتج</th>
              <th className="px-4 py-3 text-right">المبلغ</th>
              <th className="px-4 py-3 text-right">المصدر</th>
              <th className="px-4 py-3 text-right">الحملة</th>
              <th className="px-4 py-3 text-right">الجهاز</th>
              <th className="px-4 py-3 text-right">الحالة</th>
              <th className="px-4 py-3 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-champagne/5">
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-xs text-muted" dir="ltr">
                    {order.phone}
                  </p>
                  <p className="text-xs text-muted">{order.city}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{order.product_name}</p>
                  <p className="text-xs text-muted">{order.offer_label}</p>
                </td>
                <td className="px-4 py-3">{formatAdminMoney(order.total_price)}</td>
                <td className="px-4 py-3">
                  {order.traffic_source ? (
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        platformColors[order.traffic_platform ?? "direct"] ??
                        platformColors.direct
                      }`}
                    >
                      {order.traffic_source}
                    </span>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {order.utm_campaign ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {order.device_type ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="rounded-lg border border-champagne/20 bg-white px-2 py-1 text-xs"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatAdminDateTime(order.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
