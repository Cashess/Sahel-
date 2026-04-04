"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for login link 🚀");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Create Account on Sahel Golden Nut
        </h1>
        <Image src="/cashewmoonLogo.png" alt="Cashew Moon" width={68} height={68} />
        <div className=" flex items-center justify-center">

          <Image src="/cashewmoonLogo.png" alt="Cashew Moon" width={68} height={68} />
        </div>


        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
          />

          <button className="w-full bg-black text-amber-700 py-3 rounded-lg">
            Send Login Link
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-black">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-6 text-amber-700">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}