import { CategoryMenu, Hero, Incentives, Newsletter, ProductsSection, IntroducingSection } from "@/components";

export default function Home() {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white">
      <Hero />
      <IntroducingSection />
      <CategoryMenu />
      <ProductsSection />
    </div>
  );
}
