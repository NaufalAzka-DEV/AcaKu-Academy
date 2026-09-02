import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileSearch, Users } from "lucide-react";
import { services } from "@/lib/constants";

const icons = [BookOpenCheck, Users, FileSearch];

export default function ServicesPage() {
  return (
    <section className="bg-paper py-14 sm:py-18">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-brand">Services</p>
          <h1 className="mt-3 text-4xl font-black text-ink sm:text-5xl">
            Academic help with a clear scope.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Choose the service that matches the student workflow, then send the brief through the
            order form for tracking and invoicing.
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {services.map((service, index) => {
            const Icon = icons[index];

            return (
              <article key={service.type} className="surface grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-start">
                <div className="grid size-12 place-items-center rounded-md bg-brand/10 text-brand">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-ink">{service.title}</h2>
                  <p className="mt-3 max-w-3xl leading-7 text-muted">{service.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.details.map((detail) => (
                      <span key={detail} className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-muted">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/order?service=${service.type}`} className="btn-secondary md:self-center">
                  Order
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
