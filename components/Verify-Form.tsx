"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { verifyOtp } from "@/lib/supabase/actions/user.Auth.action";

export default function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Enter OTP code");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtp(email, token);

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      // success handled by redirect in server
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleVerify} className="space-y-4">
        <h1 className="text-xl font-semibold">Enter OTP</h1>

        <input
          type="text"
          placeholder="Enter code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border p-2"
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}