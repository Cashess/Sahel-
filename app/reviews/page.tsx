// app/reviews/page.tsx
// ---------------------------------------------------------
// This is the reviews listing/landing page.
// It links to add-review/[orderId] for each order.
// ---------------------------------------------------------
import Link from "next/link";
import { fetchUserOrders } from "@/lib/supabase/actions/order.actions"; // adjust import to your actual action
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ArrowRight, Star, Package } from "lucide-react";

export default async function ReviewsPage() {
  // Fetch orders that are eligible for review (adjust to your actual data-fetching)
  const orders = await fetchUserOrders();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'Lato', 'Helvetica Neue', sans-serif" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[#C8A96E] via-[#8B6340] to-[#3A2F23]" />

        <div className="max-w-4xl mx-auto px-5 md:px-10 pt-12 pb-24">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8A96E] mb-1">
              Your Orders
            </p>
            <h1 className="text-3xl font-black text-[#2A1F14]" style={{ fontFamily: "'Georgia', serif" }}>
              Write a Review
            </h1>
            <p className="text-sm text-[#9C8776] mt-1">
              Share your experience and help other customers make better choices.
            </p>
          </div>

          {/* Orders list */}
          {!orders || orders.length === 0 ? (
            <div className="bg-white border border-[#EDE0C4] rounded-3xl p-12 text-center shadow-sm">
              <div className="bg-[#F5EDD8] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#8B6340]" />
              </div>
              <h2 className="text-base font-black text-[#2A1F14] mb-2">No orders yet</h2>
              <p className="text-sm text-[#9C8776] mb-6">
                You haven't placed any orders. Shop now and come back to leave a review!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#3A2F23] text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-[#2A1F14] transition"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#EDE0C4] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-5 p-5">
                    {/* Product image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5EDD8] to-[#EDE0C4] border border-[#D4C5A9]/50">
                      <Image
                        src={order.image_url}
                        alt={order.product_name}
                        width={0}
                        height={0}
                        sizes="80px"
                        style={{ width: "100%", height: "100%" }}
                        className="object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-[#2A1F14] truncate" style={{ fontFamily: "'Georgia', serif" }}>
                        {order.product_name}
                      </h3>
                      <p className="text-base font-black text-[#3A2F23] mt-0.5">
                        {process.env.NEXT_PUBLIC_CURRENCY} {order.amount_paid}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-[#9C8776]">{order.city}, {order.state}</span>
                        {order.has_review ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                            <Star className="w-2.5 h-2.5" /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                            Awaiting review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                      {order.has_review ? (
                        <span className="text-xs text-[#9C8776] font-semibold">Done ✓</span>
                      ) : (
                        <Link
                          href={`/add-review/${order.id}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3A2F23] to-[#2A1F14] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:from-[#2A1F14] hover:to-[#1A0F04] transition-all duration-200 shadow-md active:scale-95"
                        >
                          Write Review
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link href="/" className="text-blue-100 hover:underline">
      -Browse Products
      </Link>
    </>
  );
}
