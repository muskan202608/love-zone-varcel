import { Router } from "express";
import { db } from "@workspace/db";
import { citiesTable, statesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

const BulkStateImportSchema = z.object({
  states: z.array(
    z.object({
      name: z.string().min(1),
      slug: z.string().optional(),
    })
  ),
});

const BulkCityImportSchema = z.object({
  cities: z.array(
    z.object({
      state: z.string().min(1),
      city: z.string().min(1),
    })
  ),
});

const CsvImportSchema = z.object({
  csv: z.string().min(1),
});

// POST /import/states
router.post("/import/states", async (req, res): Promise<void> => {
  const parsed = BulkStateImportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const s of parsed.data.states) {
    const slug = s.slug || toSlug(s.name);
    try {
      const existing = await db
        .select({ id: statesTable.id })
        .from(statesTable)
        .where(eq(statesTable.slug, slug));

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      await db.insert(statesTable).values({ name: s.name, slug });
      inserted++;
    } catch (e) {
      errors.push(`${s.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  res.json({ inserted, skipped, errors });
});

// POST /import/cities
router.post("/import/cities", async (req, res): Promise<void> => {
  const parsed = BulkCityImportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Build state name → state record map
  const allStates = await db.select().from(statesTable);
  const stateByName = new Map(allStates.map((s) => [s.name.toLowerCase(), s]));
  const stateBySlug = new Map(allStates.map((s) => [s.slug, s]));

  // Existing city slugs
  const existingCities = await db
    .select({ slug: citiesTable.slug })
    .from(citiesTable);
  const existingSlugs = new Set(existingCities.map((c) => c.slug));

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];
  const toInsert: Array<{
    name: string;
    slug: string;
    stateSlug: string;
    stateName: string;
  }> = [];

  for (const entry of parsed.data.cities) {
    const stateName = entry.state.trim();
    const cityName = entry.city.trim();
    if (!stateName || !cityName) continue;

    const state =
      stateByName.get(stateName.toLowerCase()) ||
      stateBySlug.get(toSlug(stateName));

    if (!state) {
      errors.push(`State not found: "${stateName}" for city "${cityName}"`);
      skipped++;
      continue;
    }

    let slug = toSlug(cityName);
    if (existingSlugs.has(slug)) {
      // try state-qualified slug
      const qualifiedSlug = `${slug}-${state.slug}`;
      if (existingSlugs.has(qualifiedSlug)) {
        skipped++;
        continue;
      }
      slug = qualifiedSlug;
    }

    existingSlugs.add(slug);
    toInsert.push({
      name: cityName,
      slug,
      stateSlug: state.slug,
      stateName: state.name,
    });
  }

  // Batch insert in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    try {
      await db.insert(citiesTable).values(chunk);
      inserted += chunk.length;
    } catch (e) {
      errors.push(`Batch insert error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  res.json({ inserted, skipped, errors });
});

// POST /import/cities-csv
router.post("/import/cities-csv", async (req, res): Promise<void> => {
  const parsed = CsvImportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const lines = parsed.data.csv.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    res.json({ inserted: 0, skipped: 0, errors: ["Empty CSV"] });
    return;
  }

  // Detect header row
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes("state") || firstLine.includes("city");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const cities: Array<{ state: string; city: string }> = [];
  for (const line of dataLines) {
    const [stateRaw, cityRaw] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
    if (stateRaw && cityRaw) {
      cities.push({ state: stateRaw, city: cityRaw });
    }
  }

  // Reuse the same logic by forwarding to internal import
  const allStates = await db.select().from(statesTable);
  const stateByName = new Map(allStates.map((s) => [s.name.toLowerCase(), s]));
  const stateBySlug = new Map(allStates.map((s) => [s.slug, s]));

  const existingCities = await db
    .select({ slug: citiesTable.slug })
    .from(citiesTable);
  const existingSlugs = new Set(existingCities.map((c) => c.slug));

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];
  const toInsert: Array<{
    name: string;
    slug: string;
    stateSlug: string;
    stateName: string;
  }> = [];

  for (const entry of cities) {
    const stateName = entry.state;
    const cityName = entry.city;
    const state =
      stateByName.get(stateName.toLowerCase()) ||
      stateBySlug.get(toSlug(stateName));

    if (!state) {
      errors.push(`State not found: "${stateName}" for city "${cityName}"`);
      skipped++;
      continue;
    }

    let slug = toSlug(cityName);
    if (existingSlugs.has(slug)) {
      const qualifiedSlug = `${slug}-${state.slug}`;
      if (existingSlugs.has(qualifiedSlug)) {
        skipped++;
        continue;
      }
      slug = qualifiedSlug;
    }

    existingSlugs.add(slug);
    toInsert.push({
      name: cityName,
      slug,
      stateSlug: state.slug,
      stateName: state.name,
    });
  }

  const chunkSize = 100;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    try {
      await db.insert(citiesTable).values(chunk);
      inserted += chunk.length;
    } catch (e) {
      errors.push(`Batch insert: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  res.json({ inserted, skipped, errors });
});

export default router;
