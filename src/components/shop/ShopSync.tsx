"use client";
import { useEffect, useRef } from "react";
import { useShop, type CartLine } from "@/store/shop";

type Snapshot = { cart: CartLine[]; wish: string[] };
const toWishMap = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, true as const]));

/** Merge for the first sync after signing in: the guest bag is added to the saved bag, wishlists are combined. */
export function mergeShop(local: Snapshot, server: Snapshot): Snapshot {
  const cart = server.cart.map((l) => ({ ...l }));
  for (const l of local.cart) {
    const hit = cart.find((x) => x.id === l.id && x.c === l.c);
    if (hit) hit.q = Math.max(hit.q, l.q); // same piece in both: keep the larger quantity, don't double it
    else cart.push({ ...l });
  }
  return { cart, wish: [...new Set([...server.wish, ...local.wish])] };
}

/**
 * Keeps the browser bag/wishlist and the account's saved copy in step.
 * - Signing in: guest items are merged into the account once.
 * - While signed in: every change is saved (debounced); the server caps quantities at stock.
 * - Signing out: the browser copy is cleared so the next person on this device doesn't see it.
 */
export function ShopSync({ userId }: { userId: string | null }) {
  const ready = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const apply = (s: Snapshot) => useShop.setState({ cart: s.cart, wish: toWishMap(s.wish) });
    const save = async (s: Snapshot) => {
      const r = await fetch("/api/me/shop", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
      if (!r.ok) return;
      const out: Snapshot & { adjusted: boolean } = await r.json();
      ready.current = false; apply(out); ready.current = true;
      if (out.adjusted) useShop.getState().say("Some quantities were updated to match stock");
    };

    const start = async () => {
      // Wait for the persisted store to load from localStorage first.
      if (!useShop.persist.hasHydrated()) await new Promise<void>((r) => { const off = useShop.persist.onFinishHydration(() => { off(); r(); }); });
      const st = useShop.getState();
      if (!userId) {
        if (st.syncedUser) useShop.setState({ cart: [], wish: {}, promo: "", syncedUser: null });
        return;
      }
      const res = await fetch("/api/me/shop", { cache: "no-store" });
      if (!res.ok) return;
      const server: Snapshot = await res.json();
      const local: Snapshot = { cart: st.cart, wish: Object.keys(st.wish) };
      // Same user as last time on this device: the account copy wins. Otherwise merge guest items in.
      const next = st.syncedUser === userId ? server : mergeShop(local, server);
      useShop.setState({ syncedUser: userId });
      apply(next);
      ready.current = true;
      if (st.syncedUser !== userId) await save(next);
    };
    start();

    const unsub = useShop.subscribe((s, prev) => {
      if (!userId || !ready.current || (s.cart === prev.cart && s.wish === prev.wish)) return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => save({ cart: s.cart, wish: Object.keys(s.wish) }), 600);
    });
    return () => { unsub(); clearTimeout(timer.current); ready.current = false; };
  }, [userId]);

  return null;
}
