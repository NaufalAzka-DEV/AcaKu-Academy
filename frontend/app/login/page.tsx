"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { apiFetch, saveSession } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthPayload = {
  user: User;
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = await apiFetch<AuthPayload>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      saveSession(auth);
      router.push(auth.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-paper py-14">
      <div className="container-page max-w-xl">
        <div className="surface p-6 sm:p-8">
          <p className="text-sm font-black uppercase text-brand">Login</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Welcome back.</h1>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="label">Email</span>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="label">Password</span>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
            <button type="submit" className="btn-primary" disabled={loading}>
              <LogIn size={18} aria-hidden="true" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted">
            New to Acaku?{" "}
            <Link href="/register" className="font-black text-brand">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
