import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Empty turbopack config to silence warnings
  turbopack: {},
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;
