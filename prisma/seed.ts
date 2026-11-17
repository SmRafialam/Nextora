// Seeds the catalog from the approved design. Safe to re-run: every write is an upsert.
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import { CATEGORIES, CATEGORY_COPY, COLLECTIONS, PRODUCTS } from "./seed-data";

const db = new PrismaClient();
const paisa = (taka: number) => Math.round(taka * 100);

// Starting stock for development. The real figures are set in the admin dashboard (Phase 7).
const seedStock = (priceTaka: number) => (priceTaka >= 20000 ? 6 : 24);

async function main() {
  for (const [i, c] of CATEGORIES.entries()) {
    const [headline, headlineEm, intro] = CATEGORY_COPY[c.slug];
    const data = { name: c.name, sub: c.sub, headline, headlineEm, intro, artKind: c.kind, artFill: c.fill, bg: c.bg, span: c.span ?? null, artInset: c.inset, labelSize: c.size, position: i };
    await db.category.upsert({ where: { slug: c.slug }, create: { slug: c.slug, ...data }, update: data });
  }

  for (const [i, p] of PRODUCTS.entries()) {
    const data = {
      slug: p.slug, name: p.name, meta: p.meta, type: p.type, description: p.description, dimensions: p.dimensions, material: p.material,
      artKind: p.kind, bg: p.bg, bgAlt: p.bgAlt, badge: p.badge ?? null, isNew: p.isNew, position: i, categorySlug: p.category,
    };
    await db.product.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
    for (const [pos, col] of p.colors.entries()) {
      const sku = `${p.id}-${col.name}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
      const v = { colorName: col.name, colorHex: col.hex, pricePaisa: paisa(p.price), compareAtPaisa: p.compareAt ? paisa(p.compareAt) : null };
      await db.variant.upsert({
        where: { productId_position: { productId: p.id, position: pos } },
        create: { productId: p.id, position: pos, sku, stock: seedStock(p.price), ...v },
        update: v, // never overwrite live stock on re-seed
      });
    }
  }

  for (const [i, c] of COLLECTIONS.entries()) {
    const data = { title: c.title[0], titleEm: c.title[1], intro: c.intro, artKind: c.kind, artFill: c.fill, bg: c.bg, position: i };
    await db.collection.upsert({ where: { slug: c.slug }, create: { slug: c.slug, ...data }, update: data });
    await db.collectionProduct.deleteMany({ where: { collectionSlug: c.slug } });
    await db.collectionProduct.createMany({ data: c.ids.map((productId, position) => ({ collectionSlug: c.slug, productId, position })) });
  }

  await db.coupon.upsert({
    where: { code: "NESTORA10" },
    create: { code: "NESTORA10", type: "PERCENT", value: 10, label: "10% off your order" },
    update: {},
  });

  const counts = await Promise.all([db.category.count(), db.product.count(), db.variant.count(), db.collection.count(), db.coupon.count()]);
  console.log(`Seeded: ${counts[0]} categories, ${counts[1]} products, ${counts[2]} variants, ${counts[3]} collections, ${counts[4]} coupon(s)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
