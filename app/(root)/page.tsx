import React from "react";
import  Card  from "@/components/Card";


const products = [
  {
    id: 1,
    title: "Premium Roasted Cashews",
    subtitle: "Crunchy & Lightly Salted",
    meta: "250g Pack",
    price: 12.99,
    imageSrc: "/cashew/cashew-1.jpg",
    badge: { label: "New Harvest", tone: "orange" as const },
  },
  {
    id: 2,
    title: "Organic Cashew Milk",
    subtitle: "Dairy-Free & Smooth",
    meta: "1L Bottle",
    price: 8.99,
    imageSrc: "/cashew/cashew-2.jpg",
    badge: { label: "Hot Seller", tone: "red" as const },
  },
  {
    id: 3,
    title: "Cashew Butter Spread",
    subtitle: "Rich & Creamy",
    meta: "300g Jar",
    price: 10.99,
    imageSrc: "/cashew/cashew-3.jpg",
    badge: { label: "Trending", tone: "green" as const },
  },
  {
    id: 4,
    title: "Raw Export Cashew Kernels",
    subtitle: "Unprocessed & Natural",
    meta: "500g Pack",
    price: 15.99,
    imageSrc: "/cashew/cashew-4.jpg",
  },
];

const Home = async () => {
  
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest" className="pb-12">
        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Fresh from the Farm
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
          {products.map((p) => (
            <Card
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              meta={p.meta}
              imageSrc={p.imageSrc}
              price={p.price}
              badge={p.badge}
              href={`/products/${p.id}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;