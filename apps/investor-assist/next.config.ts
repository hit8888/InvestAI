import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@neuraltrade/core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
