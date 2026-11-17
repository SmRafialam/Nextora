"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/store/shop";
import { useMounted } from "@/lib/useMounted";

export function AccountNav({ orders, addresses }: { orders: number; addresses: number }) {
  const path = usePathname();
  const mounted = useMounted();
  const wish = useShop((s) => Object.keys(s.wish).length);
  const items = [
    { href: "/account", label: "Overview", count: "" },
    { href: "/account/orders", label: "Orders", count: String(orders) },
    { href: "/account/addresses", label: "Addresses", count: String(addresses) },
    { href: "/account/profile", label: "Profile & preferences", count: "" },
    { href: "/wishlist", label: "Wishlist", count: mounted ? String(wish) : "" },
  ];
  return (
    <nav className="nx-side" aria-label="Account sections">
      {items.map((i) => {
        const current = i.href === "/account" ? path === "/account" : path === i.href || path.startsWith(i.href + "/");
        return <Link key={i.href} href={i.href} aria-current={current ? "page" : undefined}>{i.label}<span style={{ fontSize: 12, color: "#5C5D59" }}>{i.count}</span></Link>;
      })}
    </nav>
  );
}

export function WishCount() {
  const mounted = useMounted();
  const n = useShop((s) => Object.keys(s.wish).length);
  return <>{mounted ? n : "–"}</>;
}
