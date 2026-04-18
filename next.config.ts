import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable modern image formats and optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Enable compression
  compress: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'three'],
  },

  // Turbopack config (dev). Mirrors the tsconfig @/* path alias explicitly.
  // Chunk splitting is automatic; no manual splitChunks needed.
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Webpack optimizations for production builds only (ignored by Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|@types\/three)[\\/]/,
              chunks: 'all',
              priority: 20,
            },
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
