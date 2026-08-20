import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import {
  CreateListingBody,
  UpdateListingBody,
  GetListingParams,
  UpdateListingParams,
  DeleteListingParams,
  ListListingsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/listings", async (req, res): Promise<void> => {
  const queryParams = ListListingsQueryParams.safeParse(req.query);

  const page = queryParams.success ? (queryParams.data.page ?? 1) : 1;
  const limit = queryParams.success ? (queryParams.data.limit ?? 20) : 20;
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof eq>[] = [];
  if (queryParams.success) {
    if (queryParams.data.stateSlug) {
      conditions.push(eq(listingsTable.stateSlug, queryParams.data.stateSlug));
    }
    if (queryParams.data.citySlug) {
      conditions.push(eq(listingsTable.citySlug, queryParams.data.citySlug));
    }
    if (queryParams.data.featured !== undefined) {
      conditions.push(eq(listingsTable.isFeatured, queryParams.data.featured));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(whereClause);

  const listings = await db
    .select()
    .from(listingsTable)
    .where(whereClause)
    .orderBy(listingsTable.isFeatured, listingsTable.createdAt)
    .limit(limit)
    .offset(offset);

  res.json({
    data: listings.map((l) => ({
      ...l,
      createdAt: l.createdAt?.toISOString() ?? null,
    })),
    total: countRow?.count ?? 0,
    page,
    limit,
  });
});

router.post("/listings", async (req, res): Promise<void> => {
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [listing] = await db.insert(listingsTable).values(parsed.data).returning();
  res.status(201).json({
    ...listing,
    createdAt: listing.createdAt?.toISOString() ?? null,
  });
});

router.get("/listings/:id", async (req, res): Promise<void> => {
  const params = GetListingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [listing] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, params.data.id));

  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  res.json({
    ...listing,
    createdAt: listing.createdAt?.toISOString() ?? null,
  });
});

router.patch("/listings/:id", async (req, res): Promise<void> => {
  const params = UpdateListingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [listing] = await db
    .update(listingsTable)
    .set(parsed.data)
    .where(eq(listingsTable.id, params.data.id))
    .returning();

  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  res.json({
    ...listing,
    createdAt: listing.createdAt?.toISOString() ?? null,
  });
});

router.delete("/listings/:id", async (req, res): Promise<void> => {
  const params = DeleteListingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(listingsTable).where(eq(listingsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
