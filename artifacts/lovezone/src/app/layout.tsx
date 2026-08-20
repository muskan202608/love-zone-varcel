import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "PlayboyZone | Verified Membership Platform",
    template: "%s | PlayboyZone",
  },
  description: "Join PlayboyZone for verified membership, professional opportunities, and secure digital identification.",
  keywords: ["PlayboyZone", "verified membership", "digital ID", "professional opportunities"],
  openGraph: {
    type: "website",
    siteName: "PlayboyZone",
    title: "PlayboyZone | Verified Membership Platform",
    description: "Verified membership, professional opportunities, and secure digital identification.",
    images: [{ url: "/opengraph.jpg", width: 1200, height: 630, alt: "PlayboyZone verified membership platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayboyZone | Verified Membership Platform",
    description: "Verified membership and secure digital identification.",
    images: ["/opengraph.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
