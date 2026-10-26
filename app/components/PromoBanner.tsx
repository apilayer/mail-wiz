import Image from "next/image";

/**
 * Mailboxlayer CTA card, mirroring the ipstack banner on apilayer.com/devtools.
 * Orange is the shared APILayer devtool accent; #27344a is the
 * APILayer wordmark colours, so the whole card stays inside the brand palette.
 */
export function PromoBanner() {
  return (
    <a
      href="https://mailboxlayer.com/product"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full select-none overflow-hidden rounded-lg border border-[#cc463c]/25 bg-bg-elev transition hover:border-[#cc463c]/60"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fdf0ef] via-white/50 to-[#cc463c]/10" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/mailboxlayer-icon.png"
            alt=""
            width={150}
            height={150}
            className="h-11 w-11 shrink-0 rounded-md"
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
                className="block h-4 w-auto"
              />
              <Image
                src="/mailboxlayer-wordmark-light.png"
                alt=""
                aria-hidden
                width={350}
                height={54}
                className="hidden h-4 w-auto"
              />
              <span className="h-3.5 w-px bg-black/15" />
              <Image
                src="/apilayer-logo.png"
                alt="APILayer"
                width={600}
                height={116}
                className="h-3 w-auto"
              />
            </div>
            <p className="label text-[10px] font-semibold uppercase tracking-widest text-[#cc463c]">
              Email validation &amp; verification API
            </p>
            <p className="max-w-md text-sm font-medium leading-snug text-fg/80">
              Syntax, MX, SMTP &amp; quality scoring — the same engine powering
              this page.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-bold text-white transition group-hover:bg-accent-dim">
            Get your free API key
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
          <span className="label text-[9px] uppercase tracking-widest text-fg-dim">
            mailboxlayer by APILayer
          </span>
        </div>
      </div>
    </a>
  );
}
