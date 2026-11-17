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
  add: (id: string, c?: number, q?: number) => void;
  setQty: (id: string, c: number, q: number) => void;
  toggleWish: (id: string) => boolean;
  openCart: (open: boolean) => void;
  openQuick: (id: string | null) => void;
  say: (msg: string) => void;
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
      say: (msg) => {
        clearTimeout(toastTimer);
        set({ toast: msg });
        toastTimer = setTimeout(() => set({ toast: "" }), 2600);
      },
    }),
    { name: "nestora-shop", partialize: (s) => ({ cart: s.cart, wish: s.wish }) }
  )
);
