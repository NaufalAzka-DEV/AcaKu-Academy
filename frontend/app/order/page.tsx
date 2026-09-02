"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClipboardPlus, FileText } from "lucide-react";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { apiFetch, getStoredUser } from "@/lib/api";
import { serviceLabels, services } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Order, ServiceType, User } from "@/lib/types";

type OrderResponse = {
  order: Order;
};

const initialForm = {
  name: "",
  serviceType: "assignment_help" as ServiceType,
  description: "",
  deadline: "",
  budget: ""
};

function isServiceType(value: string | null): value is ServiceType {
  return services.some((service) => service.type === value);
}

function OrderForm() {
  const params = useSearchParams();
  const requestedService = params.get("service");
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState(initialForm);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const minDeadline = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setReady(true);

    setForm((current) => ({
      ...current,
      name: storedUser?.name || current.name,
      serviceType: isServiceType(requestedService) ? requestedService : current.serviceType
    }));
  }, [requestedService]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCreatedOrder(null);

    try {
      const payload = {
        ...form,
        budget: Number(form.budget)
      };
      const result = await apiFetch<OrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setCreatedOrder(result.order);
      setForm((current) => ({
        ...initialForm,
        name: current.name,
        serviceType: current.serviceType
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create order");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <div className="surface p-6 text-muted">Loading order form...</div>;
  }

  if (!user) {
    return (
      <div className="surface p-6 sm:p-8">
        <p className="text-sm font-black uppercase text-brand">Order</p>
        <h1 className="mt-3 text-3xl font-black text-ink">Login to start an order.</h1>
        <p className="mt-4 leading-7 text-muted">
          Orders are attached to your account so you can track status and invoice details.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary">
            Login
          </Link>
          <Link href="/register" className="btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <form onSubmit={handleSubmit} className="surface grid gap-5 p-6 sm:p-8">
        <div>
          <p className="text-sm font-black uppercase text-brand">Order</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Tell us what you need.</h1>
        </div>

        <label className="grid gap-2">
          <span className="label">Name</span>
          <input
            className="field"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="label">Service type</span>
          <select
            className="field"
            value={form.serviceType}
            onChange={(event) =>
              setForm((current) => ({ ...current, serviceType: event.target.value as ServiceType }))
            }
          >
            {services.map((service) => (
              <option key={service.type} value={service.type}>
                {service.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="label">Description</span>
          <textarea
            className="field min-h-36 resize-y"
            value={form.description}
            minLength={10}
            maxLength={3000}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Deadline</span>
            <input
              className="field"
              type="date"
              min={minDeadline}
              value={form.deadline}
              onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="label">Budget</span>
            <input
              className="field"
              type="number"
              min="0"
              step="1000"
              value={form.budget}
              onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
              required
            />
          </label>
        </div>

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}

        <button type="submit" className="btn-primary" disabled={loading}>
          <ClipboardPlus size={18} aria-hidden="true" />
          {loading ? "Submitting..." : "Submit order"}
        </button>
      </form>

      <aside className="grid gap-4 self-start">
        <div className="surface p-6">
          <p className="text-sm font-black uppercase text-brand">Selected service</p>
          <h2 className="mt-3 text-2xl font-black text-ink">{serviceLabels[form.serviceType]}</h2>
          <p className="mt-3 leading-7 text-muted">
            Include the rubric, target format, citation style, and any lecturer notes in the
            description.
          </p>
          {form.budget ? (
            <p className="mt-5 text-sm font-bold text-muted">
              Budget preview: <span className="text-ink">{formatCurrency(form.budget)}</span>
            </p>
          ) : null}
        </div>

        {createdOrder ? (
          <div className="surface border-brand/30 bg-emerald-50 p-6">
            <FileText size={24} className="text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-ink">Order created</h2>
            <p className="mt-2 text-sm font-bold text-muted">Invoice {createdOrder.invoiceId}</p>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/dashboard" className="btn-primary">
                View dashboard
              </Link>
              <Link href={`/invoices/${createdOrder.invoiceId}`} className="btn-secondary">
                View invoice
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export default function OrderPage() {
  return (
    <section className="bg-paper py-14">
      <div className="container-page">
        <Suspense fallback={<div className="surface p-6 text-muted">Loading order form...</div>}>
          <OrderForm />
        </Suspense>
      </div>
    </section>
  );
}
