"use client";

import { useState } from "react";
import { OrderParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";
import { Package, Star, User } from "lucide-react";

type Tab = "orders" | "reviews";

const STATUS_COLORS: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700",
  delivered:  "bg-green-100 text-green-700",
  shipped:    "bg-blue-100 text-blue-700",
  cancelled:  "bg-red-100 text-red-700",
  completed:  "bg-emerald-100 text-emerald-700",
  reviewed:   "bg-purple-100 text-purple-700",
  waiting:    "bg-gray-100 text-gray-600",
  returned:   "bg-orange-100 text-orange-700",
};

export default function UserProfile({
  orders,
  reviews,
  userEmail,
}: {
  orders: OrderParams[];
  reviews: any[];
  userEmail: string;
}) {
  const [tab, setTab] = useState<Tab>("orders");

  const tabs = [
    { key: "orders",  label: "My Orders",  icon: Package, count: orders.length },
    { key: "reviews", label: "My Reviews", icon: Star,    count: reviews.length },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f7f4]" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="bg-[#043033] text-white px-6 md:px-16 lg:px-32 py-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="bg-white/10 border border-white/20 rounded-full p-3">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-400">My Account</p>
            <h1 className="text-2xl font-bold">{userEmail}</h1>
          </div>
        </div>

        {/* Stat pills */}
        <div className="max-w-7xl mx-auto mt-6 flex gap-4 flex-wrap">
          {tabs.map((t) => (
            <div key={t.key} className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <t.icon className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold">{t.count} {t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
                tab === t.key
                  ? "border-[#043033] text-[#043033]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No orders yet</p>
                <Link href="/" className="mt-4 inline-block bg-[#043033] text-white px-6 py-2 rounded-xl text-sm font-semibold">
                  Start Shopping
                </Link>
              </div>
            )}
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={order.image_url} alt={order.product_name} width={64} height={64} className="object-cover w-full h-full" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2A1F14] truncate">{order.product_name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-500">Qty: {order.quantity_bought}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{process.env.NEXT_PUBLIC_CURRENCY}{order.amount_paid}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>

                {/* Review button — only if not yet reviewed */}
                {order.status !== "reviewed" && order.status !== "processing" && (
                  <Link
                    href={`/add-review/${order.id}`}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition whitespace-nowrap"
                  >
                    Write Review
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-center py-16">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No reviews yet</p>
              </div>
            )}
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-[#2A1F14]">{review.review_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{review.product_name}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{review.review_description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-xs text-amber-600 font-semibold">⭐ Product: {review.product_rating}/5</span>
                      <span className="text-xs text-blue-600 font-semibold">🚚 Delivery: {review.delivery_rating}/5</span>
                    </div>
                  </div>
                  {review.review_images?.[0] && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={review.review_images[0]} alt="review" width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
