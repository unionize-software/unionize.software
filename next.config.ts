import path from "node:path";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.supabase.co ws: wss:",
].join("; ");

export default function nextConfig(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    poweredByHeader: false,
    reactStrictMode: true,
    typedRoutes: true,
    webpack(config) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "libsodium$": path.join(
          process.cwd(),
          "node_modules",
          "libsodium",
          "dist",
          "modules",
          "libsodium.js",
        ),
        "libsodium-wrappers$": path.join(
          process.cwd(),
          "node_modules",
          "libsodium-wrappers",
          "dist",
          "modules",
          "libsodium-wrappers.js",
        ),
      };

      return config;
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: contentSecurityPolicy,
            },
            {
              key: "Cross-Origin-Opener-Policy",
              value: "same-origin",
            },
            {
              key: "Cross-Origin-Resource-Policy",
              value: "same-origin",
            },
            {
              key: "Permissions-Policy",
              value:
                "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
            },
            {
              key: "Referrer-Policy",
              value: "no-referrer",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
          ],
        },
      ];
    },
  };
}
