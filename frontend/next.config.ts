import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default nextConfig;
