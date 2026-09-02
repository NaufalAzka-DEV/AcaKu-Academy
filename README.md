# Acaku Academy

Acaku Academy is a production-ready MVP for academic services. Students can register, submit orders for assignment help, mentoring, or document review, track order status, contact admin through WhatsApp, and view simple HTML invoices. Admin users can view all orders and update statuses.

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Node.js, Express, JWT, Zod validation
- Database: PostgreSQL
- Deployment target: Vercel for frontend, Railway or Render for backend/API

## Project Structure

```txt
acaku-academy/
  frontend/
    app/
      admin/
      dashboard/
      invoices/[invoiceId]/
      login/
      order/
      register/
      services/
    components/
    lib/
    public/
  backend/
    database/
      001_init.sql
      seed-admin.js
    src/
      config/
      db/
      middleware/
      routes/
      utils/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL with Docker:

```bash
docker compose up -d
```

3. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

4. Update secrets in `backend/.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/acaku_academy
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:3000
```

5. Seed an admin user:

```bash
ADMIN_EMAIL=admin@acaku.academy ADMIN_PASSWORD=ChangeMe123! npm run seed:admin
```

6. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`

## API Endpoints

- `POST /api/auth/register` - create a student account
- `POST /api/auth/login` - login and receive JWT
- `GET /api/auth/me` - current authenticated user
- `POST /api/orders` - create order and invoice
- `GET /api/orders/my` - student order dashboard
- `GET /api/orders` - admin order list
- `PATCH /api/orders/:id/status` - admin status update
- `GET /api/invoices/:invoiceId` - invoice JSON
- `GET /api/invoices/:invoiceId/html` - printable HTML invoice
- `GET /api/health` - API health check

## Security Notes

- All SQL uses parameterized `pg` queries.
- Incoming bodies and route params are validated with Zod.
- Passwords are hashed with bcrypt.
- JWT authentication protects student, invoice, and admin routes.
- Admin routes require the `admin` role on the server.
- React escapes UI output by default, and the printable invoice escapes dynamic HTML.
- Helmet, CORS, request body limits, and auth rate limiting are enabled in Express.

## Database Schema

The schema is in `backend/database/001_init.sql` and includes:

- `users`: accounts with `user` or `admin` role
- `orders`: service requests with `pending`, `in_progress`, or `completed` status
- `invoices`: unique invoice IDs linked one-to-one with orders

## Deployment

### Frontend on Vercel

1. Create a Vercel project with `frontend` as the root directory.
2. Set:

```env
NEXT_PUBLIC_API_URL=https://your-api-host.com/api
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_WHATSAPP_MESSAGE=Halo Acaku Academy, saya ingin konsultasi layanan akademik.
```

3. Deploy with the included `frontend/vercel.json` settings.

### Backend on Railway

1. Create a Railway project from the `backend` directory.
2. Add a PostgreSQL database.
3. Set:

```env
NODE_ENV=production
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
ADMIN_WHATSAPP_NUMBER=6281234567890
```

4. Run `backend/database/001_init.sql` against the Railway database.
5. Seed an admin account with `npm run seed:admin`.

### Backend on Render

1. Create a Render web service using `backend` as the root directory.
2. Add a Render PostgreSQL database.
3. Use `backend/render.yaml` or configure the same build and start commands manually.
4. Run the SQL migration and seed admin credentials.

## MVP Workflows

- A student registers or logs in.
- The student submits an order with name, service type, description, deadline, and budget.
- The backend creates the order and a unique invoice ID.
- The student tracks status from the dashboard.
- An admin logs in, views all orders, and updates status.
- The student or admin opens the invoice detail page and printable HTML invoice.
