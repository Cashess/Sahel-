import BuyNowPage from "@/components/BuyNowPage";
import { fetchAddresses } from "@/lib/supabase/actions/address.actions";
import { fetchProductById } from "@/lib/supabase/actions/product.actions";

export default async function BuyNow({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await fetchProductById(productId);
  const addresses = await fetchAddresses();
  return <BuyNowPage product={product} addresses={addresses} />;
}
