import type { Metadata } from "next";
import "./globals.css";
import { createMetadata } from "../lib/seo";
import { readDatabase } from "../lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await readDatabase();
  return {
    ...createMetadata(settings, "home"),
    icons: { icon: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
