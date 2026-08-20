import Link from "next/link";
import { getSession } from "../lib/auth";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-xl">
      <div className="container flex h-[74px] items-center justify-between gap-3">
        <Link href="/" className="text-lg font-bold tracking-[-0.055em] text-white">Playboy<span className="text-[#ff0000]">Zone</span></Link>
        <nav className="flex items-center gap-1">
          <Link className="nav-link" href="/">Home</Link>
          {session?.role === "admin" ? <Link className="nav-link" href="/admin">Admin</Link> : session?.role === "member" ? <Link className="nav-link" href="/member">My ID</Link> : <Link className="nav-link" href="/login">Login</Link>}
          {session ? <LogoutButton /> : <Link className="button-primary !min-h-0 !rounded-lg !px-4 !py-2.5" href="/signup">Join Now</Link>}
        </nav>
      </div>
    </header>
  );
}
