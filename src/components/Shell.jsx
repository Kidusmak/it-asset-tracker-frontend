"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

const LINKS = [
  { href: "/assets", label: "Assets" },
  { href: "/my-assets", label: "My assets" },
  { href: "/categories", label: "Categories" },
];

export default function Shell({ children }) {
  const { auth, user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!ready) return;
    if (!auth && !isPublic) router.replace("/login");
    if (auth && isPublic) router.replace("/assets");
  }, [ready, auth, isPublic, router]);

  if (!ready) return <p className="muted center">Loading...</p>;
  if (!auth && !isPublic) return null;

  return (
    <>
      {auth && (
        <header className="nav">
          <span className="brand">IT Asset Tracker</span>
          <nav>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="user">
            <span>
              {user.username}
              {user.role ? ` (${user.role.replace("ROLE_", "")})` : ""}
            </span>
            <button className="ghost" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
      )}
      <main className="container">{children}</main>
    </>
  );
}
