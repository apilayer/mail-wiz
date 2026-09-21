import { BASE_PATH } from "./basePath";

/**
 * Resolves a `public/` asset path for rendering.
 *
 * next.config.ts sets `images: { unoptimized: true }`, which bypasses
 * next/image's loader — and with it, the loader's automatic basePath
 * prefixing. Left alone, `<Image src="/logo.png">` renders a plain
 * `<img src="/logo.png">` that resolves against the domain root instead of
 * this app's basePath, 404ing once deployed under /devtools/verify-email.
 * This helper prepends BASE_PATH itself so every asset resolves correctly
 * regardless of that loader behavior.
 *
 * Setting NEXT_PUBLIC_ASSET_BASE_URL (e.g. to a CDN) switches every call
 * site to an absolute URL instead, bypassing basePath entirely.
 */
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/+$/, "");

export function assetPath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`assetPath() expects a path starting with "/", received: "${path}"`);
  }
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}${path}` : `${BASE_PATH}${path}`;
}
