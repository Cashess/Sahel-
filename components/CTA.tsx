import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-black text-white py-24 text-center">
      <h2 className="text-4xl font-bold">
        Taste the Premium Difference
      </h2>

      <p className="text-gray-400 mt-4 mb-6">
        Join thousands enjoying SAHELNUT cashews daily.
      </p>

      <Link
        href="/"
        className="mt-8 bg-amber-500 text-black px-8 py-4 rounded-xl font-semibold hover:bg-amber-600"
      >
        Order Now
      </Link>
    </section>
  );
}