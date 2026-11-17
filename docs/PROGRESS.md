# Nestora — implementation progress

Status key: ✅ done and verified · 🟡 in progress · ⬜ not started · ⛔ blocked (reason given)

## Phase 1 — Project audit ✅
Source design: `../nestora-site/` (12 static pages + `assets/`). Its runtime renders each page template with React 18, so every page already reads as a React component tree.

| Design piece | Interactions in the design | Next.js component |
|---|---|---|
| Announcement bar | — | `layout/Footer.tsx → AnnouncementBar` |
| Sticky header, wordmark | hover underline, mega menu (hover/click), search overlay with live results, mobile sheet, wishlist and bag counts | `layout/Header.tsx` |
| Hero | masked text reveal, CSS scene, scroll parallax (`animation-timeline`), scroll cue, quick-view chip | `home/Hero.tsx`, `home/QuickViewChip.tsx` |
| Shop by space | uneven grid, hover zoom, label lift, arrow reveal | `home/CategoryGrid.tsx` |
| Best sellers | swatches recolour the art, heart pop, quick view, add to bag, hover image swap | `shop/ProductCard.tsx` |
| Shop the Room | pulsing hotspots, floating card, add all | `home/ShopTheRoom.tsx` |
| Editorial | scroll reveal | `home/Editorial.tsx` |
| New arrivals | translate carousel, counter, progress bar | `home/NewArrivals.tsx`, `shop/ProductCard.tsx → ArrivalCard` |
| Journal gallery | uneven grid, slow zoom | `home/Inspiration.tsx` |
| Newsletter | validation, success state | `home/Newsletter.tsx` |
| Footer | big wordmark | `layout/Footer.tsx` |
| Bag drawer, quick view, toast | slide-in, ESC to close, scroll lock | `shop/Overlays.tsx` |
| Product illustration | 8 kinds, recolourable | `ProductArt.tsx` |

All motion is CSS (keyframes plus `animation-timeline` for scroll effects). GSAP isn't needed: nothing in the design depends on it, so adding it would only add bundle weight. Reduced motion is respected globally.

**Migration rules:** class names, tokens and keyframes are copied 1:1 into `src/app/globals.css`. Fonts load through `next/font` (Fraunces, Manrope). No shadcn defaults.

## Phase 2 — React / Next.js migration 🟡
- ✅ App scaffold: Next.js 15 App Router, TypeScript, Tailwind v4, Zustand, Zod
- ✅ Design system ported (`globals.css`)
- ✅ Layout: header, mega menu, search, mobile menu, footer, bag drawer, quick view, toast
- ✅ Homepage: all 8 sections, checked in Chrome (desktop) and at 360px (no horizontal overflow)
- ⬜ /shop, /shop/[category], /collections, /product/[slug], /search
- ⬜ /wishlist, /cart, /checkout, /order-confirmation/[orderId]
- ⬜ /login, /register, /account (+ orders, addresses), /about, /contact, policy pages

**Fixes made during migration (no visual change on desktop):**
- Shop the Room on phones: `aspect-ratio: 16/9` plus `min-height` forced it to 746px wide and cut off the right-hand hotspots. Phones now use a fixed 460px height.
- `<body suppressHydrationWarning>`: browser extensions (Grammarly) inject attributes that caused a false hydration warning.

**Temporary:** `src/lib/catalog.ts` is static data, replaced by Prisma queries in Phase 4. The cart and wishlist live client-side in a persisted Zustand store until Phase 3/4 adds server carts.

## Phase 3 — Storefront functionality ⬜
## Phase 4 — Database and backend ⬜
Plan: PostgreSQL 16 in Docker (Docker 24 is installed; `psql` is not), Prisma, money stored as integer paisa.
## Phase 5 — Authentication ⬜
## Phase 6 — Checkout and orders ⬜
Cash on Delivery will be fully working. SSLCommerz, bKash and Nagad are ⛔ until sandbox credentials are provided; they will be modular providers, and nothing will be marked paid without server-side verification.
## Phase 7 — Admin dashboard ⬜
## Phase 8 — Reviews, coupons, newsletter, SEO ⬜
## Phase 9 — Testing and optimisation ⬜
## Phase 10 — Production preparation ⬜

## How to run
```
npm install
npm run dev   # http://localhost:3000
```
