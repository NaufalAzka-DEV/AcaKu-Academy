import { Router } from "express";
import { z } from "zod";
import { pool, query } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateInvoiceId } from "../utils/invoice.js";

export const ordersRouter = Router();

const serviceTypes = ["assignment_help", "mentoring", "document_review"];
const statuses = ["pending", "in_progress", "completed"];

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}, "Invalid date");

const createOrderSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    serviceType: z.enum(serviceTypes),
    description: z.string().trim().min(10).max(3000),
    deadline: dateString,
    budget: z.coerce.number().min(0).max(999999999.99)
  })
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(statuses)
  })
});

function orderSelect() {
  return `SELECT
    o.id,
    o.customer_name AS "customerName",
    o.service_type AS "serviceType",
    o.description,
    o.deadline,
    o.budget,
    o.status,
    o.created_at AS "createdAt",
    o.updated_at AS "updatedAt",
    u.name AS "userName",
    u.email AS "userEmail",
    i.invoice_id AS "invoiceId"
  FROM orders o
  JOIN users u ON u.id = o.user_id
  LEFT JOIN invoices i ON i.order_id = o.id`;
}

ordersRouter.post(
  "/",
  requireAuth,
  validate(createOrderSchema),
  asyncHandler(async (req, res) => {
    const { name, serviceType, description, deadline, budget } = req.validated.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `INSERT INTO orders (user_id, customer_name, service_type, description, deadline, budget)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [req.user.id, name, serviceType, description, deadline, budget]
      );

      const orderId = orderResult.rows[0].id;
      const invoiceId = generateInvoiceId();

      await client.query(
        `INSERT INTO invoices (invoice_id, order_id, amount)
         VALUES ($1, $2, $3)`,
        [invoiceId, orderId, budget]
      );

      const created = await client.query(`${orderSelect()} WHERE o.id = $1`, [orderId]);

      await client.query("COMMIT");

      res.status(201).json({
        order: created.rows[0]
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  })
);

ordersRouter.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query(
      `${orderSelect()} WHERE o.user_id = $1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      orders: result.rows
    });
  })
);

ordersRouter.get(
  "/",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (_req, res) => {
    const result = await query(`${orderSelect()} ORDER BY o.created_at DESC`);

    res.json({
      orders: result.rows
    });
  })
);

ordersRouter.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  validate(updateStatusSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.validated.params;
    const { status } = req.validated.body;

    const result = await query(
      `${orderSelect()} WHERE o.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const updated = await query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING id`,
      [status, id]
    );

    const order = await query(`${orderSelect()} WHERE o.id = $1`, [updated.rows[0].id]);

    res.json({
      order: order.rows[0]
    });
  })
);
