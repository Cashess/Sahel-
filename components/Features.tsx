export function Features() {
  const items = [
    { title: "Premium Grade", desc: "Only the top 1% of cashews selected." },
    { title: "Rich Taste", desc: "Naturally buttery and crunchy texture." },
    { title: "Locally Sourced", desc: "Supporting African farmers directly." },
  ];

  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {items.map((f, i) => (
          <div key={i} className="p-6 border rounded-2xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}