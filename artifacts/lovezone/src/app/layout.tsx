import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayboyZone | Membership Platform",
  description: "Verified membership and digital ID platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
