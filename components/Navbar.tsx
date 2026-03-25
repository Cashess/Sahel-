"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
const NAV_LINKS = [
  { label: "Nut", href: "/products?gender=men" },
  { label: "Paste", href: "/products?gender=women" },
  { label: "Custom", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/"  className="flex items-center">
          <Image src="/cashewmoonLogo.png" alt="Cashew Moon" width={48} height={48} />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body text-dark-900 transition-colors hover:text-dark-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
            Search
          </button>
          <button className="flex items-centertext-body text-dark-900 transition-colors hover:text-dark-700">
            <ShoppingCart className="w-6 h-6 text-gray-100 hover:text-black" /><span>(2)</span>
          </button>
        </div>

        <button
          type="button"
          color="white"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
        <span className="sr-only">Toggle navigation</span>

      <div className="flex flex-col items-center">
        <span className="text-xs text-white mb-1">Menu</span>
        
        <span className="mb-1 block h-0.5 w-6 bg-gray-100"></span>
        <span className="mb-1 block h-0.5 w-6 bg-gray-100"></span>
        <span className="block h-0.5 w-6 bg-gray-100"></span>
      </div>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-body text-dark-900 hover:text-dark-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between pt-2">
            <button className="text-body">Search</button>
            <button className="text-body">
              <ShoppingCart className="w-6 h-6 text-gray-100 hover:text-black" /><span>(2)</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
