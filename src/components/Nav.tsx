import { LogoMark } from "./Logo";
import { BuyButton } from "./BuyButton";

const LINKS = [
  ["Machines", "#lineup"],
  ["How it works", "#how"],
  ["404 Meter", "#meter"],
  ["Earn", "#earn"],
  ["FAQ", "#faq"],
] as const;

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <LogoMark className="h-7 w-auto text-bone" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.24em]">
            Layer Machines
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="text-[12px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-bone"
            >
              {l}
            </a>
          ))}
        </nav>
        <BuyButton className="!hidden !px-4 !py-2 !text-[11px] sm:!inline-flex" />
      </div>
    </header>
  );
}
