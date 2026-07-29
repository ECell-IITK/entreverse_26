import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server bundle under .next/standalone,
  // which the Dockerfile copies into the final image instead of the full
  // node_modules tree.
  output: "standalone",

  // All pages and assets are served under /entreverse on ecelliitk.org.
  // e.g.  https://ecelliitk.org/entreverse/register
  //        https://ecelliitk.org/entreverse/admin/login
  basePath: "/entreverse",

  // assetPrefix must match basePath so that JS/CSS chunks resolve correctly.
  assetPrefix: "/entreverse",

  env: {
    // Exposed to the browser — points to the Go backend.
    // Override with NEXT_PUBLIC_API_URL in your Vercel project settings.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  },
};

export default nextConfig;
