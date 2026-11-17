"use client";
import { useEffect, useState } from "react";

/** True after the first client render — used so persisted cart/wishlist counts never cause hydration mismatches. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
