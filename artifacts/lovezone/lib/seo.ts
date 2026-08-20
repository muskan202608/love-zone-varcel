import type { Metadata } from "next";
import type { SeoKey, SiteSettings } from "./types";

export const createMetadata = (settings: SiteSettings, page: SeoKey): Metadata => {
  const seo = settings.seo[page];
  const keywords = seo.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean);
  return {
    title: seo.title,
    description: seo.description,
    keywords,
    robots: page === "member" ? { index: false, follow: false } : undefined,
  };
};
