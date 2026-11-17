"use client";
import { useState } from "react";
import { useShop } from "@/store/shop";

export function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const say = useShop((s) => s.say);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); say("Order number copied"); setTimeout(() => setCopied(false), 2000); }
    catch { say("Could not copy"); }
  };
  return <button className="nx-chip" onClick={copy} style={{ minHeight: 34, background: "#EFE9DF" }}>{copied ? "Copied" : "Copy"}</button>;
}
