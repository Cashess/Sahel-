"use client";

import { createOrder } from "@/lib/supabase/actions/order.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { cartStore } from "@/components/store/cart-store";

export const VerifyPay = ({
  reference,
  amount,
  email,
}: {
  reference: string;
  amount: number;
  email: string;
}) => {
  const router = useRouter();

  useEffect(() => {
    const paymentInfo = JSON.parse(
      localStorage.getItem("paymentInformation") || "{}"
    );

    if (
      paymentInfo.amount !== amount / 100 ||
      paymentInfo.userEmail !== email
    ) {
      toast.error("Payment Verification Error");
      return;
    }

    toast.success("Payment Verified Successfully");

    const makeOrder = async () => {
      try {
        const localStorageItems = JSON.parse(
          localStorage.getItem("paymentInformation") || "{}"
        );

        const orderItems = {
          user_id: localStorageItems.userId,
          amount: localStorageItems.amount,
          user_email: localStorageItems.userEmail,
          productName: "Cart Purchase",
          quantity: localStorageItems.items?.length || 1,
          productCategory: "Multiple",
          productImage: localStorageItems.items?.[0]?.image_url_array?.[0] || "",
          address: localStorageItems.address,
          paymentReference: reference,
        };

        const orderId = await createOrder(orderItems);

        // ✅ Clear cart only after order succeeds
        cartStore.getState().clearCartItems();

        router.replace(`/order/${orderId}`);
      } catch (err) {
        console.error("Order creation failed:", err);
        toast.error("Failed to create order. Please contact support.");
      }
    };

    makeOrder();
  }, [amount, email, reference, router]);

  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-lg font-semibold">Verifying Payment...</h1>
      <p>Payment Reference: {reference}</p>
      <p>Payment Amount: {amount}</p>
      <p>Customer Email: {email}</p>
    </div>
  );
};