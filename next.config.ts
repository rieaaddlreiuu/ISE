import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow device access through ngrok during development so client bundles
  // and dev assets can hydrate on iPad/Safari.
  allowedDevOrigins: [
    "192.168.2.102",
    "192.168.40.38",
    "127.0.0.1",
    "localhost",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
  // Use polling in dev to make file change detection more reliable on Windows.
  watchOptions: {
    pollIntervalMs: 300,
  },
};

export default nextConfig;
