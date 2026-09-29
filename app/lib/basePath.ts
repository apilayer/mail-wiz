/**
 * Single source of truth for the app's basePath.
 *
 * Imported by next.config.ts (build-time routing config) and by
 * app/lib/assets.ts (runtime asset URL construction) so the two can never
 * drift apart.
 */
export const BASE_PATH = "/devtools/verify-email";
