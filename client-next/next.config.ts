import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://server:6666/:path*",
      },
      {
        source: "/data/:path*",
        destination: "http://server:6666/data/:path*",
      },
    ];
  },
};

export default nextConfig;
