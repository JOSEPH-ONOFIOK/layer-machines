"use client";

import { useMemo, useState } from "react";
import { SITE, SUPPLY_TEXT } from "@/lib/site";

const usd = (n: number) =>
  n >= 1000
    ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : `$${n.toFixed(2)}`;

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  fmt,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="kicker !text-[12px]">{label}</span>
        <span className="text-sm tabular-nums text-bone">{fmt(value)}</span>
      </div>
      <input
        type="range"
        className="meter"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ ["--p" as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </label>
  );
}

export function EarnPrinter() {
  const [volume, setVolume] = useState(250_000);
  const [lit, setLit] = useState(2000);
  const [mine, setMine] = useState(3);
  const [run, setRun] = useState(0);

  const r = useMemo(() => {
    const pool = volume * (SITE.feePct / 100);
    const perMachine = pool / Math.max(lit, 1);
    const day = perMachine * Math.min(mine, lit);
    return { pool, perMachine, day, month: day * 30 };
  }, [volume, lit, mine]);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-7">
        <Field
          label="Daily buy volume"
          value={volume}
          onChange={setVolume}
          min={10_000}
          max={2_000_000}
          step={10_000}
          fmt={usd}
        />
        <Field
          label="Machines switched on"
          value={lit}
          onChange={setLit}
          min={100}
          max={SITE.supply}
          step={50}
          fmt={(n) => `${n.toLocaleString("en-US")} / ${SUPPLY_TEXT}`}
        />
        <Field
          label="Machines you own"
          value={mine}
          onChange={setMine}
          min={1}
          max={25}
          step={1}
          fmt={(n) => String(n)}
        />
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="w-full border border-bone bg-bone px-5 py-3 text-[13px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-transparent hover:text-bone"
        >
          Print receipt
        </button>
        <p className="text-[13px] leading-relaxed text-mute">
          Illustration only, not a forecast. Uses a {SITE.feePct}% fee on buys
          split evenly across switched-on machines. Real payouts depend on
          volume and final contract rules.
        </p>
      </div>

      {/* the printer */}
      <div className="relative mx-auto w-full max-w-[380px]">
        <div className="relative z-10 h-6 border border-[var(--line-2)] bg-ink-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 bg-black" />
        </div>
        <div className="-mt-2 overflow-hidden px-6">
          <div key={run} className="receipt printing px-5 pt-6 text-[13px] uppercase tracking-[0.1em]">
            <div className="text-center">
              <div className="font-serif text-2xl normal-case tracking-normal">
                Layer Machines
              </div>
              <div className="mt-1 text-[11px] opacity-60">
                Earnings slip · No. {String(run + 1).padStart(4, "0")}
              </div>
            </div>
            <div className="receipt-rule my-4" />
            {[
              ["Daily volume", usd(volume)],
              [`Fee ${SITE.feePct}%`, usd(r.pool)],
              ["Machines on", lit.toLocaleString("en-US")],
              ["Per machine / day", usd(r.perMachine)],
              ["Your machines", `× ${mine}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="opacity-60">{k}</span>
                <span className="tabular-nums">{v}</span>
              </div>
            ))}
            <div className="receipt-rule my-4" />
            <div className="flex items-baseline justify-between">
              <span>You / day</span>
              <span className="font-serif text-3xl normal-case tracking-normal tabular-nums">
                {usd(r.day)}
              </span>
            </div>
            <div className="mt-1 flex justify-between opacity-70">
              <span>You / 30 days</span>
              <span className="tabular-nums">{usd(r.month)}</span>
            </div>
            <div className="receipt-rule my-4" />
            <div className="text-center text-[11px] opacity-55">
              Paid in {SITE.feeToken} · claim anytime
            </div>
            {/* fake barcode */}
            <div className="mx-auto mt-3 flex h-8 w-44 items-stretch gap-[2px]">
              {Array.from({ length: 34 }, (_, i) => (
                <span
                  key={i}
                  className="bg-paper-ink"
                  style={{ width: (i * 7 + run) % 3 === 0 ? 3 : 1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
