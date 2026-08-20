import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { readDatabase, saveUpload, writeDatabase } from "../../../../lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    const formData = await request.formData();
    const type = formData.get("type");
    const file = formData.get("file");
    if ((type !== "gst" && type !== "police") || !(file instanceof File) || !file.size) return NextResponse.json({ error: "Select a certificate image." }, { status: 400 });
    const url = await saveUpload(file, "certificates");
    const database = await readDatabase();
    database.settings.certificates[type] = url;
    await writeDatabase(database);
    return NextResponse.json({ url, settings: database.settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload certificate." }, { status: 400 });
  }
}
