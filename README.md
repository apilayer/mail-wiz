# MailWiz

An email verification devtool powered by the [Mailboxlayer](https://mailboxlayer.com/) API.

Paste a single address, a comma-separated list, or drop in a CSV — get back one table with
syntax validation, MX records, live SMTP check, catch-all detection, role/disposable/free
flags, and a 0–1 deliverability score. Results export back out as CSV.

Shares its design system with [IPWiz](https://ipwiz.vercel.app).

## Setup

```bash
cp .env.example .env.local   # then paste your key
npm install
npm run dev
```

Get a free access key (100 requests/mo) at [mailboxlayer.com](https://mailboxlayer.com/product).

## How it works

- `app/api/verify/route.ts` — POST `{ emails: string[] }`. The key stays server-side and
  never reaches the browser. Mailboxlayer's `/bulk_check` is a Pro-plan endpoint, so this
  fans out single `/check` calls through a 5-wide concurrency pool instead.
- `app/lib/mailbox.ts` — response types, email extraction, de-duplication, and the
  `verdict()` rollup that turns raw flags into deliverable / risky / undeliverable.
- `app/components/` — `VerifyPanel` (textarea + CSV drop zone), `ResultsTable`
  (filters + CSV export), `Header`, `ThemeToggle`.

## Notes on quotas

Every address costs one API credit, so requests are capped at `MAX_BATCH` (100) per call and
duplicates are dropped before anything is sent. Adjust both in `app/lib/mailbox.ts`.
