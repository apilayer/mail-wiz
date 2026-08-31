import { NextRequest } from "next/server";
import {
  MAX_BATCH,
  dedupe,
  type MailboxlayerError,
  type MailboxlayerResponse,
  type VerifyResponse,
  type VerifyRow,
} from "@/app/lib/mailbox";

const MAILBOXLAYER_BASE = "https://apilayer.net/api/check";

/**
 * Mailboxlayer bills per address and /bulk_check is Pro-and-up only, so we fan
 * out single /check calls. Free plans reject *concurrent* requests outright, so
 * the default pool is 1 — raise it via env only if your plan allows parallelism.
 */
const CONCURRENCY = Math.max(1, Number(process.env.MAILBOXLAYER_CONCURRENCY) || 1);

/** Rate-limit rejections are transient, so back off and retry rather than failing the row. */
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 700;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * True for throttling (retryable), false for a spent monthly quota — the latter
 * also mentions "limit" but will never succeed on retry.
 */
function isRateLimited(error: MailboxlayerError["error"]): boolean {
  const type = error?.type ?? "";
  const info = error?.info ?? "";
  if (type.includes("usage_limit")) return false;
  return type.includes("rate_limit") || /rate limitation/i.test(info);
}

async function checkOne(email: string, key: string): Promise<VerifyRow> {
  const endpoint = `${MAILBOXLAYER_BASE}?access_key=${key}&email=${encodeURIComponent(
    email
  )}&smtp=1&format=0`;

  for (let attempt = 0; ; attempt++) {
    const started = Date.now();
    let upstream: Response;
    try {
      upstream = await fetch(endpoint, { cache: "no-store" });
    } catch (e) {
      return {
        email,
        ok: false,
        error: `Failed to reach Mailboxlayer: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }

    const body = (await upstream.json()) as
      | MailboxlayerResponse
      | MailboxlayerError;

    // Mailboxlayer signals failures with HTTP 200 + success:false, not a 4xx.
    if ("success" in body && body.success === false) {
      if (isRateLimited(body.error) && attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_MS * 2 ** attempt);
        continue;
      }
      return {
        email,
        ok: false,
        error: body.error?.info?.trim() ?? "Unknown API error",
      };
    }
    if (!upstream.ok) {
      return { email, ok: false, error: `Mailboxlayer returned ${upstream.status}` };
    }

    return {
      email,
      ok: true,
      data: body as MailboxlayerResponse,
      elapsedMs: Date.now() - started,
    };
  }
}

/** Runs `checkOne` over the list with at most CONCURRENCY in flight, preserving input order. */
async function runPool(emails: string[], key: string): Promise<VerifyRow[]> {
  const rows = new Array<VerifyRow>(emails.length);
  let cursor = 0;

  const workers = Array.from(
    { length: Math.min(CONCURRENCY, emails.length) },
    async () => {
      while (cursor < emails.length) {
        const index = cursor++;
        rows[index] = await checkOne(emails[index], key);
      }
    }
  );

  await Promise.all(workers);
  return rows;
}

export async function POST(request: NextRequest) {
  const key = process.env.MAILBOXLAYER_ACCESS_KEY;
  if (!key) {
    return Response.json(
      {
        error:
          "MAILBOXLAYER_ACCESS_KEY is not set. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  let payload: { emails?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const incoming = Array.isArray(payload.emails)
    ? payload.emails.filter((e): e is string => typeof e === "string")
    : [];

  if (incoming.length === 0) {
    return Response.json({ error: "No email addresses provided." }, { status: 400 });
  }

  const { unique, duplicates } = dedupe(incoming);
  const batch = unique.slice(0, MAX_BATCH);
  const truncated = unique.length - batch.length;

  const started = Date.now();
  const rows = await runPool(batch, key);

  const result: VerifyResponse = {
    rows,
    duplicates,
    truncated,
    elapsedMs: Date.now() - started,
  };

  return Response.json(result);
}
