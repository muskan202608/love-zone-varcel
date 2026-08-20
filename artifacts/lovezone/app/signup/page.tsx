import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";
import { Header } from "../../components/header";
import { createMetadata } from "../../lib/seo";
import { readDatabase } from "../../lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await readDatabase();
  return createMetadata(settings, "signup");
}

export default function SignupPage() { return <div className="shell"><Header /><main className="grid min-h-[calc(100vh-74px)] place-items-center bg-[radial-gradient(50%_36%_at_50%_0%,rgba(255,0,0,.16),transparent_100%)] px-5 py-12"><AuthForm mode="signup" /></main></div>; }
