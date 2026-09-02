"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { clearSession, getStoredUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/order", label: "Order" },
  { href: "/dashboard", label: "Dashboard" }
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("acaku-auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("acaku-auth-change", syncUser);
    };
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-black text-ink">
          <span className="grid size-10 place-items-center rounded-md bg-ink text-white">
            <GraduationCap size={21} aria-hidden="true" />
          </span>
          <span>Acaku Academy</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-bold text-muted transition hover:bg-white hover:text-ink",
                pathname === item.href && "bg-white text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-muted transition hover:bg-white hover:text-ink",
                pathname === "/admin" && "bg-white text-ink"
              )}
            >
              <ShieldCheck size={16} aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-40 truncate text-sm font-bold text-muted sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary px-3 py-2"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={17} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary px-4 py-2">
                Login
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-line bg-white md:hidden">
        <nav className="container-page flex gap-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold text-muted",
                pathname === item.href && "bg-paper text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold text-muted",
                pathname === "/admin" && "bg-paper text-ink"
              )}
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
