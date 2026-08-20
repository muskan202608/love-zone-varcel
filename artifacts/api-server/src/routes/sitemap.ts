import { Router } from "express";
import { db } from "@workspace/db";
import { statesTable, citiesTable, seoPagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/sitemap.xml", async (req, res): Promise<void> => {
  const host = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "https://lovezone.in";

  const states = await db.select().from(statesTable).orderBy(statesTable.name);
  const cities = await db.select().from(citiesTable).orderBy(citiesTable.name);
  const seoPages = await db
    .select()
    .from(seoPagesTable)
    .where(eq(seoPagesTable.isActive, true));

  const staticUrls = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/states", priority: "0.9", changefreq: "weekly" },
    { loc: "/cities", priority: "0.9", changefreq: "weekly" },
    { loc: "/listings", priority: "0.8", changefreq: "daily" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/contact", priority: "0.7", changefreq: "monthly" },
    { loc: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
    { loc: "/terms", priority: "0.5", changefreq: "yearly" },
  ];

  const stateUrls = states.map((s) => ({
    loc: `/state/${s.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const cityUrls = cities.map((c) => ({
    loc: `/city/${c.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const seoUrls = seoPages.map((p) => ({
    loc: `/${p.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allUrls = [...staticUrls, ...stateUrls, ...cityUrls, ...seoUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${host}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

router.get("/robots.txt", (_req, res): void => {
  const host = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "https://lovezone.in";

  const txt = `User-agent: *
Allow: /

Sitemap: ${host}/api/sitemap.xml`;

  res.set("Content-Type", "text/plain");
  res.send(txt);
});

export default router;
