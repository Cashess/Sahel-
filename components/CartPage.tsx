"use client";

import Navbar from "@/components/Navbar";
import { AddressParams } from "@/constant.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContextProvider";
import { ArrowBigDown, ArrowBigUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "./Footer";

const CartPage = ({ addresses }: { addresses: AddressParams[] }) => {
  const router = useRouter();
  const { items, decreaseQty, increaseQty } = cartStore((state) => state);
  const { session } = useAppContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [deducedShippingFee, setDeducedShippingFee] = useState(0);

  // ✅ Calculate totals properly
  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );

    const shipping = items.reduce(
      (sum, item) =>
        sum + (item.product_shipping_fee ?? 0) * item.quantity,
      0
    );

    setTotalCost(total);
    setDeducedShippingFee(shipping);
  }, [items]);

  // ✅ Handle addresses
  useEffect(() => {
    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddress || null);
    }
  }, [addresses]);

  // ✅ Payment handler (CART SAFE)
  const payNow = async () => {
    if (!selectedAddress) return toast.error("Select an address first!");
    if (!items.length) return toast.error("Cart is empty!");

    try {
      const finalAmount = totalCost + deducedShippingFee;

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: finalAmount * 100, // Paystack uses kobo
          source: "cart-checkout",
        }),
      });

      const response = await res.json();

      const authorization_url = response?.data?.authorization_url;
      if (!authorization_url) {
        throw new Error(response.error || "Payment initialization failed");
      }

      // ✅ Store full cart info
      localStorage.setItem(
        "paymentInformation",
        JSON.stringify({
          userId: session?.user?.id,
          items,
          amount: finalAmount,
          userEmail: session?.user?.email,
          address: selectedAddress,
        })
      );

      router.push(authorization_url);
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Try again.");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        {/* ================= LEFT SIDE ================= */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-[#043033]">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {totalItems} items
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-6 text-gray-600">Product</th>
                  <th className="pb-6 text-gray-600">Price</th>
                  <th className="pb-6 text-gray-600">Quantity</th>
                  <th className="pb-6 text-gray-600">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="flex items-center gap-4 py-4">
                      <div className="w-20 h-20 relative bg-gray-100 rounded">
                        <Image
                          src={item.image_url_array?.[0] || "/fallback.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p>{item.name}</p>
                    </td>

                    <td>
                      {process.env.NEXT_PUBLIC_CURRENCY}
                      {item.price}
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => decreaseQty(item.id)}>
                          <ArrowBigDown />
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => increaseQty(item.id)}>
                          <ArrowBigUp />
                        </button>
                      </div>
                    </td>

                    <td>
                      {process.env.NEXT_PUBLIC_CURRENCY}
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            href="/"
            className="flex items-center mt-6 gap-2 bg-black text-white px-4 py-2 rounded"
          >
            <ArrowRight size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full md:w-96 bg-gray-100 p-5 rounded text-gray-900">
          <h2 className="text-xl font-medium">Order Summary</h2>

          {/* Address */}
          <div className="mt-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border p-2 text-left"
            >
              {selectedAddress
                ? `${selectedAddress.address}, ${selectedAddress.city}`
                : "Select Address"}
            </button>

            {isDropdownOpen && (
              <ul className="border mt-1 bg-white">
                {userAddresses.map((addr, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {addr.address}, {addr.city}, {addr.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/address")}
                  className="p-2 text-center cursor-pointer text-black"
                >
                  + Add Address
                </li>
              </ul>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-3 text-black">
            <div className="flex justify-between">
              <p>Items</p>
              <p>{totalItems}</p>
            </div>

            <div className="flex justify-between">
              <p>Shipping</p>
              <p>
                {process.env.NEXT_PUBLIC_CURRENCY}
                {deducedShippingFee}
              </p>
            </div>

            <div className="flex justify-between font-bold text-lg text-black">
              <p>Total</p>
              <p>
                {process.env.NEXT_PUBLIC_CURRENCY}
                {totalCost + deducedShippingFee}
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={payNow}
            disabled={!selectedAddress}
            className="w-full bg-black text-white p-3 mt-5 disabled:bg-gray-400"
          >
            Pay Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;