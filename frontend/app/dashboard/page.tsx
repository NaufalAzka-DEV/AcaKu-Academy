"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { apiFetch, getStoredUser } from "@/lib/api";
import { formatCurrency, formatDate, serviceLabel } from "@/lib/utils";
import type { Order } from "@/lib/types";

type OrdersResponse = {
  orders: Order[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    apiFetch<OrdersResponse>("/orders/my")
      .then((result) => setOrders(result.orders))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <section className="bg-paper py-14">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-brand">Dashboard</p>
            <h1 className="mt-3 text-4xl font-black text-ink">Your orders.</h1>
          </div>
          <Link href="/order" className="btn-primary">
            New order
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8">
          {loading ? <div className="surface p-6 text-muted">Loading orders...</div> : null}
          {error ? <div className="surface p-6 font-bold text-red-700">{error}</div> : null}

          {!loading && !error && orders.length === 0 ? (
            <div className="surface p-8 text-center">
              <ClipboardList className="mx-auto text-brand" size={34} aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink">No orders yet</h2>
              <p className="mt-2 text-muted">Your academic service requests will appear here.</p>
            </div>
          ) : null}

          {orders.length > 0 ? (
            <div className="surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-line bg-white text-xs uppercase text-muted">
                    <tr>
                      <th className="px-5 py-4">Service</th>
                      <th className="px-5 py-4">Deadline</th>
                      <th className="px-5 py-4">Budget</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-5 py-4">
                          <p className="font-black text-ink">{serviceLabel(order.serviceType)}</p>
                          <p className="mt-1 line-clamp-1 max-w-md text-muted">{order.description}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-muted">{formatDate(order.deadline)}</td>
                        <td className="px-5 py-4 font-bold text-muted">{formatCurrency(order.budget)}</td>
                        <td className="px-5 py-4">
                          <StatusPill status={order.status} />
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/invoices/${order.invoiceId}`} className="font-black text-brand hover:text-brandDark">
                            {order.invoiceId}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
