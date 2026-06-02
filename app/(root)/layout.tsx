import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/HeroSection";
import { createClient } from "@/lib/supabase/server";
import { Testimonials } from "@/components/Testimony";
import { TrustBar } from "@/components/TrustBar";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import FarmsEcosystem from "@/components/FarmEcoSystem";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>

      <Navbar />
      <TrustBar/>
      <Hero/>
      {children}
      <Features />
      <FarmsEcosystem />
      <Testimonials />
      <CTA/>

      <Footer />

    </>
  );
}
