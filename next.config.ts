import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ← bypasses server-side fetching entirely
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efpdfrzlabvciwmhuuqd.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;