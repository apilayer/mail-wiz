/**
 * The sub-path this app is served from, e.g. "/devtools/verify-email".
 *
 * Read from the environment rather than hardcoded: a literal here means
 * `npm run dev` serves at the sub-path instead of the root, and changing the
 * deploy location needs a code edit. Next wants "" for the root and rejects a
 * trailing slash, so both the unset case and a stray "/" normalise to "".
 *
 * Must be set at build time: Next inlines it into the client bundle, so
 * changing it needs a rebuild, not a restart.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/").replace(
  /\/+$/,
  ""
);
