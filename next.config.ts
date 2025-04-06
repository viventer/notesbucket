import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
  },
};

export default nextConfig;
