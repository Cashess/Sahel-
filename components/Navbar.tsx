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
  { label: "Nut", href: "/" },
  { label: "Paste", href: "/" },
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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/cashewmoonLogo.png" alt="Cashew Moon" width={68} height={68} />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex w-full py-4 font-semibold text-base justify-center">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-gray-700 transition-all duration-300 hover:text-amber-600 hover:scale-105"
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
            className="flex items-center transition-all duration-300 hover:scale-105"
            onClick={toggleUserMenu}
          >
            <UserIcon className="w-6 h-6 text-gray-600 hover:text-amber-600 transition-colors" />
          </button>

          {userOpen && (
            <div className="absolute top-16 right-0 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-48 z-50">
              {session ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700 truncate">{session.user?.email}</p>
                  <Link href="/account" className="text-gray-700 hover:text-amber-600 transition-colors">
                    My Profile
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-amber-600 transition-colors">
                    My Orders
                  </Link>
                  <Link href="/reviews" className="text-gray-700 hover:text-amber-600 transition-colors">
                    My Reviews
                  </Link>
                  <button className="text-gray-700 hover:text-amber-600 transition-colors text-left" onClick={handleSignOut}>Sign Out</button>
                </div>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-amber-600 transition-colors block">
                  Sign In
                </Link>
              )}
            </div>
          )}

          {/* Shopping cart */}
          <Link
            href={"/cart"}
            className="relative flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-amber-600 transition-colors" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
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
            <span className="text-xs text-gray-700 mb-1">Menu</span>
            <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
            <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
            <span className="block h-0.5 w-6 bg-gray-700"></span>
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-gray-100 bg-white md:hidden">
          <ul className="space-y-2 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <button
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors w-full"
                onClick={toggleUserMenu}
              >
                <UserIcon className="w-5 h-5" />
                <span>Account</span>
              </button>
            </li>

            {userOpen && (
              <div className="mt-2 ml-4 bg-gray-50 border border-gray-200 rounded-md p-3">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-700 truncate">{session.user?.email}</p>
                    <Link href="/account" className="text-gray-700 hover:text-amber-600 transition-colors text-sm" onClick={() => setOpen(false)}>
                      My Profile
                    </Link>
                    <Link href="/orders" className="text-gray-700 hover:text-amber-600 transition-colors text-sm" onClick={() => setOpen(false)}>
                      My Orders
                    </Link>
                    <Link href="/reviews" className="text-gray-700 hover:text-amber-600 transition-colors text-sm" onClick={() => setOpen(false)}>
                      My Reviews
                    </Link>
                    <button className="text-gray-700 hover:text-amber-600 transition-colors text-sm text-left" onClick={handleSignOut}>Sign Out</button>
                  </div>
                ) : (
                  <Link href="/login" className="text-gray-700 hover:text-amber-600 transition-colors block text-sm" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            )}
            <li className="flex items-center justify-between pt-2">
              <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors" onClick={() => setOpen(false)}>
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}