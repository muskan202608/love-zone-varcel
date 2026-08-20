import type { GetServerSideProps } from "next";
import { stateSeoPages } from "../lib/seo-states";

const xmlEscape = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] || character);

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const siteUrl = configuredUrl || (host ? `${protocol}://${host}` : "https://playboyzone.in");
  const lastModified = new Date().toISOString();
  const urls = ["/", ...stateSeoPages.map((state) => `/${state.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${xmlEscape(`${siteUrl}${url}`)}</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>${url === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
