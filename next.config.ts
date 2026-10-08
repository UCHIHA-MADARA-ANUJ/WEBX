import type { NextConfig } from "next";

/**
 * Project Verde v4 — build configuration.
 *
 * `allowedDevOrigins` lets the sandboxed preview host (and any *.e2b.app /
 * *.arena.ai tunnel) load the dev server assets cross-origin, so the live
 * preview works without console-blocking CORS errors.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "*.arena.ai", "localhost", "127.0.0.1"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
