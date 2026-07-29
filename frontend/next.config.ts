import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server bundle under .next/standalone,
  // which the Dockerfile copies into the final image instead of the full
  // node_modules tree.
  output: "standalone",

  env: {
    // Exposed to the browser — points to the Go backend on Railway.
    // Set NEXT_PUBLIC_API_URL in your Vercel project environment variables.
    // e.g. https://entreverse-backend-production.up.railway.app
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  },
};

export default nextConfig;
