import { Router } from "express";
import { db } from "@workspace/db";
import { statesTable, listingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  CreateStateBody,
  UpdateStateBody,
  GetStateParams,
  UpdateStateParams,
  DeleteStateParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/states", async (_req, res): Promise<void> => {
  const states = await db.select().from(statesTable).orderBy(statesTable.name);

  const counts = await db
    .select({ stateSlug: listingsTable.stateSlug, count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.isActive, true))
    .groupBy(listingsTable.stateSlug);

  const countMap = new Map(counts.map((c) => [c.stateSlug, c.count]));

  const result = states.map((s) => ({
    ...s,
    listingCount: countMap.get(s.slug) ?? 0,
    description: s.description ?? null,
    metaTitle: s.metaTitle ?? null,
    metaDescription: s.metaDescription ?? null,
    createdAt: s.createdAt?.toISOString() ?? null,
  }));

  res.json(result);
});

router.post("/states", async (req, res): Promise<void> => {
  const parsed = CreateStateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [state] = await db.insert(statesTable).values(parsed.data).returning();
  res.status(201).json({
    ...state,
    listingCount: 0,
    description: state.description ?? null,
    metaTitle: state.metaTitle ?? null,
    metaDescription: state.metaDescription ?? null,
    createdAt: state.createdAt?.toISOString() ?? null,
  });
});

router.get("/states/:slug", async (req, res): Promise<void> => {
  const params = GetStateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [state] = await db
    .select()
    .from(statesTable)
    .where(eq(statesTable.slug, params.data.slug));

  if (!state) {
    res.status(404).json({ error: "State not found" });
    return;
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listingsTable)
    .where(eq(listingsTable.stateSlug, params.data.slug));

  res.json({
    ...state,
    listingCount: countRow?.count ?? 0,
    description: state.description ?? null,
    metaTitle: state.metaTitle ?? null,
    metaDescription: state.metaDescription ?? null,
    createdAt: state.createdAt?.toISOString() ?? null,
  });
});

router.patch("/states/:slug", async (req, res): Promise<void> => {
  const params = UpdateStateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateStateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [state] = await db
    .update(statesTable)
    .set(parsed.data)
    .where(eq(statesTable.slug, params.data.slug))
    .returning();

  if (!state) {
    res.status(404).json({ error: "State not found" });
    return;
  }

  res.json({
    ...state,
    listingCount: 0,
    description: state.description ?? null,
    metaTitle: state.metaTitle ?? null,
    metaDescription: state.metaDescription ?? null,
    createdAt: state.createdAt?.toISOString() ?? null,
  });
});

router.delete("/states/:slug", async (req, res): Promise<void> => {
  const params = DeleteStateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(statesTable).where(eq(statesTable.slug, params.data.slug));
  res.sendStatus(204);
});

export default router;
