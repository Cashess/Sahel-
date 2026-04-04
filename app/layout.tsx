// app/layout.tsx
import { AppContextProvider } from "@/context/AppContextProvider";
import "./globals.css";
import type { Metadata } from "next";

// Use Google Fonts in a way that’s deterministic for SSR
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ensures no FOIT
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahel Golden Cashew Moon Nut",
  description: "Premium cashew products from Kano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply deterministic classes here so SSR matches client */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col h-full antialiased`}
      >
        <AppContextProvider>

        <Toaster />
        {children}
        </AppContextProvider>

      </body>
    </html>
  );
}