"use client";

import { OrderParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Phone, CreditCard } from "lucide-react";

const OrderPage = ({ orderData }: { orderData: OrderParams }) => {
  // Format date if available
  const formattedDate = orderData.created_at 
    ? new Date(orderData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Get status color
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'processing') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'shipped') return 'bg-purple-100 text-purple-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96 w-full bg-gray-100">
              <Image
                src={orderData.image_url}
                alt={orderData.product_name || "Product image"}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Order Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {orderData.product_name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(orderData.status)}`}>
                {orderData.status || "Pending"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-[#043033]">
                {process.env.NEXT_PUBLIC_CURRENCY} {orderData.amount_paid?.toLocaleString()}
              </p>
              {formattedDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Ordered on {formattedDate}
                </p>
              )}
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Shipping Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Shipping Address
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 ml-8">
                <p className="text-gray-800">
                  {orderData.address}, {orderData.city}
                </p>
                <p className="text-gray-800">
                  {orderData.state}, {orderData.region}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Contact Number
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 ml-8">
                <p className="text-gray-800">
                  {orderData.country_code} {orderData.phone}
                </p>
              </div>

              {orderData.payment_method && (
                <>
                  <div className="flex items-center gap-3 mt-4">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      Payment Method
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 ml-8">
                    <p className="text-gray-800 capitalize">
                      {orderData.payment_method}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {process.env.NEXT_PUBLIC_CURRENCY} {orderData.amount_paid?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#043033] font-bold">
                    {process.env.NEXT_PUBLIC_CURRENCY} {orderData.amount_paid?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/orders"
                className="flex-1 text-center py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                View All Orders
              </Link>
              <Link
                href="/shop"
                className="flex-1 text-center py-3 rounded-xl bg-[#043033] text-white hover:bg-[#021a16] transition"
              >
                Shop Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;