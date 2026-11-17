"use client";
// Client cart/wishlist/UI state. Persisted for guests; Phase 3/4 syncs it with the server cart.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { id: string; c: number; q: number };

type ShopState = {
  cart: CartLine[];
  wish: Record<string, true>;
  cartOpen: boolean;
  quickId: string | null;
  toast: string;
  undo: (() => void) | null;
  promo: string;
  add: (id: string, c?: number, q?: number) => void;
  setQty: (id: string, c: number, q: number) => void;
  toggleWish: (id: string) => boolean;
  openCart: (open: boolean) => void;
  openQuick: (id: string | null) => void;
  say: (msg: string, undo?: () => void) => void;
  setCart: (cart: CartLine[]) => void;
  setWish: (wish: Record<string, true>) => void;
  setPromo: (code: string) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wish: {},
      cartOpen: false,
      quickId: null,
      toast: "",
      undo: null,
      promo: "",
      add: (id, c = 0, q = 1) =>
        set((s) => {
          const hit = s.cart.find((x) => x.id === id && x.c === c);
          return { cart: hit ? s.cart.map((x) => (x === hit ? { ...x, q: x.q + q } : x)) : [...s.cart, { id, c, q }] };
        }),
      setQty: (id, c, q) => set((s) => ({ cart: s.cart.map((x) => (x.id === id && x.c === c ? { ...x, q } : x)).filter((x) => x.q > 0) })),
      toggleWish: (id) => {
        const w = { ...get().wish };
        const added = !w[id];
        if (added) w[id] = true;
        else delete w[id];
        set({ wish: w });
        return added;
      },
      openCart: (open) => set({ cartOpen: open }),
      openQuick: (id) => set({ quickId: id }),
      say: (msg, undo) => {
        clearTimeout(toastTimer);
        set({ toast: msg, undo: undo ?? null });
        toastTimer = setTimeout(() => set({ toast: "", undo: null }), undo ? 4000 : 2600);
      },
      setCart: (cart) => set({ cart }),
      setWish: (wish) => set({ wish }),
      setPromo: (promo) => set({ promo }),
    }),
    { name: "nestora-shop", partialize: (s) => ({ cart: s.cart, wish: s.wish, promo: s.promo }) }
  )
);
