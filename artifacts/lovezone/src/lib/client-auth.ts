"use client";

export type CachedAuthSession = {
  role: "admin" | "member";
  redirectTo: "/admin" | "/member";
  savedAt: number;
};

const storageKey = "pbz_auth_session";

export function cacheAuthSession(session: Omit<CachedAuthSession, "savedAt">) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ ...session, savedAt: Date.now() }));
  } catch {
    // Storage can be unavailable in private browsing; the secure cookie still works.
  }
}

export function clearCachedAuthSession() {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore unavailable storage.
  }
}
