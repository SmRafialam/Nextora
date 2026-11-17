"use client";
import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/lib/catalog";

// The active catalogue, loaded from the database by the root layout, for client-side
// lookups (bag, quick view, search panel). Fine at today's size; switch to an API
// lookup if the catalogue grows to hundreds of products.
const Ctx = createContext<Product[]>([]);

export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <Ctx.Provider value={products}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const products = useContext(Ctx);
  return useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return { products, getProduct: (id: string) => byId.get(id) };
  }, [products]);
}
