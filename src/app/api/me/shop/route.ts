import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readShop, shopPayload, writeShop } from "@/server/shopSync";
import { rateLimit } from "@/server/rateLimit";

// The signed-in customer's saved bag and wishlist.
export async function GET() {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await readShop(s.user.id), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  // Same-origin only (the session cookie is SameSite=Lax; this blocks cross-site form/fetch posts too).
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!rateLimit(`shop:${s.user.id}`, 120, 60_000).ok) return NextResponse.json({ error: "slow down" }, { status: 429 });
  const parsed = shopPayload.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json(await writeShop(s.user.id, parsed.data), { headers: { "Cache-Control": "no-store" } });
}
