"use client";

import Image from "next/image";
import { useState } from "react";
import { MACHINES, SITE } from "@/lib/site";

const MAX = 6;
// a fixed shuffle so the wallet doesn't reshuffle while you drag
const ORDER = [3, 0, 5, 1, 4, 2];

export function FractionMeter() {
  const [bal, setBal] = useState(1.6);
  const whole = Math.floor(bal + 1e-9);
  const frac = +(bal - whole).toFixed(2);
  const pct = (bal / MAX) * 100;

  const add = (d: number) =>
    setBal((b) => Math.min(MAX, Math.max(0, +(b + d).toFixed(2))));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      {/* controls */}
      <div className="flex flex-col">
        <div className="kicker mb-3">Your balance</div>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-6xl tabular-nums sm:text-7xl">
            {bal.toFixed(2)}
          </span>
          <span className="text-sm tracking-[0.16em] text-mute">
            {SITE.ticker}
          </span>
        </div>

        <input
          type="range"
          className="meter mt-8"
          min={0}
          max={MAX}
          step={0.05}
          value={bal}
          onChange={(e) => setBal(+e.target.value)}
          style={{ ["--p" as string]: `${pct}%` }}
          aria-label={`${SITE.ticker} balance`}
        />
        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-mute">
          {Array.from({ length: MAX + 1 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
          {[
            ["Buy 0.4", 0.4],
            ["Buy 1", 1],
            ["Sell 0.5", -0.5],
            ["Sell 1", -1],
          ].map(([l, d]) => (
            <button
              key={l}
              type="button"
              onClick={() => add(d as number)}
              className="border border-[var(--line-2)] px-1 py-2 text-[11px] uppercase tracking-[0.08em] sm:px-3 sm:text-[12px] sm:tracking-[0.16em] transition-colors hover:border-bone hover:bg-bone hover:text-ink"
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-5 text-[15px] leading-relaxed text-mute">
          <p>
            <span className="text-bone">{whole}</span>{" "}
            {whole === 1 ? "machine" : "machines"} in your wallet.
            {frac > 0 ? (
              <>
                {" "}
                Next one is{" "}
                <span className="text-bone">{Math.round(frac * 100)}%</span>{" "}
                built. Buy{" "}
                <span className="text-bone">{(1 - frac).toFixed(2)}</span> more
                to finish it.
              </>
            ) : whole > 0 ? (
              " No loose change. Clean."
            ) : (
              " Buy any amount to start one."
            )}
          </p>
          <p className="mt-3 hidden text-[13px] sm:block">
            Sell below a whole number and the newest machine powers down and
            leaves. That&apos;s ERC-404: the token and the NFT are the same
            thing.
          </p>
        </div>
      </div>

      {/* wallet */}
      <div className="relative border border-[var(--line-2)] bg-ink-2 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-mute">
          <span>Wallet · 0x…you</span>
          <span className="tabular-nums">
            {whole} / {MAX} slots
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: MAX }, (_, i) => {
            const m = MACHINES[ORDER[i]];
            const isWhole = i < whole;
            const isPartial = i === whole && frac > 0;
            return (
              <div
                key={i}
                className="relative aspect-square border border-dashed border-[var(--line)]"
              >
                {isWhole && (
                  <div key={`w${m.id}`} className="boot-in absolute inset-1">
                    <Image
                      src={m.img}
                      alt={`Machine ${m.name}`}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                )}
                {isPartial && (
                  <div className="absolute inset-1">
                    <Image
                      src={m.img}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain opacity-[0.12] grayscale"
                    />
                    <div
                      className="absolute inset-0 transition-[clip-path] duration-300"
                      style={{ clipPath: `inset(${(1 - frac) * 100}% 0 0 0)` }}
                    >
                      <Image
                        src={m.img}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-contain opacity-60 grayscale"
                      />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-ink px-1 text-[11px] tabular-nums text-bone">
                      {Math.round(frac * 100)}%
                    </span>
                  </div>
                )}
                {!isWhole && !isPartial && (
                  <span className="absolute inset-0 grid place-items-center text-[11px] tracking-[0.16em] text-[#3a3a3f]">
                    EMPTY
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
