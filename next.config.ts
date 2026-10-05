import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // life logs, marketing and technical were merged into one blogs page
      { source: "/reflection/life-logs", destination: "/reflection/blogs", permanent: true },
      { source: "/reflection/marketing", destination: "/reflection/blogs", permanent: true },
      { source: "/reflection/technical", destination: "/reflection/blogs", permanent: true },
    ];
  },
};

export default nextConfig;
