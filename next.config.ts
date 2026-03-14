import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Empty turbopack config to silence warnings
  turbopack: {},
};

export default nextConfig;
