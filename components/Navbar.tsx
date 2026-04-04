"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, UserIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContextProvider";
import { signOut } from "@/lib/supabase/actions/user.Auth.action";
import { useRouter } from "next/navigation";
import { cartStore } from "./store/cart-store";

const NAV_LINKS = [
  { label: "Nut", href: "/products?categories=nut" },
  { label: "Paste", href: "/products?categories=paste" },
  { label: "Custom", href: "/custom" },
  { label: "Contact", href: "/contact" },
  { label: "Orders", href: "/orders" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { session, setSession } = useAppContext();
  const router = useRouter();

  const toggleUserMenu = () => setUserOpen((prev) => !prev);
  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    router.push("/");
  }
const cartItems = cartStore((state) => state.items);
const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/cashewmoonLogo.png" alt="Cashew Moon" width={68} height={68} />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex w-full py-4  font-semibold text-base   hover:bg-gray-900 justify-center">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body text-black transition-colors  hover:text-white   "
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions: User & Cart */}
        <div className="hidden items-center gap-6 md:flex relative">
          {/* User dropdown */}
          <button
            className="flex items-center text-body text-dark-900 transition-colors hover:text-dark-700"
            onClick={toggleUserMenu}
          >
            <UserIcon className="w-6 h-6 text-gray-500 hover:text-black" />
          </button>

          {userOpen && (
            <div className="absolute top-16 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-48 z-50">
              {session ? (
                <div className="flex flex-col gap-2">
                  <p className="text-body text-gray-900 truncate">{session.user?.email}</p>
                  <Link href="/account" className="text-body text-gray-900 hover:text-gray-700">
                    My Profile
                  </Link>
                  <Link href="/orders" className="text-body text-gray-900 hover:text-gray-700">
                    My Orders
                  </Link>
                  <Link href="/reviews" className="text-body text-gray-900 hover:text-gray-700">
                    My Reviews
                  </Link>
                  <button className="text-body text-gray-900 hover:text-gray-700" onClick={handleSignOut}>Sign Out</button>
                </div>
              ) : (
                <Link href="/login" className="text-body text-gray-900 hover:text-gray-700 block">
                  Sign In
                </Link>
              )}
            </div>
          )}

          {/* Shopping cart */}
          <Link
            href={"/cart"}
            className="relative flex items-center gap-2 text-gray-900 transition-colors hover:text-gray-700"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-black" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#3A2F23] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
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

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-light-300 md:hidden">
          <ul className="space-y-2 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-body text-dark-900 hover:text-dark-700"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <button
              className="flex items-center text-body text-dark-900 transition-colors hover:text-dark-700"
              onClick={toggleUserMenu}
            >
              <UserIcon className="w-6 h-6 text-gray-100 hover:text-black" />
            </button>

            {userOpen && (
              <div className="absolute top-16 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-48 z-50">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-body text-gray-900 truncate">{session.user?.email}</p>
                    <Link href="/account" className="text-body text-gray-900 hover:text-gray-700">
                      My Profile
                    </Link>
                    <Link href="/orders" className="text-body text-gray-900 hover:text-gray-700">
                      My Orders
                    </Link>
                    <Link href="/reviews" className="text-body text-gray-900 hover:text-gray-700">
                      My Reviews
                    </Link>
                    <button className="text-body text-gray-900 hover:text-gray-700">Sign Out</button>
                  </div>
                ) : (
                  <Link href="/login" className="text-body text-gray-900 hover:text-gray-700 block">
                    Sign In
                  </Link>
                )}
              </div>
            )}
            <li className="flex items-center justify-between pt-2">
              <button className="text-body flex items-center">
                <ShoppingCart className="w-6 h-6 text-gray-100 hover:text-black" />

              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}