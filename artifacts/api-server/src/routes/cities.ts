import { Router } from "express";
import { db } from "@workspace/db";
import { citiesTable, listingsTable, statesTable } from "@workspace/db";
import { eq, sql, ilike, and } from "drizzle-orm";
import {
  CreateCityBody,
  UpdateCityBody,
  GetCityParams,
  UpdateCityParams,
  DeleteCityParams,
  ListCitiesQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/cities", async (req, res): Promise<void> => {
  const queryParams = ListCitiesQueryParams.safeParse(req.query);

  const stateSlug = queryParams.success ? queryParams.data.stateSlug : undefined;
  const search = queryParams.success ? queryParams.data.search : undefined;
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const conditions = [];
  if (stateSlug) conditions.push(eq(citiesTable.stateSlug, stateSlug));
  if (search) conditions.push(ilike(citiesTable.name, `%${search}%`));

  const whereClause = conditions.length === 1 ? conditions[0] : conditions.length > 1 ? and(...conditions) : undefined;

  const [totalRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(citiesTable)
    .where(whereClause);

  const cities = await db
    .select()
    .from(citiesTable)
    .where(whereClause)
    .orderBy(citiesTable.name)
    .limit(limit)
    .offset(offset);

  const counts = await db
    .select({ citySlug: listingsTable.citySlug, count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.isActive, true))
    .groupBy(listingsTable.citySlug);

  const countMap = new Map(counts.map((c) => [c.citySlug, c.count]));

  const data = cities.map((c) => ({
    ...c,
    listingCount: countMap.get(c.slug) ?? 0,
    description: c.description ?? null,
    metaTitle: c.metaTitle ?? null,
    metaDescription: c.metaDescription ?? null,
    createdAt: c.createdAt?.toISOString() ?? null,
  }));

  res.json({ data, total: totalRow?.count ?? 0, limit, offset });
});

router.post("/cities", async (req, res): Promise<void> => {
  const parsed = CreateCityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { stateSlug } = parsed.data;
  const [state] = await db
    .select()
    .from(statesTable)
    .where(eq(statesTable.slug, stateSlug));

  const stateName = state?.name ?? stateSlug;

  const [city] = await db
    .insert(citiesTable)
    .values({ ...parsed.data, stateName })
    .returning();

  res.status(201).json({
    ...city,
    listingCount: 0,
    description: city.description ?? null,
    metaTitle: city.metaTitle ?? null,
    metaDescription: city.metaDescription ?? null,
    createdAt: city.createdAt?.toISOString() ?? null,
  });
});

router.get("/cities/:slug", async (req, res): Promise<void> => {
  const params = GetCityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [city] = await db
    .select()
    .from(citiesTable)
    .where(eq(citiesTable.slug, params.data.slug));

  if (!city) {
    res.status(404).json({ error: "City not found" });
    return;
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.citySlug, params.data.slug));

  res.json({
    ...city,
    listingCount: countRow?.count ?? 0,
    description: city.description ?? null,
    metaTitle: city.metaTitle ?? null,
    metaDescription: city.metaDescription ?? null,
    createdAt: city.createdAt?.toISOString() ?? null,
  });
});

router.patch("/cities/:slug", async (req, res): Promise<void> => {
  const params = UpdateCityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [city] = await db
    .update(citiesTable)
    .set(parsed.data)
    .where(eq(citiesTable.slug, params.data.slug))
    .returning();

  if (!city) {
    res.status(404).json({ error: "City not found" });
    return;
  }

  res.json({
    ...city,
    listingCount: 0,
    description: city.description ?? null,
    metaTitle: city.metaTitle ?? null,
    metaDescription: city.metaDescription ?? null,
    createdAt: city.createdAt?.toISOString() ?? null,
  });
});

router.delete("/cities/:slug", async (req, res): Promise<void> => {
  const params = DeleteCityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(citiesTable).where(eq(citiesTable.slug, params.data.slug));
  res.sendStatus(204);
});

export default router;
