import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["aurora.tootie.tv", "10.1.0.6", "dinglebear.ai", "www.dinglebear.ai"],
  output: "standalone",
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
    return [
      {
        source: "/",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
