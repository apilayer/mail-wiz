"use client";

import { useState } from "react";
import { VerifyPanel } from "./VerifyPanel";
import { ResultsTable } from "./ResultsTable";
import { PromoBanner } from "./PromoBanner";
import type { VerifyResponse } from "@/app/lib/mailbox";

export function Verifier() {
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify(emails: string[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? `Request failed with ${res.status}`);
        setResult(null);
      } else {
        setResult(body as VerifyResponse);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid-bg flex-1">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-[2rem] font-semibold leading-[1.24] text-fg md:text-[2.8125rem] md:leading-[3.5rem]">
            Is this email address real?
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-fg-muted md:text-[1.1875rem] md:leading-[1.7]">
            Check whether an address can actually receive mail. Syntax, MX
            records, a live SMTP check, catch-all, role and disposable
            detection and a deliverability score, for one address or a whole
            CSV. Powered by the Mailboxlayer API.
          </p>
        </div>

        <VerifyPanel onVerify={verify} loading={loading} />

        <PromoBanner />

        {error && (
          <div className="label rounded-xl border border-danger/40 bg-danger/10 px-5 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {loading && !result && (
          <div className="label rounded-xl border border-border bg-bg-elev px-5 py-8 text-center text-sm text-fg-dim">
            pinging mail servers…
          </div>
        )}

        {result && <ResultsTable result={result} />}
      </div>
    </main>
  );
}
