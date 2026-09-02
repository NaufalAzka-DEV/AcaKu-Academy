import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-6 py-10 text-sm text-muted md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-black text-ink">Acaku Academy</p>
          <p className="mt-2 max-w-md">
            Academic services for students who need structure, clarity, and careful review.
          </p>
        </div>
        <div className="grid gap-2">
          <Link href="/services" className="font-bold hover:text-brand">
            Services
          </Link>
          <Link href="/order" className="font-bold hover:text-brand">
            Order
          </Link>
          <Link href="/dashboard" className="font-bold hover:text-brand">
            Dashboard
          </Link>
        </div>
        <div>
          <p className="font-bold text-ink">Built for MVP launch</p>
          <p className="mt-2">Next.js, Express, PostgreSQL, JWT, and role-based access.</p>
        </div>
      </div>
    </footer>
  );
}
