import Image from "next/image";
import { assetPath } from "../lib/assets";

const SUITE = [
  { name: "ipstack", href: "https://ipstack.com" },
  { name: "mailboxlayer", href: "https://mailboxlayer.com" },
  { name: "marketstack", href: "https://marketstack.com" },
  { name: "positionstack", href: "https://positionstack.com" },
  { name: "aviationstack", href: "https://aviationstack.com" },
  { name: "mediastack", href: "https://mediastack.com" },
  { name: "serpstack", href: "https://serpstack.com" },
  { name: "scrapestack", href: "https://scrapestack.com" },
];

/** Quieter cross-sell for the wider APILayer suite — deliberately neutral so it
 *  doesn't compete with the Mailboxlayer banner above it. */
function SuiteStrip() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-[#0052cc]/25 bg-bg-elev dark:border-[#0052cc]/30">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#eef3fd] via-white/50 to-[#0052cc]/10 dark:from-[#050d1c]/90 dark:via-[#0a0a0b]/85 dark:to-[#0052cc]/20" />
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <Image
              src={assetPath("/apilayer-logo.png")}
              alt="APILayer"
              width={600}
              height={116}
              className="h-3.5 w-auto dark:brightness-0 dark:invert"
            />
            <span className="h-3.5 w-px bg-black/15 dark:bg-white/25" />
            <span className="mono text-[10px] uppercase tracking-widest text-fg-dim">
              the unified suite
            </span>
          </div>
          <p className="max-w-md text-sm font-medium leading-snug text-fg/80">
            One account, one API key, one dashboard, one bill — across a growing
            library of APIs.
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {SUITE.map((api) => (
              <a
                key={api.name}
                href={api.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mono rounded border border-border bg-bg-elev-2 px-2 py-0.5 text-[10px] text-fg-muted transition hover:border-[#0052cc]/50 hover:text-[#0052cc] dark:hover:border-[#5C9DFF]/50 dark:hover:text-[#5C9DFF]"
              >
                {api.name}
              </a>
            ))}
          </div>
        </div>
        <a
          href="https://apilayer.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="mono group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-[#0052cc] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#0052cc]/20 transition hover:bg-[#0a63e6]"
        >
          Browse all APIs
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="mono text-[10px] uppercase tracking-wider text-fg-dim">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="text-xs text-fg-muted transition hover:text-fg"
            >
              {l.label}
              {l.external && <span className="text-fg-dim"> ↗</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-10">
      <SuiteStrip />

      <footer className="mt-8 border-t border-border pt-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-fg">
              <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5" aria-hidden="true">
                <rect x="3" y="3" width="26" height="26" rx="7" fill="currentColor" />
                <path
                  d="M9 12.5h14v9H9z"
                  stroke="var(--bg)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="m9.5 13 6.5 5 6.5-5"
                  stroke="var(--bg)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mono text-sm font-semibold tracking-tight">
                MailWiz
              </span>
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-fg-muted">
              Verify one email address or a whole CSV — syntax, MX records, live
              SMTP check, role and disposable filtering, and a deliverability
              score, powered by Mailboxlayer.
            </p>
            <a
              href="https://apilayer.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex w-fit items-center gap-2 text-fg-dim transition hover:opacity-80"
            >
              <span className="mono text-[10px] uppercase tracking-wider">
                Powered by
              </span>
              <Image
                src={assetPath("/apilayer-logo.png")}
                alt="APILayer"
                width={600}
                height={116}
                className="h-3.5 w-auto dark:brightness-0 dark:invert"
              />
            </a>
          </div>

          <LinkColumn
            title="Product"
            links={[
              { label: "Verify an email", href: "/" },
              { label: "Bulk CSV check", href: "/" },
              { label: "Export results", href: "/" },
            ]}
          />
          <LinkColumn
            title="mailboxlayer API"
            links={[
              { label: "Get a free API key", href: "https://mailboxlayer.com/product", external: true },
              { label: "API documentation", href: "https://mailboxlayer.com/documentation", external: true },
              { label: "Pricing", href: "https://mailboxlayer.com/product", external: true },
            ]}
          />
          <LinkColumn
            title="Project"
            links={[
              { label: "APILayer", href: "https://apilayer.com/", external: true },
              { label: "All devtools", href: "https://apilayer.com/devtools/what-is-my-ip", external: true },
              { label: "Support", href: "https://apilayer.com/contact", external: true },
            ]}
          />
        </div>

        <div className="mono mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-[11px] text-fg-dim">
          <span>MailWiz © Mailboxlayer by APILayer</span>
          <a
            href="https://mailboxlayer.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-fg"
          >
            mailboxlayer.com ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
