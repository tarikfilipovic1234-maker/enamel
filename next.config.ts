import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a parent lockfile exists in the home dir).
  turbopack: { root: path.resolve() },
  experimental: {
    // Enables React's <ViewTransition> for premium route + shared-element transitions.
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
