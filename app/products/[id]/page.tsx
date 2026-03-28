import ProductDetails from "@/components/ProductDetails";
import { fetchProductById } from "@/lib/supabase/actions/product.actions";
import { notFound } from "next/navigation";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ FIX

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}