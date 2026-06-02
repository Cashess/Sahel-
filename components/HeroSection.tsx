import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative text-white overflow-hidden min-h-screen flex items-center">
      {/* Background gradient - fixed for Tailwind v4 */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-700/60 via-black/80 to-black/90" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 items-center gap-12 relative z-10 w-full">
        {/* TEXT */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Premium <span className="text-amber-400">Cashew Nuts</span>  
            <br /> From the Heart of Sahel
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Hand-selected, sun-dried, and packed with natural richness. 
            SAHELNUT is not just a snack — it's heritage in every bite.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <button className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 cursor-pointer">
              Shop Now
            </button>
            <button className="border border-amber-400 px-6 py-3 rounded-xl hover:bg-amber-400/10 transition-all duration-300 cursor-pointer">
              Learn More
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 w-full max-w-md">
            <Image
              src="/HeroSectionCashew.jpg"
              alt="Premium cashew nuts from the Sahel region"
              width={500}
              height={500}
              className="rounded-2xl w-full h-auto object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}