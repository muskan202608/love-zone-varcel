import { NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { approveMember, readDatabase, withoutPassword, writeDatabase } from "../../../lib/store";
import type { ApprovalStatus, Contact, ProcessStep } from "../../../lib/types";

export const runtime = "nodejs";

const unauthorized = () => NextResponse.json({ error: "Admin access required." }, { status: 401 });

export async function GET() {
  const session = await getSession();
  if (session?.role !== "admin") return unauthorized();
  const database = await readDatabase();
  return NextResponse.json({ members: database.members.map(withoutPassword), settings: database.settings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return unauthorized();
  try {
    const body = await request.json();
    if (body.action === "status") {
      const statuses: ApprovalStatus[] = ["Pending", "Approved", "Rejected"];
      if (!statuses.includes(body.status)) return NextResponse.json({ error: "Invalid approval status." }, { status: 400 });
      const member = await approveMember(String(body.memberId), body.status);
      return NextResponse.json({ member });
    }
    const database = await readDatabase();
    if (body.action === "contacts") {
      if (!Array.isArray(body.contacts)) return NextResponse.json({ error: "Invalid contacts." }, { status: 400 });
      database.settings.contacts = body.contacts.map((contact: Contact, index: number) => ({
        id: contact.id || `contact-${index + 1}`,
        name: String(contact.name || "").slice(0, 80),
        phone: String(contact.phone || "").replace(/\D/g, "").slice(0, 15),
        whatsapp: String(contact.whatsapp || "").replace(/\D/g, "").slice(0, 15),
      }));
    } else if (body.action === "hero") {
      const lines = Array.isArray(body.hero?.lines) ? body.hero.lines.map((line: unknown) => String(line).slice(0, 80)) : [];
      if (lines.length !== 3) return NextResponse.json({ error: "Hero requires exactly three lines." }, { status: 400 });
      database.settings.hero = {
        lines: [lines[0], lines[1], lines[2]],
        subtitle: String(body.hero.subtitle || "").slice(0, 140),
        description: String(body.hero.description || "").slice(0, 320),
      };
    } else if (body.action === "process") {
      if (!Array.isArray(body.process?.steps)) return NextResponse.json({ error: "Invalid process steps." }, { status: 400 });
      database.settings.process = {
        subtext: String(body.process.subtext || "").slice(0, 140),
        steps: body.process.steps.slice(0, 5).map((step: ProcessStep) => ({
          title: String(step.title || "").slice(0, 80),
          points: Array.isArray(step.points) ? step.points.map((point) => String(point).slice(0, 160)).filter(Boolean).slice(0, 6) : [],
        })),
      };
    } else {
      return NextResponse.json({ error: "Unsupported update." }, { status: 400 });
    }
    await writeDatabase(database);
    return NextResponse.json({ settings: database.settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save changes." }, { status: 400 });
  }
}
