import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { invoicesRouter } from "./routes/invoices.js";
import { ordersRouter } from "./routes/orders.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

const app = express();
const allowedOrigins = env.frontendUrl.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "Acaku Academy API",
    status: "online"
  });
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/invoices", invoicesRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Acaku Academy API running on port ${env.port}`);
});
