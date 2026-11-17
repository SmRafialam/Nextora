# Nextora — Nestora Home & Living

An extensible eCommerce platform for **Nestora**, a premium Home & Living brand, with the frontend and backend in one repository.

- **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Zod
- **Planned:** PostgreSQL + Prisma · Auth.js · Vitest / Playwright
- **Market:** Bangladesh first (BDT ৳), built so other markets can be added later

The UI is a 1:1 port of the approved Nestora HTML design. Its class names, colour tokens and animations are kept unchanged in `src/app/globals.css`.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project layout

```
src/
  app/                 routes (App Router)
  components/
    layout/            header, footer, announcement bar
    home/              homepage sections
    shop/              product cards, bag drawer, quick view
  lib/                 catalog/data access, formatting
  store/               client state (bag, wishlist)
docs/PROGRESS.md       phase-by-phase checklist
```

## Status

See [docs/PROGRESS.md](docs/PROGRESS.md) for what is done, in progress, and blocked.
