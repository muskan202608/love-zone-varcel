import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable, statesTable, citiesTable, seoPagesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [listingCount] = await db.select({ count: sql<number>`count(*)::int` }).from(listingsTable);
  const [stateCount] = await db.select({ count: sql<number>`count(*)::int` }).from(statesTable);
  const [cityCount] = await db.select({ count: sql<number>`count(*)::int` }).from(citiesTable);
  const [seoCount] = await db.select({ count: sql<number>`count(*)::int` }).from(seoPagesTable);
  const [featuredCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.isFeatured, true));
  const [activeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.isActive, true));

  res.json({
    totalListings: listingCount?.count ?? 0,
    totalStates: stateCount?.count ?? 0,
    totalCities: cityCount?.count ?? 0,
    totalSeoPages: seoCount?.count ?? 0,
    featuredListings: featuredCount?.count ?? 0,
    activeListings: activeCount?.count ?? 0,
  });
});

export default router;
