import crypto from "node:crypto";
import { escapeHtml } from "./escape-html.js";

const serviceLabels = {
  assignment_help: "Assignment Help",
  mentoring: "Mentoring",
  document_review: "Document Review"
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed"
};

export function generateInvoiceId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ACAKU-${date}-${token}`;
}

export function invoiceHtml(invoice) {
  const amount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(invoice.amount));

  const issuedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(invoice.issuedAt));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${escapeHtml(invoice.invoiceId)} - Acaku Academy</title>
  <style>
    :root { color: #17201a; background: #f7f7f4; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; padding: 40px 16px; }
    main { max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #dbe3dd; border-radius: 8px; padding: 32px; }
    header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #dbe3dd; padding-bottom: 24px; }
    h1 { margin: 0; font-size: 32px; line-height: 1.1; }
    h2 { margin: 32px 0 12px; font-size: 16px; text-transform: uppercase; }
    p { margin: 6px 0; color: #4c5a50; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 14px 0; border-bottom: 1px solid #dbe3dd; text-align: left; }
    th:last-child, td:last-child { text-align: right; }
    .total { font-size: 20px; font-weight: 800; }
    .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #e7f7f3; color: #0f766e; font-weight: 700; }
    @media print { body { background: #fff; padding: 0; } main { border: 0; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Invoice</h1>
        <p>Acaku Academy</p>
      </div>
      <div>
        <p><strong>${escapeHtml(invoice.invoiceId)}</strong></p>
        <p>${escapeHtml(issuedAt)}</p>
        <p><span class="badge">${escapeHtml(statusLabels[invoice.status] || invoice.status)}</span></p>
      </div>
    </header>

    <h2>Bill To</h2>
    <p>${escapeHtml(invoice.customerName)}</p>
    <p>${escapeHtml(invoice.email)}</p>

    <h2>Order</h2>
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Deadline</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(serviceLabels[invoice.serviceType] || invoice.serviceType)}</td>
          <td>${escapeHtml(invoice.deadline)}</td>
          <td>${escapeHtml(amount)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" class="total">Total</td>
          <td class="total">${escapeHtml(amount)}</td>
        </tr>
      </tfoot>
    </table>
  </main>
</body>
</html>`;
}
