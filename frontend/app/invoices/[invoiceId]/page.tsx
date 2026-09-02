"use client";

import { useParams, useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import { API_BASE_URL, apiFetch, getStoredUser, getToken } from "@/lib/api";
import { formatCurrency, formatDate, serviceLabel } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

type InvoiceResponse = {
  invoice: Invoice;
};

export default function InvoicePage() {
  const params = useParams<{ invoiceId: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingHtml, setOpeningHtml] = useState(false);

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    apiFetch<InvoiceResponse>(`/invoices/${params.invoiceId}`)
      .then((result) => setInvoice(result.invoice))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load invoice"))
      .finally(() => setLoading(false));
  }, [params.invoiceId, router]);

  async function openPrintableInvoice() {
    setOpeningHtml(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${params.invoiceId}/html`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("Unable to open printable invoice");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open printable invoice");
    } finally {
      setOpeningHtml(false);
    }
  }

  return (
    <section className="bg-paper py-14">
      <div className="container-page max-w-4xl">
        {loading ? <div className="surface p-6 text-muted">Loading invoice...</div> : null}
        {error ? <div className="surface mb-4 p-6 font-bold text-red-700">{error}</div> : null}

        {invoice ? (
          <div className="surface overflow-hidden">
            <div className="flex flex-col justify-between gap-5 border-b border-line bg-white p-6 sm:flex-row sm:items-start sm:p-8">
              <div>
                <p className="text-sm font-black uppercase text-brand">Invoice</p>
                <h1 className="mt-3 text-3xl font-black text-ink">{invoice.invoiceId}</h1>
                <p className="mt-2 text-muted">Issued {formatDate(invoice.issuedAt)}</p>
              </div>
              <StatusPill status={invoice.status} />
            </div>

            <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
              <div>
                <h2 className="text-sm font-black uppercase text-muted">Bill to</h2>
                <p className="mt-3 text-xl font-black text-ink">{invoice.customerName}</p>
                <p className="mt-1 text-muted">{invoice.email}</p>
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-muted">Service</h2>
                <p className="mt-3 text-xl font-black text-ink">{serviceLabel(invoice.serviceType)}</p>
                <p className="mt-1 text-muted">Deadline {formatDate(invoice.deadline)}</p>
              </div>
            </div>

            <div className="border-y border-line bg-paper p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-black uppercase text-muted">Amount</p>
                  <p className="mt-2 text-4xl font-black text-ink">{formatCurrency(invoice.amount)}</p>
                </div>
                <button type="button" onClick={openPrintableInvoice} className="btn-primary" disabled={openingHtml}>
                  <FileText size={18} aria-hidden="true" />
                  {openingHtml ? "Opening..." : "Printable HTML"}
                  <ExternalLink size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase text-muted">Description</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-muted">{invoice.description}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
