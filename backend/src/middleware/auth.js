import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const result = await query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [payload.sub]
    );

    if (result.rowCount === 0) {
      throw new HttpError(401, "Account no longer exists");
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(401, "Invalid or expired token");
  }
});

export function requireRole(role) {
  return (req, _res, next) => {
    if (req.user?.role !== role) {
      return next(new HttpError(403, "You do not have access to this resource"));
    }

    return next();
  };
}
