export function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl font-bold mb-10 text-orange-600">
          What Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Best cashew I’ve ever tasted. Super fresh!",
            "Premium quality, worth every naira USD 10/10!",
            "I keep reordering. Addictive crunch!"
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-700">“{t}”</p>
              <p className="mt-4 text-sm text-gray-500">— Verified Buyer</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}