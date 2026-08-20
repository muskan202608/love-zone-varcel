import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";

const router = Router();

async function ensureSettings() {
  const existing = await db.select().from(siteSettingsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(siteSettingsTable).values({
      siteName: "LoveZone",
      phoneNumber: "+91 8929364337",
      whatsappNumber: "+91 8929364337",
      email: "contact@lovezone.in",
    });
  }
  const [settings] = await db.select().from(siteSettingsTable).limit(1);
  return settings!;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await ensureSettings();
  res.json({
    ...settings,
    updatedAt: settings.updatedAt?.toISOString() ?? null,
  });
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const settings = await ensureSettings();

  const [updated] = await db
    .update(siteSettingsTable)
    .set(parsed.data)
    .where(eq(siteSettingsTable.id, settings.id))
    .returning();

  res.json({
    ...updated,
    updatedAt: updated!.updatedAt?.toISOString() ?? null,
  });
});

export default router;
