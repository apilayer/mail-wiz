"use client";

import { useRef, useState } from "react";
import { MAX_BATCH, extractEmails } from "@/app/lib/mailbox";

const SAMPLES = [
  { label: "role", email: "support@apilayer.com" },
  { label: "free", email: "someone@gmail.com" },
  { label: "disposable", email: "test@mailinator.com" },
  { label: "typo", email: "hello@gmial.com" },
];

export function VerifyPanel({
  onVerify,
  loading,
}: {
  onVerify: (emails: string[]) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const parsed = extractEmails(value);

  async function ingestFile(file: File) {
    const text = await file.text();
    const found = extractEmails(text);
    setFileName(`${file.name} · ${found.length} found`);
    setValue(found.join(", "));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (parsed.length > 0) onVerify(parsed);
  }

  return (
    <section className="rounded-xl border border-border bg-bg-elev">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
          verify
        </span>
        <span className="mono text-xs text-fg-muted">
          one email, a comma-separated list, or a CSV
        </span>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3 p-5">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="jane@example.com, support@apilayer.com, test@mailinator.com"
          rows={4}
          spellCheck={false}
          autoComplete="off"
          className="scrollbar-thin mono min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-dim focus:border-accent focus:outline-none"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void ingestFile(file);
          }}
          className={`flex items-center justify-between gap-3 rounded-md border border-dashed px-4 py-3 transition ${
            dragging ? "border-accent bg-accent/5" : "border-border bg-bg-elev-2"
          }`}
        >
          <span className="mono truncate text-xs text-fg-muted">
            {fileName ?? "drop a .csv or .txt here"}
          </span>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mono shrink-0 rounded border border-border bg-bg-elev px-2 py-1 text-[11px] text-fg-muted transition hover:text-fg"
          >
            browse
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void ingestFile(file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-fg-dim">
            samples
          </span>
          {SAMPLES.map((s) => (
            <button
              key={s.email}
              type="button"
              disabled={loading}
              onClick={() =>
                setValue((v) => (v.trim() ? `${v.trim()}, ${s.email}` : s.email))
              }
              className="mono rounded border border-border bg-bg-elev-2 px-2 py-1 text-[11px] text-fg-muted transition hover:text-fg disabled:opacity-50"
            >
              {s.label} · {s.email}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="mono text-[11px] text-fg-dim">
            {parsed.length === 0
              ? "no addresses detected"
              : `${parsed.length} address${parsed.length === 1 ? "" : "es"} detected`}
            {parsed.length > MAX_BATCH && ` · only the first ${MAX_BATCH} will run`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || value === ""}
              onClick={() => {
                setValue("");
                setFileName(null);
              }}
              className="mono h-10 rounded-md border border-border bg-bg-elev-2 px-3 text-sm text-fg-muted transition hover:text-fg disabled:opacity-50"
            >
              clear
            </button>
            <button
              type="submit"
              disabled={loading || parsed.length === 0}
              className="mono h-10 rounded-md border border-accent/40 bg-accent/15 px-4 text-sm font-medium text-accent transition hover:bg-accent/25 disabled:opacity-50"
            >
              {loading ? "verifying…" : "verify"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
