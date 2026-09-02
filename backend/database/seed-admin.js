import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const email = process.env.ADMIN_EMAIL || "admin@acaku.academy";
const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const name = process.env.ADMIN_NAME || "Acaku Admin";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = 'admin'
     RETURNING id, email, role`,
    [name, email.toLowerCase(), passwordHash]
  );

  console.log(`Admin ready: ${result.rows[0].email} (${result.rows[0].id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
