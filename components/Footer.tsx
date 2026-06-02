import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Featured",
    links: [
      "Premium Roasted Cashews",
      "Organic Cashew Milk",
      "Cashew Protein Blend",
      "Limited Harvest Selection",
    ],
  },
  {
    title: "Shop",
    links: [
      "All Cashew Products",
      "Raw Cashew Nuts",
      "Roasted & Salted",
      "Flavored Cashews",
    ],
  },
  {
    title: "Specialty",
    links: [
      "Bulk Orders",
      "Custom Processing",
      "Export Grade Kernels",
      "Private Label Solutions",
    ],
  },
  {
    title: "Wellness",
    links: [
      "Immunity Boost",
      "Heart Health",
      "Energy & Fitness",
      "Family Nutrition",
    ],
  },
  {
    title: "Discover",
    links: [
      "Our Story",
      "Farm to Table",
      "Sustainability",
      "Recipes & Guides",
    ],
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { src: "/x.svg", alt: "X", href: "https://twitter.com/sahelnut", bgColor: "bg-black" },
    { src: "/facebook.svg", alt: "Facebook", href: "https://facebook.com/sahelnut", bgColor: "bg-blue-600" },
    { src: "/instagram.svg", alt: "Instagram", href: "https://instagram.com/sahelnut", bgColor: "bg-pink-600" },
    { src: "/whatsapp.svg", alt: "WhatsApp", href: "https://wa.me/2347044213420", bgColor: "bg-green-600" },
  ];

  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          {/* Logo */}
          <div className="flex items-start md:col-span-3">
            <Image 
              src="/cashewmoonLogo.png" 
              alt="Sahel Cashew Moon Nut" 
              width={68} 
              height={68} 
              
            />
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-lg font-semibold text-amber-400">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-300"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-3 md:col-span-2 md:justify-end">
            {socialLinks.map((social) => (
              <Link
                key={social.alt}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.alt}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${social.bgColor} hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <Image src={social.src} alt={social.alt} width={18} height={18} className="brightness-0 invert" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <Image src="/globe.svg" alt="Location" width={16} height={16} className="brightness-0 invert opacity-70" />
              <span>Kano, Nigeria</span>
            </div>
            <span>© {currentYear} Sahel Cashew Moon Nut, Inc. All Rights Reserved</span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {["Guides", "Terms of Sale", "Terms of Use", "Privacy Policy"].map((t) => (
              <li key={t}>
                <Link href="#" className="hover:text-amber-400 transition-colors duration-300">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* WhatsApp floating button (optional) */}
      <Link
        href="https://wa.me/2347044213420"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <Image src="/whatsapp.svg" alt="WhatsApp" width={24} height={24} className="brightness-0 invert" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </Link>
    </footer>
  );
}