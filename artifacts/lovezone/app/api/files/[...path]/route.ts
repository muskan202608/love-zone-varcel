import { NextResponse } from "next/server";
import { getStoredFile } from "../../../../lib/store";

export const runtime = "nodejs";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const stored = await getStoredFile(path);
  if (!stored) return new NextResponse("Not found", { status: 404 });
  const extension = stored.filename.slice(stored.filename.lastIndexOf(".")).toLowerCase();
  return new NextResponse(stored.data, {
    headers: {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      // Upload names include an unguessable timestamp and random token, so a
      // replacement is always a new URL. This makes long-lived CDN caching safe.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
