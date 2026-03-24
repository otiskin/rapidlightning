// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Production-ready config for Rapid Lightning Ranch */
  
  experimental: {
    // React Compiler (stable in React 19 + Next 15)
    // This gives you automatic memoization, fewer re-renders,
    // and better performance for your egg store UI (ProductCard, cart, hero animations)
    reactCompiler: true,
  },

  // Optional but recommended for your app:
  // swcMinify: true,        // already default in Next 15
  // compress: true,         // already default
};

export default nextConfig;