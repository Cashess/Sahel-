import ReviewOrderPage from "@/components/ReviewOrderPage";
import { fetchOrderById } from "@/lib/supabase/actions/order.actions";

export default async function AddReview({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const orderData = await fetchOrderById(orderId);

  return (
    <>
      <ReviewOrderPage orderData={orderData} />
    </>
  );
}
