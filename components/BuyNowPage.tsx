"use client";

import { useAppContext } from "@/context/AppContextProvider";
import { AddressParams, ProductParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowBigDown, ArrowBigUp, ArrowRightCircleIcon, Calendar, Gift, Truck } from "lucide-react";

const BuyNowPage = ({
  product,
  addresses,
}: {
  product: ProductParams;
  addresses: AddressParams[];
}) => {
  const { session } = useAppContext();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(product.price);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams | null>(
    addresses?.find((a) => a.is_default) ?? addresses?.[0] ?? null
  );
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");

  const increaseQTY = () => setQuantity((prev) => prev + 1);
  const decreaseQTY = () => {
    if (quantity <= 1) return toast.error("Quantity cannot be less than 1");
    setQuantity((prev) => prev - 1);
  };

  const handleAddressSelect = (address: AddressParams) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // Check if quantity qualifies for free shipping (Buy 3)
  const qualifiesForFreeShipping = quantity >= 3;
  
  // Check if subscription gives free shipping
  const subscriptionFreeShipping = isSubscribe;
  
  // Determine if shipping is free
  const isShippingFree = qualifiesForFreeShipping || subscriptionFreeShipping;
  
  // Calculate final shipping fee
  const finalShippingFee = isShippingFree ? 0 : product.product_shipping_fee;

  // Calculate discount amount for promo
  const calculatePromoDiscount = () => {
    if (!promoApplied) return 0;
    if (promoCode.toUpperCase() === "WELCOME10") {
      return totalCost * 0.1;
    }
    if (promoCode.toUpperCase() === "FREESHIP") {
      return finalShippingFee;
    }
    return 0;
  };

  const promoDiscount = calculatePromoDiscount();
  
  // Calculate final total
  const finalTotal = totalCost + finalShippingFee - promoDiscount;

  // Keep total in sync with quantity changes
  useEffect(() => {
    setTotalCost(product.price * quantity);
  }, [quantity, product.price]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
      setDiscountMessage("10% discount applied!");
      toast.success("Promo code applied successfully!");
    } else if (promoCode.toUpperCase() === "FREESHIP") {
      setPromoApplied(true);
      setDiscountMessage("Free shipping applied!");
      toast.success("Free shipping promo applied!");
    } else {
      setPromoApplied(false);
      setDiscountMessage("");
      toast.error("Invalid promo code");
    }
  };

  const payNow = async () => {
    if (!selectedAddress) return toast.error("Select an address first!");
    try {
      const orderMetadata = {
        userId: session?.user?.id,
        productName: product.name,
        productCategory: product.category,
        quantity,
        image: product.image_url_array[0],
        amount: finalTotal,
        userEmail: session?.user?.email,
        fullAddressFields: selectedAddress,
        isSubscribe: isSubscribe,
        subscriptionBenefit: isSubscribe ? "Free delivery on all orders" : null,
        promoApplied: promoApplied ? promoCode : null,
        freeShippingApplied: isShippingFree,
      };

      const res = await fetch("/api/paymentBuyNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: finalTotal * 100,
          source: "buy-now",
          metadata: orderMetadata,
        }),
      });

      const response = await res.json();
      const authorization_url = response?.data?.authorization_url;
      if (!authorization_url)
        throw new Error(response.error || "Payment initialization failed");

      localStorage.setItem("paymentInformation", JSON.stringify(orderMetadata));
      router.push(authorization_url);
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col md:flex-row gap-12 px-6 md:px-16 lg:px-32 pt-14 pb-20 max-w-7xl mx-auto">
        {/* Left Panel */}
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Buy <span className="text-[#043033]">{product.name}</span>
          </h2>

          <table className="min-w-full table-auto border-b border-gray-200">
            <thead className="text-left text-gray-500">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition">
                <td className="flex items-center gap-4 py-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.image_url_array[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {product.name}
                  </div>
                </td>
                <td className="py-4">
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {product.price}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={decreaseQTY} className="p-1 border rounded hover:bg-gray-100 transition">
                      <ArrowBigDown width={16} height={16} />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button onClick={increaseQTY} className="p-1 border rounded hover:bg-gray-100 transition">
                      <ArrowBigUp width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-wrap gap-2">
            {product.sizes?.map((size, i) => (
              <span
                key={i}
                className="px-3 py-1 border rounded text-sm cursor-pointer hover:bg-gray-100 transition"
              >
                {size}
              </span>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-[#fce3c7] px-4 py-2 rounded-2xl hover:bg-gray-800 transition"
          >
            <ArrowRightCircleIcon width={20} height={20} /> Continue Shopping
          </Link>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-96 bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Order Summary</h3>
          <hr className="border-gray-200" />

          {/* Subscription Section */}
          <div className="bg-gradient-to-r from-[#043033]/5 to-transparent p-4 rounded-lg border border-[#043033]/20">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#043033] mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Monthly Subscription
                  </label>
                  <button
                    onClick={() => {
                      setIsSubscribe(!isSubscribe);
                      if (!isSubscribe) {
                        toast.success("Monthly subscription activated! Free delivery on all orders.");
                      } else {
                        toast("Subscription cancelled", { icon: '📦' });
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isSubscribe ? "bg-[#043033]" : "bg-gray-300"
                    }`}
                    aria-label="Toggle subscription"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isSubscribe ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Subscribe monthly and get FREE delivery on all orders
                </p>
                {isSubscribe && (
                  <div className="mt-2 flex items-center gap-2 text-green-600 text-xs">
                    <Truck className="w-3 h-3" />
                    <span>✓ Free delivery activated</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buy 3 Get Free Delivery Promo */}
          {!isSubscribe && quantity < 3 && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-800">
                  Buy <span className="font-bold">3 items</span> and get{" "}
                  <span className="font-bold">FREE delivery</span>!
                </p>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Add {3 - quantity} more item(s) to qualify
              </p>
            </div>
          )}

          {qualifiesForFreeShipping && !isSubscribe && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-800 font-medium">
                  ✓ Free delivery applied! You qualify for buying {quantity} items
                </p>
              </div>
            </div>
          )}

          {/* Address Selector */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              Select Address
            </label>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full text-left px-4 py-2 border rounded bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition"
            >
              <span className="truncate pr-2">
                {selectedAddress
                  ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <span
                className={`transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border rounded mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
                {addresses && addresses.length > 0 ? (
                  addresses.map((addr, i) => (
                    <li
                      key={i}
                      onClick={() => handleAddressSelect(addr)}
                      className={`px-4 py-2 cursor-pointer text-sm transition-colors ${
                        selectedAddress === addr
                          ? "bg-[#f0faf7] text-[#043033] font-medium"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <p className="font-medium text-gray-700">{addr.title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {addr.address}, {addr.city}, {addr.state}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">
                    No saved addresses
                  </li>
                )}
                <li>
                  <Link
                    href="/address"
                    className="block px-4 py-2 text-center text-sm text-[#043033] font-medium hover:bg-gray-50 border-t border-gray-100"
                  >
                    + Add New Address
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Promo Code */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="WELCOME10 or FREESHIP"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#043033]"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-black text-white px-4 py-2 rounded hover:bg-[#043033] transition"
              >
                Apply
              </button>
            </div>
            {discountMessage && (
              <p className="text-xs text-green-600 mt-1">{discountMessage}</p>
            )}
          </div>

          {/* Cost Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>
                {process.env.NEXT_PUBLIC_CURRENCY}
                {totalCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping Fee</span>
              <div className="text-right">
                {isShippingFree ? (
                  <span className="text-green-600 line-through mr-2 text-sm">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.product_shipping_fee}
                  </span>
                ) : null}
                <span className={isShippingFree ? "text-green-600 font-semibold" : ""}>
                  {isShippingFree ? "FREE" : `${process.env.NEXT_PUBLIC_CURRENCY}${product.product_shipping_fee}`}
                </span>
              </div>
            </div>
            {promoApplied && promoDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -{process.env.NEXT_PUBLIC_CURRENCY}
                  {promoDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2 text-gray-900">
              <span>Total</span>
              <span>
                {process.env.NEXT_PUBLIC_CURRENCY}
                {finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {selectedAddress ? (
            <button
              onClick={payNow}
              className="w-full py-3 bg-[#043033] text-white rounded-2xl hover:bg-[#021a16] transition"
            >
              Pay Now
            </button>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-2">
              ** Please select an address to continue **
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;