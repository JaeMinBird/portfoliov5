import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable modern image formats and optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
  },

  // Enable compression
  compress: true,

  // Package-level tree-shaking. Next 15 also handles per-package chunking
  // automatically, so no manual `splitChunks` override is needed.
  experimental: {
    optimizePackageImports: ['framer-motion', 'three'],
  },

  // Turbopack config (dev). Mirrors the tsconfig @/* path alias explicitly.
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};

export default nextConfig;
