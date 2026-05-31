import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["aurora.tootie.tv", "10.1.0.6", "dinglebear.ai", "www.dinglebear.ai"],
  output: "standalone",
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
