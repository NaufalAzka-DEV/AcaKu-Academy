import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { signToken } from "../utils/jwt.js";

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
    password: z.string().min(8).max(128)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
    password: z.string().min(1).max(128)
  })
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

authRouter.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.validated.body;
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const result = await query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'user')
         RETURNING id, name, email, role`,
        [name, email, passwordHash]
      );

      const user = result.rows[0];
      res.status(201).json({
        user: publicUser(user),
        token: signToken(user)
      });
    } catch (error) {
      if (error.code === "23505") {
        throw new HttpError(409, "Email is already registered");
      }

      throw error;
    }
  })
);

authRouter.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;
    const result = await query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      throw new HttpError(401, "Invalid email or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw new HttpError(401, "Invalid email or password");
    }

    res.json({
      user: publicUser(user),
      token: signToken(user)
    });
  })
);

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    user: publicUser(req.user)
  });
});
