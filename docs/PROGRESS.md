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

## Phase 2 — React / Next.js migration ✅ (all designed pages ported)
- ✅ App scaffold: Next.js 15 App Router, TypeScript, Tailwind v4, Zustand, Zod
- ✅ Design system ported (`globals.css`)
- ✅ Layout: header, mega menu, search, mobile menu, footer, bag drawer, quick view, toast
- ✅ Homepage: all 8 sections, checked in Chrome (desktop) and at 360px (no horizontal overflow)
- ✅ /shop, /shop/[category], /collections, /collections/[slug], /search: sticky toolbar, filter drawer (price band, colour family, new, sale), sort, 3/4-column density, empty state. Filters live in the URL, so every filtered view can be shared and server-rendered. Checked in Chrome, and at 360px with no overflow.
- ✅ /product/[slug]: 4-view gallery, colour, quantity, add to bag, wishlist, Dhaka/outside delivery estimate, details sections, "Complete the look", sticky add-to-bag bar on phones, Product and BreadcrumbList JSON-LD, canonical URLs. Checked in Chrome.
- ✅ /wishlist: saved pieces, remove, move to bag, move all, share (sends product links), "You may also love". Checked in Chrome.
- ✅ /cart: free-delivery progress, quantity, save for later, remove with Undo, promo code, order summary. Checked in Chrome.
- 🟡 /checkout: the 3-step design (contact and address with validation, delivery options, payment) is built and checked. **Placing an order is not switched on yet**: the button explains that nothing was placed or sent. Real orders arrive in Phase 6.
- 🟡 /order-confirmation/[orderId]: design built. Only `/order-confirmation/sample` exists (labelled as a sample); every other id returns 404 until Phase 6 loads real orders.
- 🟡 /login, /register: split-screen design, tabs (switch the URL), validation, show/hide password, strength hint, forgot-password view. **Submitting does nothing yet** and says so; accounts arrive in Phase 5.
- 🟡 /account, /account/orders, /account/orders/[id], /account/addresses, /account/profile: full design, clearly labelled **"Preview with sample data"**. Address and profile edits are not saved. "Buy again" adds the pieces to the real bag. Phase 5 swaps the sample data for the signed-in customer and protects these routes.
- ✅ /about: hero, beliefs, 4-step process (selectable), materials, showroom call to action.
- 🟡 /contact: topic pills (also `?topic=visit` from the About page), order-number and visit fields, validation, FAQ with FAQPage JSON-LD. **Messages are not sent yet** (needs an email provider); the success screen says so.
- ✅ /shipping-policy, /return-policy, /privacy-policy, /terms: no design existed, so they reuse the design's type, pills and accents (`components/PolicyPage.tsx`). ⚠️ The wording is a draft based on the delivery/returns facts already on the site; the owner must review it (and have privacy/terms checked legally) before launch.

All of the above checked in Chrome and at 360px with no horizontal overflow.

**Needs your input before launch:**
- Showroom address, phone and email are still the design's placeholders, in one file: `src/lib/site.ts`.
- Policy wording (see above).
- The bag's trust line says "bKash · Nagad · Cards · Cash on delivery"; only Cash on Delivery works until Phase 6. The Contact FAQ already says the others are coming.

**Fixes made during migration (no visual change on desktop):**
- Shop the Room on phones: `aspect-ratio: 16/9` plus `min-height` forced it to 746px wide and cut off the right-hand hotspots. Phones now use a fixed 460px height.
- `<body suppressHydrationWarning>`: browser extensions (Grammarly) inject attributes that caused a false hydration warning.

**Design changes (with reasons):**
- Checkout payment: the design's inline card-number fields are removed. Card payments will go through SSLCommerz's hosted page, so the site never handles card numbers (PCI scope). bKash, Nagad and card are shown but disabled until their sandbox credentials are configured; Cash on Delivery is the only selectable method.
- Wishlist "Share list" shares the product links, because the list itself is stored only in this browser until accounts sync it.

**Structure:** storefront routes live in the `src/app/(store)` route group (announcement bar, header, footer). `/checkout` has the design's minimal header and no footer; `/order-confirmation` has its own header plus the footer.

**Pricing rules** (`src/lib/pricing.ts`): free Dhaka standard delivery from ৳ 15,000 (otherwise ৳ 600), Express ৳ 1,200, outside Dhaka ৳ 1,500, coupon NESTORA10 = 10%. Phase 6 recomputes all totals on the server from these rules; the browser's totals are display only.

**Temporary:** `src/lib/catalog.ts` is static data, replaced by Prisma queries in Phase 4. Coupons are a hard-coded list until Phase 8. The cart, wishlist and applied promo code live client-side in a persisted Zustand store until Phase 3/4 adds server carts.

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
