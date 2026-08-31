"use client";

import { useMemo, useState } from "react";
import { scoreBand, verdict, type VerifyResponse, type VerifyRow } from "@/app/lib/mailbox";

type Filter = "all" | "deliverable" | "risky" | "undeliverable" | "failed";

const VERDICT_STYLE = {
  deliverable: "border-ok/40 bg-ok/10 text-ok",
  risky: "border-warn/40 bg-warn/10 text-warn",
  undeliverable: "border-danger/40 bg-danger/10 text-danger",
  failed: "border-border bg-bg-elev-2 text-fg-dim",
} as const;

/** Verdict for any row, including per-email API failures. */
function rowVerdict(row: VerifyRow): Filter {
  return row.ok ? verdict(row.data) : "failed";
}

export function ResultsTable({ result }: { result: VerifyResponse }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: result.rows.length,
      deliverable: 0,
      risky: 0,
      undeliverable: 0,
      failed: 0,
    };
    for (const row of result.rows) base[rowVerdict(row)]++;
    return base;
  }, [result]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? result.rows
        : result.rows.filter((row) => rowVerdict(row) === filter),
    [result, filter]
  );

  function exportCsv() {
    const header = [
      "email",
      "verdict",
      "did_you_mean",
      "format_valid",
      "mx_found",
      "smtp_check",
      "catch_all",
      "role",
      "disposable",
      "free",
      "score",
      "error",
    ];
    const cell = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = result.rows.map((row) =>
      row.ok
        ? [
            row.data.email,
            verdict(row.data),
            row.data.did_you_mean,
            row.data.format_valid,
            row.data.mx_found,
            row.data.smtp_check,
            row.data.catch_all,
            row.data.role,
            row.data.disposable,
            row.data.free,
            row.data.score,
            "",
          ].map(cell).join(",")
        : [row.email, "failed", "", "", "", "", "", "", "", "", "", row.error]
            .map(cell)
            .join(",")
    );

    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mailwiz-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-xl border border-border bg-bg-elev">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            results
          </span>
          <span className="mono text-xs text-fg-muted">
            {result.rows.length} checked in {result.elapsedMs}ms
            {result.duplicates > 0 && ` · ${result.duplicates} duplicate skipped`}
            {result.truncated > 0 && ` · ${result.truncated} over limit`}
          </span>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="mono rounded-md border border-border bg-bg-elev-2 px-3 py-1.5 text-[11px] text-fg-muted transition hover:text-fg"
        >
          export csv ↓
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        {(["all", "deliverable", "risky", "undeliverable", "failed"] as Filter[])
          .filter((f) => f === "all" || counts[f] > 0)
          .map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`mono rounded border px-2 py-1 text-[11px] transition ${
                filter === f
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-bg-elev-2 text-fg-muted hover:text-fg"
              }`}
            >
              {f} · {counts[f]}
            </button>
          ))}
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {[
                "email",
                "verdict",
                "score",
                "format",
                "mx",
                "smtp",
                "catch-all",
                "role",
                "disposable",
                "free",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-fg-dim"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <Row key={row.email} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Row({ row }: { row: VerifyRow }) {
  const v = rowVerdict(row);

  if (!row.ok) {
    return (
      <tr className="border-b border-border last:border-0">
        <td className="mono px-4 py-2.5 text-fg">{row.email}</td>
        <td className="px-4 py-2.5">
          <Badge verdict={v} />
        </td>
        <td className="mono px-4 py-2.5 text-xs text-fg-dim" colSpan={8}>
          {row.error}
        </td>
      </tr>
    );
  }

  const d = row.data;
  return (
    <tr className="border-b border-border last:border-0 hover:bg-bg-elev-2">
      <td className="mono px-4 py-2.5 text-fg">
        {d.email}
        {d.did_you_mean && (
          <span className="ml-2 text-xs text-warn" title="Did you mean?">
            → {d.did_you_mean}
          </span>
        )}
      </td>
      <td className="px-4 py-2.5">
        <Badge verdict={v} />
      </td>
      <td className="px-4 py-2.5">
        <Score value={d.score} />
      </td>
      <Flag value={d.format_valid} />
      <Flag value={d.mx_found} />
      <Flag value={d.smtp_check} />
      <Flag value={d.catch_all} neutral />
      <Flag value={d.role} neutral />
      <Flag value={d.disposable} invert />
      <Flag value={d.free} neutral />
    </tr>
  );
}

function Badge({ verdict }: { verdict: Filter }) {
  return (
    <span
      className={`mono rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
        VERDICT_STYLE[verdict as keyof typeof VERDICT_STYLE] ?? VERDICT_STYLE.failed
      }`}
    >
      {verdict}
    </span>
  );
}

function Score({ value }: { value: number }) {
  const band = scoreBand(value);
  const color =
    band === "high" ? "bg-ok" : band === "medium" ? "bg-warn" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-bg-elev-2">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="mono text-xs text-fg-muted">{value.toFixed(2)}</span>
    </div>
  );
}

/**
 * `invert` marks flags where true is the bad outcome (disposable);
 * `neutral` marks flags that are informational rather than pass/fail.
 */
function Flag({
  value,
  invert = false,
  neutral = false,
}: {
  value: boolean | null;
  invert?: boolean;
  neutral?: boolean;
}) {
  if (value === null || value === undefined) {
    return <td className="mono px-4 py-2.5 text-fg-dim">—</td>;
  }
  const good = invert ? !value : value;
  const color = neutral ? "text-fg-muted" : good ? "text-ok" : "text-danger";
  return (
    <td className={`mono px-4 py-2.5 ${color}`}>{value ? "yes" : "no"}</td>
  );
}
