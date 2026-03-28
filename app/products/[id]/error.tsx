'use client';

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error("Product page error:", error);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl font-bold">Something went wrong 😵</h1>
      <p className="text-gray-500 mt-2">
        We couldn’t load this product right now.
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>

        <Link
          href="/products"
          className="border px-6 py-2 rounded-lg"
        >
          Back to Products
        </Link>
      </div>
    </main>
  );
}