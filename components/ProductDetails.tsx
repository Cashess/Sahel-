"use client";

import { ProductParams } from "@/constant.types";
import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";
import { useState } from "react";
import { Calendar, Gift, Truck, Star, ChevronDown, ChevronUp, Shield, Leaf, Award, Users, Zap, Heart, CheckCircle, Quote, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────
// TRUST BAR — unchanged logic, redesigned skin
// ─────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: "🌰", label: "Premium Cashew Blend" },
    { icon: "🌿", label: "100% Plant-Based" },
    { icon: "🚚", label: "Nationwide Delivery" },
    { icon: "↩️", label: "15-Day Guarantee" },
  ];

  return (
    <div className="flex flex-wrap gap-2 py-4 border-y border-[#D4C5A9]/50">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#5C4A32] bg-gradient-to-r from-[#F5EDD8] to-[#EDE0C4] rounded-full px-3.5 py-1.5 border border-[#D4C5A9]/60 shadow-sm"
        >
          <span className="text-sm">{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// STAR RATING — unchanged logic, refined visuals
// ─────────────────────────────────────────────
const StarRating = ({ rating = 4.5, count }: { rating?: number; count?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <svg
              key={i}
              className={`w-4 h-4 ${filled || half ? "text-amber-400" : "text-[#D4C5A9]"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-sm font-bold text-[#3A2F23]">{rating.toFixed(1)}</span>
      {count && <span className="text-xs text-[#9C8776]">({count.toLocaleString()} reviews)</span>}
    </div>
  );
};

// ─────────────────────────────────────────────
// SUBSCRIPTION & PROMO — exact same logic
// ─────────────────────────────────────────────
const SubscriptionPromo = ({
  onSubscribeChange,
  onQuantityChange,
  quantity,
}: {
  onSubscribeChange: (value: boolean) => void;
  onQuantityChange: (value: number) => void;
  quantity: number;
}) => {
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);
  const [tempQuantity, setTempQuantity] = useState<number>(quantity);

  const handleSubscribeToggle = () => {
    const newValue = !isSubscribe;
    setIsSubscribe(newValue);
    onSubscribeChange(newValue);
    if (newValue) {
      toast.success("Monthly subscription activated! Free delivery on all orders.");
    } else {
      toast("Subscription cancelled", { icon: "📦" });
    }
  };

  const handleQuantityUpdate = (qty: number) => {
    setTempQuantity(qty);
    onQuantityChange(qty);
  };

  const qualifiesForFreeShipping: boolean = tempQuantity >= 3;
  const subscriptionFreeShipping: boolean = isSubscribe;
  const isShippingFree: boolean = qualifiesForFreeShipping || subscriptionFreeShipping;

  return (
    <div className="mt-4 space-y-3">
      {/* Monthly Subscription Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A1F14] to-[#3A2F23] p-5 rounded-2xl shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
        <div className="relative flex items-start gap-3">
          <div className="bg-amber-400/20 p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Monthly Subscription</p>
                <p className="text-xs text-amber-300/80 mt-0.5">FREE delivery, every month</p>
              </div>
              <button
                onClick={handleSubscribeToggle}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-inner ${
                  isSubscribe ? "bg-amber-400" : "bg-white/20"
                }`}
                aria-label="Toggle subscription"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isSubscribe ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {isSubscribe && (
              <div className="mt-3 flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-300 font-semibold">✓ Free delivery activated on every order</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy 3 Get Free Delivery Promo */}
      {!isSubscribe && tempQuantity < 3 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-400/20 p-1.5 rounded-lg">
                <Gift className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">Buy 3, Ship FREE!</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Add <span className="font-bold text-amber-900">{3 - tempQuantity}</span> more to qualify
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-amber-200 px-1 py-0.5 shadow-sm">
              <button
                onClick={() => handleQuantityUpdate(Math.max(1, tempQuantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-amber-800 hover:bg-amber-50 rounded-lg transition font-bold"
              >
                −
              </button>
              <span className="text-sm font-bold text-amber-900 w-6 text-center">{tempQuantity}</span>
              <button
                onClick={() => handleQuantityUpdate(tempQuantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-amber-800 hover:bg-amber-50 rounded-lg transition font-bold"
              >
                +
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${(tempQuantity / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {qualifiesForFreeShipping && !isSubscribe && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-xs text-emerald-800 font-semibold">
            🎉 Free delivery unlocked! Buying {tempQuantity} items qualifies you.
          </p>
        </div>
      )}

      {/* Standalone Quantity selector */}
      {!isSubscribe && tempQuantity < 3 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-[#5C4A32]">Quantity</span>
          <div className="flex items-center gap-3 bg-[#F5EDD8] rounded-xl px-1 py-1 border border-[#D4C5A9]/50">
            <button
              onClick={() => handleQuantityUpdate(Math.max(1, tempQuantity - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-[#D4C5A9]/50 hover:bg-[#EDE0C4] transition shadow-sm font-bold text-[#3A2F23]"
            >
              −
            </button>
            <span className="text-base font-bold text-[#3A2F23] w-8 text-center">{tempQuantity}</span>
            <button
              onClick={() => handleQuantityUpdate(tempQuantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#3A2F23] hover:bg-[#2A1F14] transition shadow-sm font-bold text-white"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Shipping status pill */}
      <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${isShippingFree ? "bg-emerald-50 border border-emerald-200" : "bg-[#F5EDD8] border border-[#D4C5A9]/50"}`}>
        <div className="flex items-center gap-2">
          <Truck className={`w-4 h-4 ${isShippingFree ? "text-emerald-600" : "text-[#9C8776]"}`} />
          <span className="text-sm text-[#5C4A32]">Delivery</span>
        </div>
        <span className={`text-sm font-bold ${isShippingFree ? "text-emerald-700" : "text-[#5C4A32]"}`}>
          {isShippingFree ? "✓ FREE" : "Standard fee"}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CUSTOMER REVIEWS SECTION (new)
// ─────────────────────────────────────────────
const reviews = [
  {
    name: "Adaeze O.",
    location: "Lagos",
    rating: 5,
    date: "May 2025",
    verified: true,
    title: "Absolutely obsessed with this!",
    body: "I've tried every cashew-based product on the market and nothing comes close. The texture, the taste, the packaging — it all screams premium. My family has already finished two packs.",
    helpful: 47,
    avatar: "AO",
  },
  {
    name: "Emeka C.",
    location: "Abuja",
    rating: 5,
    date: "Apr 2025",
    verified: true,
    title: "Worth every kobo",
    body: "Ordered 3 packs for the free delivery and honestly I'm glad I did — I would have run out within a week. Great snack for work-from-home afternoons. Highly recommend the subscription.",
    helpful: 31,
    avatar: "EC",
  },
  {
    name: "Funmilayo B.",
    location: "Port Harcourt",
    rating: 4,
    date: "Apr 2025",
    verified: true,
    title: "Genuinely delicious",
    body: "Received my order in 2 days which was amazing. Taste is rich and not too sweet. Took off one star only because I wish there were more flavour varieties. Will definitely order again.",
    helpful: 22,
    avatar: "FB",
  },
  {
    name: "Chukwudi A.",
    location: "Enugu",
    rating: 5,
    date: "Mar 2025",
    verified: false,
    title: "A staple in my household",
    body: "I subscribed monthly and the free shipping saves me a lot. Product quality is consistent every time — fresh, well-packaged, and honestly the best on the market right now.",
    helpful: 18,
    avatar: "CA",
  },
];

const ratingBreakdown = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  return (
    <div className="bg-white border border-[#EDE0C4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A96E] to-[#8B6340] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
            {review.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#2A1F14]">{review.name}</p>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#9C8776]">{review.location} · {review.date}</p>
          </div>
        </div>
        <Quote className="w-6 h-6 text-[#D4C5A9] flex-shrink-0 mt-1" />
      </div>

      <div className="mt-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400" : "text-[#D4C5A9]"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="mt-2 text-sm font-bold text-[#2A1F14]">{review.title}</p>
      <p className="mt-1 text-sm text-[#5C4A32] leading-relaxed">{review.body}</p>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
            voted
              ? "bg-[#3A2F23] text-white border-[#3A2F23]"
              : "text-[#9C8776] border-[#EDE0C4] hover:border-[#C8A96E] hover:text-[#5C4A32]"
          }`}
        >
          <Heart className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
};

const CustomerReviews = ({ rating = 4.8 }: { rating?: number }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reviews : reviews.slice(0, 2);

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8A96E] mb-1">Social Proof</p>
          <h2 className="text-2xl font-bold text-[#2A1F14]" style={{ fontFamily: "'Georgia', serif" }}>
            What Our Customers Say
          </h2>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-[#9e6831]">{rating}</p>
          <StarRating rating={rating} />
          <p className="text-xs text-[#f3750e] mt-1">Based on 1,284 reviews</p>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="bg-white rounded-2xl border border-[#EDE0C4] p-5 mb-6 shadow-sm">
        <div className="space-y-2.5">
          {ratingBreakdown.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-xs font-semibold text-[#5C4A32]">{stars}</span>
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="flex-1 h-2 bg-[#F5EDD8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#9C8776] w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {displayed.map((r, i) => <ReviewCard key={i} review={r} />)}
      </div>

      <button
        onClick={() => setShowAll(v => !v)}
        className="mt-6 w-full py-3 rounded-2xl border-2 border-[#3A2F23] text-[#3A2F23] text-sm font-bold hover:bg-[#3A2F23] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
      >
        {showAll ? "Show less" : "Load all 1,284 reviews"}
        {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </section>
  );
};

// ─────────────────────────────────────────────
// WHY CHOOSE US (new)
// ─────────────────────────────────────────────
const WhyChooseUs = () => {
  const pillars = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "100% Natural",
      desc: "Zero artificial additives, preservatives, or flavourings. Pure cashew goodness, nothing else.",
      color: "from-emerald-400/20 to-emerald-600/10",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Award-Winning Quality",
      desc: "Recognised by Nigeria's Food & Nutrition Institute as the leading plant-based snack of 2024.",
      color: "from-amber-400/20 to-amber-600/10",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Certified Safe",
      desc: "NAFDAC approved, ISO 22000 certified. Every batch lab-tested before it leaves our facility.",
      color: "from-blue-400/20 to-blue-600/10",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "50,000+ Happy Customers",
      desc: "From Lagos to Kano, we've delighted over fifty thousand families across Nigeria.",
      color: "from-purple-400/20 to-purple-600/10",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  return (
    <section className="mt-16">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-[#C8A96E] mb-1">The Difference</p>
        <h2 className="text-2xl font-bold text-[#92561a]" style={{ fontFamily: "'Georgia', serif" }}>
          Why Cashew Billion?
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className={`bg-gradient-to-br ${p.color} border border-[#EDE0C4] rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300`}
          >
            <div className={`${p.iconBg} ${p.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
              {p.icon}
            </div>
            <h3 className="text-sm font-bold text-[#2A1F14] mb-2">{p.title}</h3>
            <p className="text-xs text-[#5C4A32] leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// NUTRITION & INGREDIENTS (new)
// ─────────────────────────────────────────────
const NutritionSection = () => {
  const [open, setOpen] = useState(false);
  const facts = [
    { label: "Calories", per100: "553 kcal" },
    { label: "Protein", per100: "18g" },
    { label: "Healthy Fats", per100: "44g" },
    { label: "Carbohydrates", per100: "30g" },
    { label: "Dietary Fibre", per100: "3.3g" },
    { label: "Magnesium", per100: "292mg" },
  ];

  return (
    <section className="mt-10">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between bg-white border border-[#EDE0C4] rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Zap className="w-5 h-5 text-emerald-700" />
          </div>
          <span className="text-sm font-bold text-[#2A1F14]">Nutrition & Ingredients</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-[#9C8776]" /> : <ChevronDown className="w-5 h-5 text-[#9C8776]" />}
      </button>

      {open && (
        <div className="mt-3 bg-white border border-[#EDE0C4] rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {facts.map((f) => (
              <div key={f.label} className="bg-[#F5EDD8] rounded-xl p-3 text-center">
                <p className="text-lg font-black text-[#3A2F23]">{f.per100}</p>
                <p className="text-xs text-[#9C8776] mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#EDE0C4] pt-4">
            <p className="text-xs font-bold text-[#2A1F14] mb-2">Ingredients</p>
            <p className="text-xs text-[#5C4A32] leading-relaxed">
              Premium Cashew Nuts, Natural Sea Salt, Cold-Pressed Sunflower Oil. <br />
              <span className="text-[#9C8776]">Allergens: Contains Tree Nuts (Cashews). May contain traces of other nuts. No GMO. No Gluten.</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────
// DELIVERY & RETURNS (new)
// ─────────────────────────────────────────────
const DeliveryInfo = () => (
  <section className="mt-6 grid sm:grid-cols-3 gap-4">
    {[
      {
        icon: <Truck className="w-5 h-5 text-[#3A2F23]" />,
        title: "Fast Nationwide Delivery and global shipping",
        desc: "Lagos & Abuja within 24–48 hrs. Other states 2–4 business days.",
      },
      {
        icon: <Shield className="w-5 h-5 text-[#3A2F23]" />,
        title: "15-Day Satisfaction Guarantee",
        desc: "Not happy? Return any unopened pack, no questions asked.",
      },
      {
        icon: <Award className="w-5 h-5 text-[#3A2F23]" />,
        title: "Freshness Guaranteed",
        desc: "Every order sealed at peak freshness with 9-month shelf life.",
      },
    ].map((item) => (
      <div key={item.title} className="flex gap-3 bg-white border border-[#EDE0C4] rounded-2xl p-4 shadow-sm">
        <div className="bg-[#F5EDD8] p-2 rounded-xl h-fit flex-shrink-0">{item.icon}</div>
        <div>
          <p className="text-xs font-bold text-[#2A1F14]">{item.title}</p>
          <p className="text-xs text-[#9C8776] mt-1 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    ))}
  </section>
);

// ─────────────────────────────────────────────
// HERO STATS BAR (new)
// ─────────────────────────────────────────────
const HeroStats = () => (
  <div className="grid grid-cols-3 gap-px bg-[#D4C5A9]/40 rounded-2xl overflow-hidden shadow-sm mb-8">
    {[
      { value: "50K+", label: "Happy Customers" },
      { value: "4.8★", label: "Average Rating" },
      { value: "2 Days", label: "Avg. Delivery" },
    ].map((s) => (
      <div key={s.label} className="bg-white py-4 text-center">
        <p className="text-lg font-black text-[#3A2F23]">{s.value}</p>
        <p className="text-[10px] text-[#9C8776] font-semibold mt-0.5 uppercase tracking-wider">{s.label}</p>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// MAIN PRODUCT DETAILS — exact same state & logic
// ─────────────────────────────────────────────
const ProductDetails = ({ product }: { product: ProductParams }) => {
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSubscriptionPromo, setShowSubscriptionPromo] = useState<boolean>(false);

  const handleAddToCart = () => {
    const addItem = cartStore.getState().addItem;
    const productWithQuantity = { ...product, quantity };
    addItem(productWithQuantity);

    if (isSubscribed) {
      toast.success("Added to cart with subscription benefits! 🌰✨");
    } else if (quantity >= 3) {
      toast.success("Added to cart with FREE delivery! 🌰🚚");
    } else {
      toast.success("Added to cart 🌰");
    }
  };

  const handleBuyNow = () => {
    if (isSubscribed) {
      sessionStorage.setItem("hasSubscription", "true");
      sessionStorage.setItem("subscriptionBenefit", "free_shipping");
    }
    if (quantity >= 3) {
      sessionStorage.setItem("bulkOrder", "true");
      sessionStorage.setItem("bulkQuantity", quantity.toString());
      sessionStorage.setItem("freeShipping", "true");
    }
    window.location.href = `/buy-now/${product.id}?quantity=${quantity}&subscribe=${isSubscribed}`;
  };

  return (
    <>
      <Navbar />

      {/* ── PAGE WRAPPER ── */}
      <div
        className="min-h-screen bg-[#FAFAF8]"
        style={{ fontFamily: "'Lato', 'Helvetica Neue', sans-serif" }}
      >
        {/* Ambient top gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C8A96E] via-[#8B6340] to-[#3A2F23]" />

        <div className="px-5 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24 space-y-6 max-w-7xl mx-auto">

          {/* ── HERO STATS ── */}
          <HeroStats />

          {/* ── MAIN PRODUCT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* LEFT — IMAGE SECTION */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F5EDD8] to-[#EDE0C4] shadow-xl group">
                {/* Discount badge */}
                {product.offer_price && (
                  <div className="absolute top-4 left-4 z-10 bg-[#3A2F23] text-amber-300 text-xs font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                    Sale
                  </div>
                )}
                <Image
                  src={product.image_url_array[activeImage]}
                  alt={product.name}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.image_url_array.map((img: string, i: number) => (
                  <button
                    key={`thumb-${i}`}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i
                        ? "border-[#3A2F23] shadow-md scale-105"
                        : "border-[#EDE0C4] opacity-60 hover:opacity-100 hover:border-[#C8A96E]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumbnail-${i}`}
                      width={0}
                      height={0}
                      sizes="64px"
                      style={{ width: "100%", height: "auto" }}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Delivery & Returns cards */}
              <DeliveryInfo />
            </div>

            {/* RIGHT — PRODUCT INFO */}
            <div className="flex flex-col space-y-5">
              {/* Category pill */}
              <span className="inline-flex items-center self-start text-[10px] font-black tracking-widest uppercase text-[#C8A96E] bg-[#F5EDD8] border border-[#D4C5A9]/60 rounded-full px-3 py-1">
                {product.category?.name ?? "Snacks"}
              </span>

              {/* Product name */}
              <h1
                className="text-3xl lg:text-4xl font-black text-[#2A1F14] leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <StarRating rating={product.rating ?? 4.8} count={1284} />

              {/* Description */}
              <p className="text-[#5C4A32] leading-relaxed text-sm">
                {product.description}
              </p>

              {/* Trust bar */}
              <TrustBar />

              {/* Price block */}
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-[#2A1F14]">
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {product.price}
                </p>
                {product.offer_price && (
                  <p className="text-lg line-through text-[#9C8776] mb-0.5">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.offer_price}
                  </p>
                )}
                {product.offer_price && (
                  <span className="mb-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                    Save {Math.round(((product.offer_price - product.price) / product.offer_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Brand/meta chip */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#F5EDD8] border border-[#D4C5A9]/60 text-[#ffffff] rounded-full px-3 py-1 font-semibold">
                  🏷 {product.brand ?? "Cashew Billion"}
                </span>
                {product.product_comment && (
                  <span className="bg-[#F5EDD8] border border-[#D4C5A9]/60 text-[#dddddd] rounded-full px-3 py-1 italic">
                    {product.product_comment}
                  </span>
                )}
              </div>

              {/* Delivery & Promo Toggle */}
              <div className="border border-[#EDE0C4] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setShowSubscriptionPromo(!showSubscriptionPromo)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#FAFAF8] transition"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-[#2A1F14]">Delivery Offers & Subscription</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold rounded-full px-2 py-0.5 border border-amber-200">
                      Save more
                    </span>
                  </div>
                  {showSubscriptionPromo
                    ? <ChevronUp className="w-4 h-4 text-[#9C8776]" />
                    : <ChevronDown className="w-4 h-4 text-[#9C8776]" />}
                </button>

                {showSubscriptionPromo && (
                  <div className="px-4 pb-4 bg-[#FAFAF8] border-t border-[#EDE0C4]">
                    <SubscriptionPromo
                      onSubscribeChange={setIsSubscribed}
                      onQuantityChange={setQuantity}
                      quantity={quantity}
                    />
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 rounded-2xl border-2 border-[#3A2F23] text-[#3A2F23] text-sm font-bold hover:bg-[#3A2F23] hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 rounded-2xl bg-gradient-to-r from-[#3A2F23] to-[#2A1F14] text-white text-sm font-bold hover:from-[#2A1F14] hover:to-[#1A0F04] transition-all duration-200 shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  Buy Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Post-action badges */}
              {isSubscribed && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-800 font-semibold">
                    🎉 You're subscribed! FREE delivery on every order
                  </p>
                </div>
              )}
              {quantity >= 3 && !isSubscribed && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-800 font-semibold">
                    🎉 Bulk order! You're getting FREE delivery
                  </p>
                </div>
              )}

              {/* Nutrition accordion */}
              <NutritionSection />
            </div>
          </div>

          {/* ── EXTRA IMAGES GALLERY ── */}
          {product.image_url_array.length > 1 && (
            <section className="mt-12">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8A96E] mb-4">Gallery</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.image_url_array.map((img: string, i: number) => (
                  <div
                    key={`gallery-${i}`}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-2xl overflow-hidden bg-[#F5EDD8] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ring-2 ${
                      activeImage === i ? "ring-[#3A2F23] scale-[0.98]" : "ring-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`gallery-${i}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ width: "100%", height: "auto" }}
                      className="hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── WHY CHOOSE US ── */}
          <WhyChooseUs />

          {/* ── CUSTOMER REVIEWS ── */}
          <CustomerReviews rating={product.rating ?? 4.8} />

          {/* ── BOTTOM CTA BANNER ── */}
          <section className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A1F14] via-[#3A2F23] to-[#5C3D1E] p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Limited Time</p>
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Georgia', serif" }}>
                  Ready to taste the difference?
                </h2>
                <p className="text-sm text-amber-300/80 mt-2">Subscribe monthly and never run out. Cancel anytime.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 rounded-2xl border-2 border-amber-400 text-amber-400 text-sm font-bold hover:bg-amber-400 hover:text-[#2A1F14] transition-all duration-200"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 rounded-2xl bg-amber-400 text-[#2A1F14] text-sm font-bold hover:bg-amber-300 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  Buy Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ProductDetails;
