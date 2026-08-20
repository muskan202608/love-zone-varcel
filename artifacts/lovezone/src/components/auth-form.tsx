"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { cacheAuthSession } from "../lib/client-auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signUp = mode === "signup";
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const form = event.currentTarget;
      const response = signUp ? await fetch("/api/auth/signup", { method: "POST", body: new FormData(form) }) : await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: new FormData(form).get("username"), password: new FormData(form).get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to continue.");
      if (signUp) {
        router.replace("/login?registered=1");
      } else {
        const redirectTo = result.redirectTo === "/admin" ? "/admin" : "/member";
        cacheAuthSession({ role: result.role === "admin" ? "admin" : "member", redirectTo });
        router.replace(redirectTo);
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to continue."); } finally { setLoading(false); }
  };
  return <form className="surface grid w-full max-w-xl gap-5 p-6 sm:p-9" onSubmit={submit}><div><p className="eyebrow">{signUp ? "Member registration" : "Secure access"}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">{signUp ? "Create your profile" : "Welcome back"}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{signUp ? "Complete your details for a professional membership review." : "Sign in to your member account or administrator workspace."}</p></div>{signUp && <div className="grid gap-4 sm:grid-cols-2"><label className="field-label">Name<input className="field" name="name" required /></label><label className="field-label">Mobile Number<input className="field" name="mobile" inputMode="numeric" pattern="[0-9]{10,15}" required /></label><label className="field-label">City<input className="field" name="city" required /></label><label className="field-label">State<input className="field" name="state" required /></label><label className="field-label">Date of Birth<input className="field" name="dateOfBirth" type="date" required /></label><label className="field-label">Body Weight<input className="field" name="bodyWeight" placeholder="e.g. 72 kg" required /></label></div>}<div className="grid gap-4 sm:grid-cols-2"><label className="field-label">{signUp ? "Email" : "Username or email"}<input className="field" name={signUp ? "email" : "username"} type={signUp ? "email" : "text"} required /></label><label className="field-label">Password<input className="field" name="password" type="password" minLength={6} required /></label></div>{signUp && <label className="field-label">Profile Photo<input className="field" name="photo" type="file" accept="image/*" required /></label>}{error && <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm text-red-200">{error}</p>}<button className="button-primary w-full" disabled={loading}>{loading ? "Please wait…" : signUp ? "Submit application" : "Login"}</button><p className="text-center text-sm text-zinc-500">{signUp ? "Already registered?" : "New to PlayboyZone?"} <Link className="font-semibold text-red-400 hover:text-red-300" href={signUp ? "/login" : "/signup"}>{signUp ? "Login" : "Join now"}</Link></p></form>;
}
