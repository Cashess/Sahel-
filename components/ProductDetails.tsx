import Image from "next/image";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function ProductDetails({ product }: any) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <Navbar/>
      <div className="grid md:grid-cols-2 gap-10 mt-19">

        {/* 🖼 IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={product.image_url_array[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* thumbnails */}
          <div className="flex gap-2">
            {product.image_url_array.map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border"
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 📦 DETAILS */}
        <div className="flex flex-col justify-center space-y-5">

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-sm text-gray-500">
            ⭐ 4.8 • Trusted by 200+ customers
          </p>

          <p className="text-2xl font-bold text-amber-600">
            ${product.price?.toFixed(2)}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* trust bullets */}
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✔️ Premium quality cashews</li>
            <li>✔️ Freshly processed</li>
            <li>✔️ Secure packaging</li>
          </ul>

          {/* CTA */}
          <div className="flex gap-4 pt-4">
            <button className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700">
              Add to Cart
            </button>

            <button className="flex-1 border py-3 rounded-xl font-semibold hover:bg-gray-100">
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* 🔥 EXTRA SELLING SECTION */}
      <section className="mt-16 text-center">
        <h2 className="text-xl font-semibold">Why customers love this</h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-2">
          Sourced from the finest farms, processed with care, and delivered fresh to your doorstep.
        </p>
      </section>
     <Footer/>
    </main>
  );
}