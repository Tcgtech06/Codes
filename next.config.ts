import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Configure Turbopack (Next.js 16 default)
  turbopack: {
    // Empty config to silence the warning and use Turbopack defaults
    // Turbopack handles file watching better on Windows
  },
  // Configure webpack as fallback
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      // Optimize file watching for Windows
      config.watchOptions = {
        poll: false, // Disable polling to prevent constant refreshes
        aggregateTimeout: 300, // Delay before rebuilding (ms)
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/.netlify/**',
          '**/out/**',
          '**/build/**',
          '**/.env*', // Ignore env file changes
        ],
      };
      
      // Prevent unnecessary rebuilds
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      };
    }
    return config;
  },
  // Disable automatic static optimization issues
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
