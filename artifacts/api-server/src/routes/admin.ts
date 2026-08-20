import { Router } from "express";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;
  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username));

  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session = { adminId: user.id, adminUsername: user.username };
  res.json({ id: user.id, username: user.username });
});

router.post("/admin/logout", (req, res): void => {
  req.session = null;
  res.json({ success: true });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = req.session as { adminId?: number; adminUsername?: string } | null;
  if (!session?.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ id: session.adminId, username: session.adminUsername });
});

export default router;
