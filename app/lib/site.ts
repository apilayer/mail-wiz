/**
 * Canonical facts about this page, deliberately decoupled from routing.
 * NEXT_PUBLIC_BASE_PATH says where Next serves the app from; these say what a
 * crawler should be told about it.
 */
const DEFAULT_ORIGIN = "https://apilayer.com";
const DEFAULT_PATH = "/devtools/verify-email";

export const SITE = {
  name: "MailWiz",
  origin: (process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, ""),
  publicPath: (process.env.NEXT_PUBLIC_SITE_PATH ?? DEFAULT_PATH).replace(/\/$/, ""),
  tagline: "Is this email address real?",
  description:
    "Check whether an email address can actually receive mail. Syntax, MX records, a live SMTP check, catch-all, role and disposable detection and a deliverability score, for one address or a whole CSV. Free, no sign-up, powered by the Mailboxlayer API.",
  locale: "en_US",
} as const;

export const SITE_URL = `${SITE.origin}${SITE.publicPath}`;
