import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  MessageSquareText,
  Sparkles,
  Users
} from "lucide-react";
import { services } from "@/lib/constants";

const testimonials = [
  {
    name: "Rani",
    role: "University student",
    quote: "The review was specific, honest, and easy to apply before submission."
  },
  {
    name: "Daffa",
    role: "High school student",
    quote: "Mentoring helped me turn a messy deadline week into a plan I could follow."
  },
  {
    name: "Maya",
    role: "Final-year student",
    quote: "My document came back clearer without losing my own voice."
  }
];

const serviceIcons = [BookOpenCheck, Users, FileSearch];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-black uppercase text-brand">
              <Sparkles size={15} aria-hidden="true" />
              Academic support, organized
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
              Acaku Academy
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Order assignment help, mentoring, and document review from one responsive student
              services platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn-primary">
                Start an order
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn-secondary">
                View services
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Fast intake", "Tracked status", "Simple invoices"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-muted">
                  <CheckCircle2 size={17} className="text-brand" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating around study materials"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["3", "Core services"],
                ["24h", "Initial response"],
                ["JWT", "Secure access"]
              ].map(([value, label]) => (
                <div key={label} className="surface p-4">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-xs font-bold text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-line bg-white py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-brand">Services</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
              Support for the parts of school that need a second brain.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = serviceIcons[index];

              return (
                <article key={service.type} className="surface p-6">
                  <Icon size={28} className="text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-black text-ink">{service.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{service.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-brand">How it works</p>
            <h2 className="mt-3 text-3xl font-black text-ink">A clear path from request to result.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Submit", "Share the service, brief, deadline, and budget."],
              ["Track", "Follow the order status from the dashboard."],
              ["Receive", "Get updates, invoice details, and admin contact."]
            ].map(([title, text], index) => (
              <div key={title} className="surface p-5">
                <div className="grid size-9 place-items-center rounded-md bg-ink text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-black text-ink">{title}</h3>
                <p className="mt-2 leading-7 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-16">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-brand">Testimonials</p>
              <h2 className="mt-3 text-3xl font-black text-ink">Student feedback, kept practical.</h2>
            </div>
            <MessageSquareText size={36} className="text-accent" aria-hidden="true" />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.name} className="surface p-6">
                <blockquote className="leading-7 text-muted">"{item.quote}"</blockquote>
                <figcaption className="mt-5">
                  <p className="font-black text-ink">{item.name}</p>
                  <p className="text-sm font-bold text-muted">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="container-page flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-orange-300">Ready when the brief is</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
              Create an order and keep the whole request traceable.
            </h2>
          </div>
          <Link href="/order" className="btn-primary bg-accent hover:bg-orange-700">
            Order now
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
