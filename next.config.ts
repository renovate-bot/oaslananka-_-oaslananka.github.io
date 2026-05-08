import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: rootDir,
  },
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com", protocol: "https" },
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
      { hostname: "imgur.com", protocol: "https" },
      { hostname: "media2.dev.to", protocol: "https" },
    ],
  },
};

export default nextConfig;
