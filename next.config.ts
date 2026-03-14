import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Disable experimental features for production builds
  experimental: {
    turbo: undefined, // Disable Turbopack for Netlify builds
  },
  // Configure webpack for production
  webpack: (config, { isServer, dev }) => {
    // Only apply dev optimizations in development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/.netlify/**',
          '**/out/**',
          '**/build/**',
          '**/.env*',
        ],
      };
      
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      };
    }
    return config;
  },
};

export default nextConfig;
