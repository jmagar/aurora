import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["aurora.tootie.tv", "10.1.0.6", "dinglebear.ai", "www.dinglebear.ai"],
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Disable Turbopack's persistent filesystem cache for `next dev` (default-on since
    // Next 16.1.0). Its embedded cache DB deadlocks under the dev container's polling
    // bind-mount setup ("Compaction failed: Another write batch ... is already active"),
    // wedging the dev server while it keeps the port held (2026-06-01 incident).
    // In-memory caching still applies; only cross-restart persistence is dropped.
    turbopackFileSystemCacheForDev: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
            },
          ],
          destination: "/r/registry.json",
        },
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "user-agent",
              value: "shadcn",
            },
          ],
          destination: "/r/registry.json",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/young_office",
        destination: "/young_office/index.html",
        permanent: false,
      },
      {
        source: "/young_office/",
        destination: "/young_office/index.html",
        permanent: false,
      },
    ];
  },
  async headers() {
    // NOTE: `script-src 'unsafe-inline'` is a deliberate relaxation. Next.js
    // injects inline bootstrap/hydration scripts, and a strict CSP without
    // 'unsafe-inline' (or a per-request nonce) breaks hydration. Tightening
    // this to a nonce-based policy is future work and out of scope for this
    // baseline-headers pass.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      },
      {
        key: "Content-Security-Policy",
        value:
          "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
      },
    ];

    return [
      // Baseline security headers for all routes.
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Preserve content-negotiation Vary on the root route.
      {
        source: "/",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
