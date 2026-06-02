"use client";

import { Leaf, Trees, Droplets } from "lucide-react";

export default function ClimateContribution() {
  const items = [
    {
      icon: <Trees className="w-6 h-6" />,
      title: "Tree-Based Farming",
      description:
        "Our cashews are sourced from farms where trees help support healthy soil and local biodiversity.",
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Water Stewardship",
      description:
        "Sustainable farming practices help conserve water and protect the surrounding environment.",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "A Greener Future",
      description:
        "By supporting responsible agriculture, every purchase contributes to long-term environmental sustainability.",
    },
  ];

  return (
    <section className="py-24 bg-[#faf8f3]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            <Leaf className="w-4 h-4" />
            Climate Contribution
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            Growing Cashews,
            <span className="block text-amber-600">
              Respecting Nature
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            We believe great products should come from responsible farming
            practices that help preserve the land for future generations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}