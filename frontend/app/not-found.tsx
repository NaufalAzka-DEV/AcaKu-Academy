import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-paper py-20">
      <div className="container-page max-w-xl text-center">
        <div className="surface p-8">
          <p className="text-sm font-black uppercase text-brand">404</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Page not found</h1>
          <p className="mt-3 text-muted">The page you are looking for is not available.</p>
          <Link href="/" className="btn-primary mt-6">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
