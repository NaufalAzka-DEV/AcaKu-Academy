import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { invoiceHtml } from "../utils/invoice.js";

export const invoicesRouter = Router();

const invoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string().trim().min(8).max(64)
  })
});

function invoiceSelect() {
  return `SELECT
    i.invoice_id AS "invoiceId",
    i.amount,
    i.issued_at AS "issuedAt",
    o.id AS "orderId",
    o.customer_name AS "customerName",
    o.service_type AS "serviceType",
    o.description,
    o.deadline,
    o.status,
    o.user_id AS "userId",
    u.email,
    u.name AS "accountName"
  FROM invoices i
  JOIN orders o ON o.id = i.order_id
  JOIN users u ON u.id = o.user_id
  WHERE i.invoice_id = $1`;
}

async function loadInvoice(req) {
  const { invoiceId } = req.validated.params;
  const result = await query(invoiceSelect(), [invoiceId]);

  if (result.rowCount === 0) {
    throw new HttpError(404, "Invoice not found");
  }

  const invoice = result.rows[0];

  if (req.user.role !== "admin" && invoice.userId !== req.user.id) {
    throw new HttpError(403, "You do not have access to this invoice");
  }

  return invoice;
}

invoicesRouter.get(
  "/:invoiceId",
  requireAuth,
  validate(invoiceSchema),
  asyncHandler(async (req, res) => {
    const invoice = await loadInvoice(req);

    res.json({
      invoice
    });
  })
);

invoicesRouter.get(
  "/:invoiceId/html",
  requireAuth,
  validate(invoiceSchema),
  asyncHandler(async (req, res) => {
    const invoice = await loadInvoice(req);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(invoiceHtml(invoice));
  })
);
