import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const seoPagesTable = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  slug: text("slug").notNull().unique(),
  seoTitle: text("seo_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  h1Heading: text("h1_heading").notNull(),
  content: text("content").notNull(),
  faq: text("faq"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSeoPageSchema = createInsertSchema(seoPagesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSeoPage = z.infer<typeof insertSeoPageSchema>;
export type SeoPage = typeof seoPagesTable.$inferSelect;
