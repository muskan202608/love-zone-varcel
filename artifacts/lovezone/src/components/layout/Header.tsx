import { Link } from "wouter";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function Header() {
  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl text-primary tracking-tight">LoveZone</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
            <Link href="/states" className="transition-colors hover:text-foreground/80 text-foreground/60">States</Link>
            <Link href="/cities" className="transition-colors hover:text-foreground/80 text-foreground/60">Cities</Link>
            <Link href="/listings" className="transition-colors hover:text-foreground/80 text-foreground/60">Listings</Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="default" className="font-bold">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {phone}
              </a>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7 flex flex-col gap-6">
                <Link href="/" className="font-bold text-xl text-primary">LoveZone</Link>
                <div className="flex flex-col gap-4 text-sm">
                  <Link href="/" className="text-foreground/70">Home</Link>
                  <Link href="/states" className="text-foreground/70">States</Link>
                  <Link href="/cities" className="text-foreground/70">Cities</Link>
                  <Link href="/listings" className="text-foreground/70">Listings</Link>
                  <Link href="/about" className="text-foreground/70">About</Link>
                  <Link href="/contact" className="text-foreground/70">Contact</Link>
                </div>
                <div className="mt-4">
                  <Button asChild variant="default" className="w-full font-bold">
                    <a href={`tel:${phone.replace(/\D/g, "")}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {phone}
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}