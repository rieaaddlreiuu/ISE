import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use polling in dev to make file change detection more reliable on Windows.
  watchOptions: {
    pollIntervalMs: 300,
  },
};

export default nextConfig;
