import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import type { Listing } from "@workspace/api-client-react/src/generated/api.schemas";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function ListingCard({ listing }: { listing: Listing }) {
  const { data: settings } = useGetSiteSettings();
  const phone = listing.phone || settings?.phoneNumber || "+91 8929364337";
  const whatsapp = listing.whatsapp || settings?.whatsappNumber || "+91 8929364337";

  return (
    <Card className="overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300">
      <div className="aspect-[4/3] w-full bg-muted relative">
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold text-xl">
            {listing.name.charAt(0)}
          </div>
        )}
        {listing.isFeatured && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-primary/90 text-primary-foreground">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs font-semibold">
            {listing.age} y/o
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight truncate pr-2">{listing.name}</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <span className="font-medium text-foreground/80">{listing.cityName}</span>, {listing.stateName}
        </p>
        
        {listing.services && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
            {listing.services}
          </p>
        )}

        <div className="flex gap-2 mt-auto">
          <Button asChild variant="default" size="sm" className="flex-1 font-bold">
            <a href={`tel:${phone.replace(/\D/g, "")}`}>
              <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
            </a>
          </Button>
          <Button asChild variant="secondary" size="sm" className="flex-1 font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20">
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}