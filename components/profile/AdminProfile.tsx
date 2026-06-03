"use client";

import { useState } from "react";
import { OrderParams } from "@/constant.types";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { ShieldCheck, Package, Star, Users, ChevronDown } from "lucide-react";
import Link from "next/link";

type Tab = "orders" | "reviews" | "users";

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

export default function AdminProfile({
  orders: initialOrders,
  reviews,
  users,
  adminEmail,
}: {
  orders: OrderParams[];
  reviews: any[];
  users: any[];
  adminEmail: string;
}) {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderParams[]>(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  const toggleStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === "delivered" ? "processing" : "delivered";
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const tabs = [
    { key: "orders",  label: "All Orders",  icon: Package, count: orders.length },
    { key: "reviews", label: "All Reviews", icon: Star,    count: reviews.length },
    { key: "users",   label: "All Users",   icon: Users,   count: users.length },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f7f4]" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="bg-[#043033] text-white px-6 md:px-16 lg:px-32 py-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="bg-amber-400/20 border border-amber-400/40 rounded-full p-3">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-400">Admin Dashboard</p>
            <h1 className="text-2xl font-bold">{adminEmail}</h1>
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
              <p className="text-gray-400 text-center py-16">No orders yet</p>
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
                  <p className="text-xs text-gray-400 mt-0.5">{order.user_email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500">Qty: {order.quantity_bought}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{process.env.NEXT_PUBLIC_CURRENCY}{order.amount_paid}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{order.city}, {order.state}</span>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>

                {/* Toggle button */}
                <button
                  onClick={() => toggleStatus(order.id, order.status)}
                  disabled={updating === order.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    order.status === "delivered"
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-[#043033] text-white hover:bg-[#021a16]"
                  } disabled:opacity-50`}
                >
                  {updating === order.id ? (
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {order.status === "delivered" ? "Mark Processing" : "Mark Delivered"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-gray-400 text-center py-16">No reviews yet</p>
            )}
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-[#2A1F14]">{review.review_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{review.product_name} • {review.user_id}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{review.review_description}</p>
                    <div className="flex gap-4 mt-2">
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

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div className="space-y-3">
            {users.length === 0 && (
              <p className="text-gray-400 text-center py-16">No users found</p>
            )}
            {users.map((user: any) => (
              <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#043033] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(user.email || user.full_name || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2A1F14] truncate">{user.full_name || "—"}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email || user.id}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link href="/" className="fixed bottom-5 right-5 bg-[#043033] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#021a16] transition">
      - continue shopping
      </Link>
    </div>
  );
}
