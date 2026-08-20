import { NextResponse } from "next/server";
import { hashPassword, readDatabase, saveUpload, withoutPassword, writeDatabase } from "../../../../lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const mobile = String(formData.get("mobile") || "").replace(/\D/g, "");
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const city = String(formData.get("city") || "").trim();
    const state = String(formData.get("state") || "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") || "");
    const bodyWeight = String(formData.get("bodyWeight") || "").trim();
    const photo = formData.get("photo");
    if (!name || mobile.length < 10 || !email || password.length < 6 || !city || !state || !dateOfBirth || !bodyWeight || !(photo instanceof File) || !photo.size) {
      return NextResponse.json({ error: "Please complete every profile field and add a profile photo." }, { status: 400 });
    }
    const database = await readDatabase();
    if (database.members.some((member) => member.email === email)) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const photoUrl = await saveUpload(photo, "profiles");
    const member = {
      id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      mobile,
      email,
      passwordHash: hashPassword(password),
      city,
      state,
      dateOfBirth,
      bodyWeight,
      photoUrl,
      status: "Pending" as const,
      createdAt: new Date().toISOString(),
    };
    database.members.push(member);
    await writeDatabase(database);
    return NextResponse.json({ member: withoutPassword(member) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create your account." }, { status: 500 });
  }
}
