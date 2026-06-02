// app/add-review/[orderId]/page.tsx — unchanged logic, clean file
import ReviewOrderPage from "@/components/ReviewOrderPage";
import { fetchOrderById } from "@/lib/supabase/actions/order.actions";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function AddReview({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const orderData = await fetchOrderById(orderId);

  // Guard: if order not found, redirect back to reviews list
  if (!orderData) {
    redirect("/reviews");
  }

  return (
    <>
      <Navbar />
      <ReviewOrderPage orderData={orderData} />
    </>
  );
}
