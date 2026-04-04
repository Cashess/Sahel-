"use client";

import { login } from '@/lib/supabase/actions/user.Auth.action';
import { emailValidationSchema } from '@/lib/zodvalidations/form-validations';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const LoginUser = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        const emailCheck = emailValidationSchema.safeParse({ email });

        if (!emailCheck.success) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("email", email);

            // 🚨 This will redirect automatically if successful
            const res = await login(formData);

            // ✅ Only runs if there is NO redirect (i.e error case)
            if (res?.error) {
                toast.error(res.error);
                setLoading(false);
            }

        } catch (error) {
            // ⚠️ When redirect happens, Next.js throws internally — ignore it
            console.log("Handled redirect or error:", error);
        }
    };

    return (   
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">

                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Welcome Back 👋 To Sahel Golden Nut
                </h1>

                <div className="flex items-center justify-center">
                    <Image 
                        src="/cashewmoonLogo.png" 
                        alt="Cashew Moon" 
                        width={68} 
                        height={68} 
                    />
                </div>

                <p className="text-center text-gray-500 mt-2">
                    Login to your account
                </p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">

                    <input
                        type="email"
                        placeholder="Email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 text-amber-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black text-white py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-amber-500 mt-6">
                    Don’t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-black font-medium hover:underline"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
};