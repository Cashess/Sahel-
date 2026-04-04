import HomeProducts from "@/components/HomeProducts";
import { fetchProducts } from "@/lib/supabase/actions/product.actions";

const Home = async () => {
  const allProducts = await fetchProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <HomeProducts products={allProducts ?? []} />
    </main>
  );
};

export default Home;