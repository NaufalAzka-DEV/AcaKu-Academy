"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { apiFetch, saveSession } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthPayload = {
  user: User;
  token: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = await apiFetch<AuthPayload>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession(auth);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-paper py-14">
      <div className="container-page max-w-xl">
        <div className="surface p-6 sm:p-8">
          <p className="text-sm font-black uppercase text-brand">Register</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Create your student account.</h1>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="label">Name</span>
              <input
                className="field"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="label">Email</span>
              <input
                className="field"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="label">Password</span>
              <input
                className="field"
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
            <button type="submit" className="btn-primary" disabled={loading}>
              <UserPlus size={18} aria-hidden="true" />
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted">
            Already registered?{" "}
            <Link href="/login" className="font-black text-brand">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
