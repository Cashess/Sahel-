"use client";

import { useAppContext } from "@/context/AppContextProvider";
import { AddressParams, ProductParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowBigDown, ArrowBigUp,  ArrowRightCircleIcon } from "lucide-react";

const BuyNowPage = ({
  product,
  addresses,
}: {
  product: ProductParams;
  addresses: AddressParams[];
}) => {
  const { session } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>();
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(product.price);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams | null>(
    null
  );

  const increaseQTY = () => setQuantity((prev) => prev + 1);
  const decreaseQTY = () => {
    if (quantity <= 1) return toast.error("Quantity cannot be less than 1");
    setQuantity((prev) => prev - 1);
  };

  const handleAddressSelect = (address: AddressParams) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const payNow = async () => {
    if (!selectedAddress) return toast.error("Select an address first!");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: (totalCost + product.product_shipping_fee) * 100,
          source: "buy-now",
        }),
      });
      const response = await res.json();

    // Safety check
    const authorization_url = response?.data?.authorization_url;
    if (!authorization_url) throw new Error(response.error || "Payment initialization failed");

      
      localStorage.setItem(
        "paymentInformation",
        JSON.stringify({
          userId: session?.user?.id,
          productName: product.name,
          productCategory: product.category,
          quantity,
          image: product.image_url_array[0],
          amount: totalCost + product.product_shipping_fee,
          userEmail: session?.user?.email,
          fullAddressFields: selectedAddress,
        })
      );
      router.push(authorization_url);
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    localStorage.removeItem("paymentInformation");
    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddress(defaultAddress ?? null);
    }
    setTotalCost(product.price * quantity);
  }, [quantity, product.price, addresses]);

  return (
    <div className="flex flex-col md:flex-row gap-12 px-6 md:px-16 lg:px-32 pt-14 mb-20">
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
                <div className="text-sm font-medium text-gray-700">{product.name}</div>
              </td>
              <td className="py-4">{process.env.NEXT_PUBLIC_CURRENCY}{product.price}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <button onClick={decreaseQTY} className="p-1 border rounded">
                    <ArrowBigDown width={16} height={16}/>
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button onClick={increaseQTY} className="p-1 border rounded">
                    <ArrowBigUp width={16} height={16}/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-wrap gap-2">
          {product.sizes?.map((size, i) => (
            <span key={i} className="px-3 py-1 border rounded text-sm cursor-pointer hover:bg-gray-100">
              {size}
            </span>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-[#fce3c7] px-4 py-2 rounded-2xl hover:bg-gray-800 transition"
        >
          <ArrowRightCircleIcon width={20} height={20}/> Continue Shopping
        </Link>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-96 bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">Order Summary</h3>
        <hr className="border-gray-200" />

        {/* Address Selector */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-500 mb-1 block">Select Address</label>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="w-full text-left px-4 py-2 border rounded bg-gray-50 flex justify-between items-center"
          >
            {selectedAddress
              ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
              : "Select Address"}
            <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
          </button>

          {isDropdownOpen && (
            <ul className="absolute w-full bg-white border rounded mt-1 shadow-lg z-20 max-h-60 overflow-y-auto">
              {userAddresses?.map((addr, i) => (
                <li
                  key={i}
                  onClick={() => handleAddressSelect(addr)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                >
                  {addr.address}, {addr.city}, {addr.state}
                </li>
              ))}
              <Link href="/address" className="block px-4 py-2 text-center text-blue-600 hover:bg-gray-100">
                + Add New Address
              </Link>
            </ul>
          )}
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Promo Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow p-2 border rounded"
            />
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-[#043033]">Apply</button>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-black">
            <span>Shipping Fee</span>
            <span>{process.env.NEXT_PUBLIC_CURRENCY}{product.product_shipping_fee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2 text-black">
            <span>Total</span>
            <span>{process.env.NEXT_PUBLIC_CURRENCY}{totalCost + product.product_shipping_fee}</span>
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
          <p className="text-sm text-gray-500 text-center mt-2">**Please select an address to continue**</p>
        )}
      </div>
    </div>
  );
};

export default BuyNowPage;