import Link from "next/link";
import { LogoMark } from "./Logo";
import { PAGES, SITE, SUPPLY_TEXT } from "@/lib/site";

export function Footer() {
  const links = [
    ["X", SITE.x],
    ["Telegram", SITE.telegram],
    ["Docs", SITE.docsUrl],
  ] as const;

  return (
    <>
      <div className="meander" />
      <footer className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-[11px] uppercase tracking-[0.18em] text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-5 w-auto text-bone" />
            <span>
              Layer Machines · {SUPPLY_TEXT} machines on {SITE.chain}
            </span>
          </div>
          <div className="flex flex-wrap gap-6">
            {PAGES.map(([l, h]) => (
              <Link key={h} href={h} className="hover:text-bone">
                {l}
              </Link>
            ))}
            <span className="hidden text-[var(--line-2)] sm:inline">|</span>
            {links.map(([l, h]) =>
              h ? (
                <a key={l} href={h} target="_blank" rel="noreferrer" className="hover:text-bone">
                  {l}
                </a>
              ) : (
                <span key={l} title="Coming soon" className="opacity-50">
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-10 text-[10px] leading-relaxed tracking-[0.1em] text-[#55555b] sm:px-6">
          Not financial advice. Digital assets are volatile; only buy what you
          can afford to lose.
        </p>
      </footer>
    </>
  );
}
