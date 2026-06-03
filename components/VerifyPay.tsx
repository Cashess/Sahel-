"use client";

import { createOrder } from "@/lib/supabase/actions/order.actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const makeOrder = async () => {
      try {
        const paymentInfo = JSON.parse(
          localStorage.getItem("paymentInformation") || "{}"
        );

        // ── Verify email only ──
        if (!paymentInfo.userEmail || paymentInfo.userEmail !== email) {
          setStatus("error");
          setErrorMsg("Payment details don't match. Please contact support.");
          toast.error("Payment Verification Error");
          return;
        }

        const address = paymentInfo.fullAddressFields ?? paymentInfo.address;
        if (!address) {
          setStatus("error");
          setErrorMsg("Address information missing. Please contact support.");
          return;
        }

        const isBuyNow = !!paymentInfo.fullAddressFields;

        const orderItems = {
          user_id: paymentInfo.userId,
          amount: paymentInfo.amount,
          user_email: paymentInfo.userEmail,
          productName: isBuyNow ? paymentInfo.productName : "Cart Purchase",
          quantity: isBuyNow ? paymentInfo.quantity : paymentInfo.items?.length || 1,
          productCategory: isBuyNow ? paymentInfo.productCategory : "Multiple",
          productImage: isBuyNow
            ? paymentInfo.image
            : paymentInfo.items?.[0]?.image_url_array?.[0] || "",
          address,
          paymentReference: reference,
        };

        const orderId = await createOrder(orderItems);

        localStorage.removeItem("paymentInformation");

        if (!isBuyNow) cartStore.getState().clearCartItems();

        setStatus("success");
        toast.success("Payment Verified Successfully!");
        router.replace(`/order/${orderId}`);

      } catch (err) {
        console.error("Order creation failed:", err);
        setStatus("error");
        setErrorMsg("Failed to create order. Please contact support.");
        toast.error("Failed to create order.");
      }
    };

    makeOrder();
  }, [amount, email, reference, router]);

  // ── Error state ──
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="text-red-500 text-5xl">✗</div>
        <h1 className="text-xl font-bold text-red-600">Verification Failed</h1>
        <p className="text-gray-600 text-sm text-center max-w-sm">{errorMsg}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold"
        >
          Go Home
        </button>
      </div>
    );
  }

  // ── Success state ──
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="text-green-500 text-5xl">✓</div>
        <h1 className="text-xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-gray-500 text-sm">Redirecting to your order...</p>
      </div>
    );
  }

  // ── Verifying state ──
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      <h1 className="text-lg font-semibold">Verifying Payment...</h1>
      <p className="text-sm text-gray-500">Reference: {reference}</p>
    </div>
  );
};