"use client";

import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { apiFetch, getStoredUser } from "@/lib/api";
import { statuses } from "@/lib/constants";
import { formatCurrency, formatDate, serviceLabel, statusLabel } from "@/lib/utils";
import type { Order, OrderStatus, User } from "@/lib/types";

type OrdersResponse = {
  orders: Order[];
};

type OrderResponse = {
  order: Order;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    apiFetch<OrdersResponse>("/orders")
      .then((result) => setOrders(result.orders))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load admin orders"))
      .finally(() => setLoading(false));
  }, [isAdmin, ready]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    setError("");

    try {
      const result = await apiFetch<OrderResponse>(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });

      setOrders((current) => current.map((order) => (order.id === orderId ? result.order : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!ready) {
    return (
      <section className="bg-paper py-14">
        <div className="container-page">
          <div className="surface p-6 text-muted">Loading admin panel...</div>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="bg-paper py-14">
        <div className="container-page max-w-2xl">
          <div className="surface p-8">
            <ShieldAlert size={34} className="text-accent" aria-hidden="true" />
            <h1 className="mt-4 text-3xl font-black text-ink">Admin access required.</h1>
            <p className="mt-3 leading-7 text-muted">
              Login with an admin account to view and update all student orders.
            </p>
            <Link href="/login" className="btn-primary mt-6">
              Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper py-14">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-brand">
              <ShieldCheck size={17} aria-hidden="true" />
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black text-ink">All orders.</h1>
          </div>
        </div>

        <div className="mt-8">
          {loading ? <div className="surface p-6 text-muted">Loading orders...</div> : null}
          {error ? <div className="surface mb-4 p-6 font-bold text-red-700">{error}</div> : null}

          {!loading && orders.length === 0 ? (
            <div className="surface p-8 text-center text-muted">No orders have been submitted.</div>
          ) : null}

          {orders.length > 0 ? (
            <div className="surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="border-b border-line bg-white text-xs uppercase text-muted">
                    <tr>
                      <th className="px-5 py-4">Student</th>
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
                          <p className="font-black text-ink">{order.customerName}</p>
                          <p className="mt-1 text-muted">{order.userEmail}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-black text-ink">{serviceLabel(order.serviceType)}</p>
                          <p className="mt-1 line-clamp-1 max-w-md text-muted">{order.description}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-muted">{formatDate(order.deadline)}</td>
                        <td className="px-5 py-4 font-bold text-muted">{formatCurrency(order.budget)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <StatusPill status={order.status} />
                            <select
                              className="field min-h-10 w-40 py-2"
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabel(status)}
                                </option>
                              ))}
                            </select>
                          </div>
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
