"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useShop } from "@/store/shop";
import { useMounted } from "@/lib/useMounted";
import { useCatalog } from "@/components/CatalogProvider";
import { ProductArt } from "@/components/ProductArt";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconUser } from "@/components/icons";

const NAV = [
  { href: "/collections", label: "Collections" },
  { href: "/shop?sort=new", label: "New Arrivals" },
  { href: "/shop?sort=bestsellers", label: "Best Sellers" },
  { href: "/about", label: "Our Story" },
];
const MOBILE = [{ href: "/shop", label: "Shop" }, ...NAV, { href: "/wishlist", label: "Wishlist" }, { href: "/account", label: "Account" }];

export function Header() {
  const { products: PRODUCTS } = useCatalog();
  const path = usePathname();
  const mounted = useMounted();
  const cart = useShop((s) => s.cart);
  const wish = useShop((s) => s.wish);
  const openCart = useShop((s) => s.openCart);
  const openQuick = useShop((s) => s.openQuick);
  const [mega, setMega] = useState(false);
  const [search, setSearch] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { setMega(false); setSearch(false); setMobile(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  const cartCount = mounted ? cart.reduce((a, x) => a + x.q, 0) : 0;
  const wishCount = mounted ? Object.keys(wish).length : 0;
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (t ? PRODUCTS.filter((p) => `${p.name} ${p.meta} ${p.type}`.toLowerCase().includes(t)) : PRODUCTS.slice(0, 5)).slice(0, 6);
  }, [q, PRODUCTS]);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(248,245,239,.86)", backdropFilter: "saturate(140%) blur(14px)", WebkitBackdropFilter: "saturate(140%) blur(14px)", borderBottom: "1px solid rgba(34,35,33,.08)" }}>
      <div className="nx-wrap" style={{ height: 76, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <button className="nx-icon nx-mob" aria-label="Open menu" onClick={() => setMobile(true)} style={{ marginLeft: -10 }}><IconMenu /></button>
          <button className="nx-link nx-desk" aria-expanded={mega} onClick={() => { setMega(!mega); setSearch(false); }} onMouseEnter={() => { setMega(true); setSearch(false); }}>Shop</button>
          {NAV.map((n) => (
            <Link key={n.href} className="nx-link nx-desk" href={n.href} aria-current={path === n.href || path.startsWith(n.href + "/") ? "page" : undefined}>{n.label}</Link>
          ))}
        </nav>
        <Link href="/" aria-label="Nestora home" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, lineHeight: 1 }}>
          <span className="nx-f nx-wm" style={{ fontSize: 27, fontWeight: 400, letterSpacing: ".32em", marginRight: "-.32em" }}>NEST<span style={{ fontStyle: "italic", letterSpacing: ".18em", color: "#9A5B40" }}>O</span>RA</span>
          <span className="nx-wm-sub" style={{ fontSize: 8.5, letterSpacing: ".42em", marginRight: "-.42em", color: "#5E6A5B" }}>HOME &amp; LIVING</span>
        </Link>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
          <button className="nx-icon" aria-label="Search" aria-expanded={search} onClick={() => { setSearch(!search); setMega(false); }}><IconSearch /></button>
          <Link className="nx-icon nx-desk" href="/account" aria-label="Account"><IconUser /></Link>
          <Link className="nx-icon" href="/wishlist" aria-label={`Wishlist, ${wishCount} ${wishCount === 1 ? "item" : "items"}`}><IconHeart />{wishCount > 0 && <span className="nx-badge">{wishCount}</span>}</Link>
          <button className="nx-icon" aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => openCart(true)}><IconBag />{cartCount > 0 && <span className="nx-badge" key={cartCount}>{cartCount}</span>}</button>
        </div>
      </div>

      {search && (
        <div className="nx-drop" style={{ borderTop: "1px solid rgba(34,35,33,.08)", background: "#F8F5EF" }}>
          <div className="nx-wrap" style={{ paddingTop: 28, paddingBottom: 32, display: "flex", flexDirection: "column", gap: 18 }}>
            <form role="search" action="/search" style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid #222321", paddingBottom: 10 }}>
              <IconSearch size={22} />
              <label htmlFor="nx-q" className="nx-sr">Search Nestora</label>
              <input id="nx-q" name="q" className="nx-f" autoFocus autoComplete="off" placeholder="Search sofas, lamps, linen…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", fontSize: 30, fontWeight: 300, outline: "none", padding: "6px 0" }} />
              <button type="button" className="nx-icon" aria-label="Close search" onClick={() => { setSearch(false); setQ(""); }}><IconClose /></button>
            </form>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#5C5D59", marginRight: 6 }}>{q.trim() ? (hits.length ? `${hits.length} results` : "No matches — try “oak” or “linen”") : "Popular"}</span>
              {hits.map((h) => (
                <button key={h.id} onClick={() => { openQuick(h.id); setSearch(false); }} style={{ minHeight: 44, padding: "0 18px", borderRadius: 99, border: "1px solid rgba(34,35,33,.18)", background: "#FFFFFF", cursor: "pointer", fontSize: 14 }}>{h.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mega && (
        <div className="nx-drop" onMouseLeave={() => setMega(false)} style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#F8F5EF", borderTop: "1px solid rgba(34,35,33,.08)", boxShadow: "0 40px 60px -30px rgba(34,35,33,.25)" }}>
          <div className="nx-wrap" style={{ paddingTop: 40, paddingBottom: 48, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 40 }}>
            <MegaCol title="By room" links={[["Living Room", "/shop/living-room"], ["Bedroom", "/shop/bedroom"], ["Kitchen & Dining", "/shop/kitchen-dining"], ["Outdoor Living", "/shop/outdoor"]]} serif />
            <MegaCol title="By category" links={[["Furniture", "/shop/furniture"], ["Lighting", "/shop/lighting"], ["Home Décor", "/shop/home-decor"], ["Storage", "/shop/storage"]]} serif />
            <MegaCol title="Edits" links={[["Shop all products", "/shop"], ["New Arrivals", "/shop?sort=new"], ["Best Sellers", "/shop?sort=bestsellers"], ["Under ৳ 10,000", "/shop?price=u10"], ["Shop the Room", "/#room"]]} />
            <Link className="nx-zoom" href="/shop/living-room" style={{ borderRadius: 4, background: "#E9DFD0", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22 }}>
              <div className="nx-art" style={{ position: "absolute", inset: "8% 18% 30% 18%" }}><ProductArt kind="sofa" fill="#8E9A89" /></div>
              <span style={{ position: "relative", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#5E6A5B" }}>The linen edit</span>
              <span className="nx-f" style={{ position: "relative", fontSize: 22, fontStyle: "italic" }}>Soft, slow, lived-in</span>
            </Link>
          </div>
        </div>
      )}

      {mobile && (
        <div className="nx-fade" role="dialog" aria-modal="true" aria-label="Menu" style={{ position: "fixed", inset: 0, zIndex: 60, background: "#F8F5EF", display: "flex", flexDirection: "column", padding: "16px 20px 32px", height: "100dvh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
            <span className="nx-f" style={{ fontSize: 22, letterSpacing: ".32em" }}>NESTORA</span>
            <button className="nx-icon" aria-label="Close menu" onClick={() => setMobile(false)}><IconClose size={22} /></button>
          </div>
          <nav aria-label="Mobile" style={{ display: "flex", flexDirection: "column", marginTop: 32, overflowY: "auto" }}>
            {MOBILE.map((m, i) => (
              <Link key={m.href} className="nx-f nx-rise" href={m.href} style={{ fontSize: 38, fontWeight: 300, padding: "12px 0", borderBottom: "1px solid rgba(34,35,33,.1)", animationDelay: `${0.05 + i * 0.06}s` }}>{m.label}</Link>
            ))}
          </nav>
          <button className="nx-btn" onClick={() => { setMobile(false); openCart(true); }} style={{ marginTop: "auto" }}>Bag ({cartCount})</button>
        </div>
      )}
    </header>
  );
}

function MegaCol({ title, links, serif }: { title: string; links: [string, string][]; serif?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: serif ? 14 : 12 }}>
      <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#5E6A5B" }}>{title}</span>
      {links.map(([l, h], i) => (
        <Link key={h} className={serif ? "nx-f" : undefined} href={h} style={{ fontSize: serif ? 22 : 15, fontWeight: !serif && i === 0 ? 600 : undefined }}>{l}</Link>
      ))}
    </div>
  );
}
