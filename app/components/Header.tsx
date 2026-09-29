import Image from "next/image";
import { assetPath } from "../lib/assets";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="mono text-sm font-semibold tracking-tight text-fg">
            MailWiz
          </span>
          <span className="text-xs text-fg-dim">by</span>
          <Image
            src={assetPath("/apilayer-logo.png")}
            alt="APILayer"
            width={600}
            height={116}
            priority
            className="h-5 w-auto dark:brightness-0 dark:invert"
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-fg-muted">
          <a
            href="https://mailboxlayer.com/documentation"
            target="_blank"
            rel="noreferrer noopener"
            className="mono text-fg-muted transition hover:text-fg"
          >
            docs ↗
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
