import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "pbz_session";
const sessionSecret = process.env.SESSION_SECRET || "pbz-preview-session-secret-change-in-production";

const signatureFor = (value: string) => createHmac("sha256", sessionSecret).update(value).digest("hex");

export type Session = { role: "admin" } | { role: "member"; memberId: string };

export function sessionValue(session: Session) {
  const payload = session.role === "admin" ? "admin" : `member:${session.memberId}`;
  return `${payload}.${signatureFor(payload)}`;
}

export function parseSession(value?: string): Session | null {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = signatureFor(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  if (payload === "admin") return { role: "admin" };
  if (payload.startsWith("member:")) return { role: "member", memberId: payload.slice(7) };
  return null;
}

export async function getSession() {
  const cookieStore = await cookies();
  return parseSession(cookieStore.get(cookieName)?.value);
}

export function sessionCookie(session: Session) {
  return {
    name: cookieName,
    value: sessionValue(session),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    },
  };
}

export const clearSessionCookie = {
  name: cookieName,
  value: "",
  options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 },
};
