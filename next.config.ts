import type { NextConfig } from "next";
import { BASE_PATH } from "./app/lib/basePath";

const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
const assetHost = assetBaseUrl ? new URL(assetBaseUrl) : undefined;

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  images: {
    unoptimized: true,
    ...(assetHost
      ? {
          remotePatterns: [
            {
              protocol: assetHost.protocol.replace(":", "") as "http" | "https",
              hostname: assetHost.hostname,
            },
          ],
        }
      : {}),
  },
};

export default nextConfig;
