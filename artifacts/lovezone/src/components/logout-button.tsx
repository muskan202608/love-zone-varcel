"use client";

import { useRouter } from "next/navigation";
import { clearCachedAuthSession } from "../lib/client-auth";

export function LogoutButton() {
  const router = useRouter();
  return <button className="nav-link" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); clearCachedAuthSession(); router.replace("/"); router.refresh(); }}>Logout</button>;
}
