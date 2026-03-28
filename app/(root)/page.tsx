import React from "react";
import Card from "@/components/Card";
import HomeProducts from "@/components/HomeProducts";
import { fetchProducts } from "@/lib/supabase/actions/product.actions";
const allProducts = await fetchProducts();
console.log("Fetched products:", allProducts);

const Home = async () => {

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <HomeProducts products={allProducts} />

    </main>
  );
};

export default Home;