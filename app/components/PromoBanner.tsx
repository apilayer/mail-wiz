import Image from "next/image";

/**
 * Mailboxlayer CTA card, mirroring the ipstack banner on apilayer.com/devtools.
 * #18569f is sampled from the Mailboxlayer icon; #27344a and #0052cc are the
 * APILayer wordmark colours, so the whole card stays inside the brand palette.
 */
export function PromoBanner() {
  return (
    <a
      href="https://mailboxlayer.com/product"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full select-none overflow-hidden rounded-lg border border-[#18569f]/25 bg-bg-elev transition hover:border-[#18569f]/60 dark:border-[#18569f]/30 dark:shadow-2xl"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#eef4fc] via-white/50 to-[#18569f]/10 dark:from-[#061020]/90 dark:via-[#0a0a0b]/85 dark:to-[#18569f]/20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#18569f]/15 blur-3xl transition-opacity group-hover:bg-[#18569f]/25" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/mailboxlayer-icon.png"
            alt=""
            width={150}
            height={150}
            className="h-11 w-11 shrink-0 rounded-md shadow-sm"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              {/* Navy wordmark on light, white on dark — the source asset is
                  white-only, so we ship both rather than filtering it. */}
              <Image
                src="/mailboxlayer-wordmark-dark.png"
                alt="Mailboxlayer"
                width={350}
                height={54}
                className="block h-4 w-auto dark:hidden"
              />
              <Image
                src="/mailboxlayer-wordmark-light.png"
                alt=""
                aria-hidden
                width={350}
                height={54}
                className="hidden h-4 w-auto dark:block"
              />
              <span className="h-3.5 w-px bg-black/15 dark:bg-white/25" />
              <Image
                src="/apilayer-logo.png"
                alt="APILayer"
                width={600}
                height={116}
                className="h-3 w-auto dark:brightness-0 dark:invert"
              />
            </div>
            <p className="mono text-[10px] font-semibold uppercase tracking-widest text-[#18569f] dark:text-[#7FB2E5]">
              Email validation &amp; verification API
            </p>
            <p className="max-w-md text-sm font-medium leading-snug text-fg/80">
              Syntax, MX, SMTP &amp; quality scoring — the same engine powering
              this page.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#18569f] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#18569f]/25 transition group-hover:bg-[#1D68BF]">
            Get your free API key
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
          <span className="mono text-[9px] uppercase tracking-widest text-fg-dim">
            mailboxlayer by APILayer
          </span>
        </div>
      </div>
    </a>
  );
}
