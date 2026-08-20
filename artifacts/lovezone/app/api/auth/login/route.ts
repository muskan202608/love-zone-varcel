import { NextResponse } from "next/server";
import { sessionCookie } from "../../../../lib/auth";
import { matchesPassword, readDatabase } from "../../../../lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const login = String(username || "").trim().toLowerCase();
    if (login === "admin@playboyzone" && password === "admin@123") {
      const response = NextResponse.json({ role: "admin", redirectTo: "/admin" });
      const cookie = sessionCookie({ role: "admin" });
      response.cookies.set(cookie.name, cookie.value, cookie.options);
      return response;
    }
    const database = await readDatabase();
    const member = database.members.find((item) => item.email === login);
    if (!member || !matchesPassword(String(password || ""), member.passwordHash)) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    const response = NextResponse.json({ role: "member", redirectTo: "/member" });
    const cookie = sessionCookie({ role: "member", memberId: member.id });
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
