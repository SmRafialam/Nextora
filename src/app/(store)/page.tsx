import { Hero } from "@/components/home/Hero";
import { Hero3D, type HeroPiece } from "@/components/home/hero3d/Hero3D";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ShopTheRoom } from "@/components/home/ShopTheRoom";
import { Editorial } from "@/components/home/Editorial";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Inspiration } from "@/components/home/Inspiration";
import { Newsletter } from "@/components/home/Newsletter";
import { getAllProducts, newArrivals } from "@/server/catalog";

export default async function HomePage() {
  const all = await getAllProducts();
  const pick = (id: string): HeroPiece | undefined => { const p = all.find((x) => x.id === id); return p && { id: p.id, slug: p.slug, name: p.name, meta: p.meta, price: p.price }; };
  return (
    <>
      <Hero3D chair={pick("orla")} lamp={pick("sorrel")} sofa={pick("halden")} fallback={<Hero />} />
      <CategoryGrid />
      <FeaturedProducts />
      <ShopTheRoom />
      <Editorial />
      <NewArrivals items={await newArrivals()} />
      <Inspiration />
      <Newsletter />
    </>
  );
}
