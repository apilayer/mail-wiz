/** Shape returned by the Mailboxlayer /check endpoint on success. */
export type MailboxlayerResponse = {
  email: string;
  did_you_mean: string;
  user: string;
  domain: string;
  format_valid: boolean;
  mx_found: boolean | null;
  smtp_check: boolean | null;
  catch_all: boolean | null;
  role: boolean;
  disposable: boolean;
  free: boolean;
  score: number;
};

/** Error envelope Mailboxlayer returns instead of a result (HTTP 200 with success:false). */
export type MailboxlayerError = {
  success: false;
  error: { code: number; type: string; info: string };
};

/** One row of the results table: either a verification result or a per-email failure. */
export type VerifyRow =
  | { email: string; ok: true; data: MailboxlayerResponse; elapsedMs: number }
  | { email: string; ok: false; error: string };

export type VerifyResponse = {
  rows: VerifyRow[];
  /** Emails dropped before hitting the API because they were duplicates. */
  duplicates: number;
  /** Emails dropped because the batch exceeded MAX_BATCH. */
  truncated: number;
  elapsedMs: number;
};

/** Hard ceiling per request — each email costs one Mailboxlayer credit. */
export const MAX_BATCH = 100;

/**
 * Pull email-looking tokens out of free text or raw CSV.
 *
 * Deliberately permissive: we split on the usual separators and keep anything
 * containing an "@", so malformed addresses still reach the API and come back
 * with format_valid: false rather than being silently dropped here.
 */
export function extractEmails(input: string): string[] {
  return input
    .split(/[\s,;]+/)
    .map((token) => token.replace(/^["'<(]+|["'>)]+$/g, "").trim())
    .filter((token) => token.includes("@"));
}

/** Case-insensitive de-dupe that preserves first-seen order and original casing. */
export function dedupe(emails: string[]): { unique: string[]; duplicates: number } {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const email of emails) {
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(email);
  }
  return { unique, duplicates: emails.length - unique.length };
}

/** Buckets the 0–1 score into the labels used by the table and summary bar. */
export function scoreBand(score: number): "high" | "medium" | "low" {
  if (score >= 0.65) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}

/**
 * Overall verdict for a row — what most people actually want out of the table.
 * SMTP is authoritative when present; otherwise we fall back to syntax + MX.
 */
export function verdict(data: MailboxlayerResponse): "deliverable" | "risky" | "undeliverable" {
  if (!data.format_valid || data.mx_found === false) return "undeliverable";
  if (data.smtp_check === false) return "undeliverable";
  if (data.disposable || data.catch_all || data.score < 0.4) return "risky";
  return "deliverable";
}
