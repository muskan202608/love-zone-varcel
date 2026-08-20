import { Link } from "wouter";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function Footer() {
  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container max-w-screen-2xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="font-bold text-2xl text-primary mb-4 block">LoveZone</Link>
            <p className="text-sm text-muted-foreground mb-4">
              India's premium directory for verified male escorts. Safe, discreet, and reliable.
            </p>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="font-bold text-lg text-foreground hover:text-primary transition-colors">
              {phone}
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/states" className="hover:text-primary transition-colors">States</Link></li>
              <li><Link href="/cities" className="hover:text-primary transition-colors">Cities</Link></li>
              <li><Link href="/listings" className="hover:text-primary transition-colors">Listings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LoveZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}