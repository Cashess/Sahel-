"use client";

import { ProductParams } from "@/constant.types";
import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";
import { useState } from "react";
import Footer from "./Footer";


function TrustBar() {
  const items = [
    { icon: "🌰", label: "Premium Cashew Blend" },
    { icon: "🌿", label: "100% Plant-Based" },
    { icon: "🚚", label: "Nationwide Delivery" },
    { icon: "↩️", label: "15-Day Guarantee" }, ,
  ];

  return (
    <div className="flex flex-wrap gap-3 py-4 border-y border-gray-200">
      {items.map((item, index) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-[#F7F5F0] rounded-full px-3 py-1.5"
        >
          <span>{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
// ⭐ Clean Star Rating (no assets)
const StarRating = ({ rating = 4.5 }: { rating?: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating)
              ? "text-amber-500"
              : "text-gray-300"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

const ProductDetails = ({ product }: { product: ProductParams }) => {
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    const addItem = cartStore.getState().addItem;
    addItem(product);
    toast.success("Added to cart 🌰");
  };

  return (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10 bg-[#FAFAF8] min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* 🖼 IMAGE SECTION */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-[#F3F1EC]">
              <Image
                src={product.image_url_array[activeImage]}
                alt={product.name}
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* thumbnails */}
            <div className="flex gap-2">
              {product.image_url_array.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border ${activeImage === i
                      ? "border-[#6B4F3B]"
                      : "border-gray-200"
                    }`}
                >
                  <Image
                    src={img}
                    alt=""
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 📄 PRODUCT INFO */}
          <div className="flex flex-col space-y-6">

            <h1 className="text-3xl font-bold text-[#2A2A2A]">
              {product.name}
            </h1>

            <StarRating rating={product.rating ?? 4.5} />

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <TrustBar />

            {/* 💰 PRICE */}
            <div>
              <p className="text-3xl font-semibold text-[#3A2F23]">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {product.price}
                {product.offer_price && (
                  <span className="text-base line-through text-gray-400 ml-2">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.offer_price}
                  </span>
                )}
              </p>
            </div>

            {/* 🌿 PRODUCT DETAILS */}
            <div className="bg-[#745e28] rounded-xl p-4 text-sm space-y-2">
              <p>
                <span className="font-medium">Brand:</span>{" "}
                {product.brand ?? "Cashew Billion"}
              </p>

              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category?.name}
              </p>

              {product.product_comment && (
                <p className="text-gray-500 italic">
                  {product.product_comment}
                </p>
              )}
            </div>

            {/* 🛒 ACTIONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl border border-[#3A2F23] text-[#3A2F23] hover:bg-[#3A2F23] hover:text-white transition"
              >
                Add to Cart
              </button>

              <Link
                href={`/buy-now/${product.id}`}
                className="w-full py-3 rounded-xl bg-[#3A2F23] text-white text-center hover:bg-black transition"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* 📸 EXTRA IMAGES */}
        {product.image_url_array.length > 1 && (
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {product.image_url_array.map((img, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  src={img}
                  alt={`extra-${i}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;