"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "./Logo";
import { BuyButton } from "./BuyButton";
import { PAGES } from "@/lib/site";


export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <LogoMark className="h-7 w-auto text-bone" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.24em]">
            Layer Machines
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {PAGES.map(([l, h]) => {
            const on = path === h;
            return (
              <Link
                key={h}
                href={h}
                aria-current={on ? "page" : undefined}
                className={`relative text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-bone ${
                  on ? "text-bone" : "text-mute"
                }`}
              >
                {l}
                {on && <span className="absolute -bottom-[23px] left-0 right-0 h-px bg-bone" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <BuyButton className="!hidden !px-4 !py-2 !text-[11px] sm:!inline-flex" />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center border border-[var(--line-2)] md:hidden"
          >
            <span className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 right-0 h-px bg-bone transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 right-0 h-px bg-bone transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
              />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-[var(--line)] bg-ink px-4 pb-4 md:hidden">
          {PAGES.map(([l, h]) => (
            <Link
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between border-b border-[var(--line)] py-4 text-[13px] uppercase tracking-[0.2em] ${
                path === h ? "text-bone" : "text-mute"
              }`}
            >
              {l} <span aria-hidden>→</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
