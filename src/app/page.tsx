import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ShopTheRoom } from "@/components/home/ShopTheRoom";
import { Editorial } from "@/components/home/Editorial";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Inspiration } from "@/components/home/Inspiration";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <ShopTheRoom />
      <Editorial />
      <NewArrivals />
      <Inspiration />
      <Newsletter />
    </>
  );
}
