"use client";

import Image from "next/image";
import { useState } from "react";
import { MACHINES, SUPPLY_TEXT } from "@/lib/site";

export function Lineup() {
  const [sel, setSel] = useState(0);
  const m = MACHINES[sel];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
      {/* showcase */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-[38%] rounded-[50%] transition-[background] duration-500"
          style={{
            background: `radial-gradient(ellipse, ${m.accent}22 0%, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto aspect-[356/335] w-full max-w-[400px]">
          <Image
            key={m.id}
            src={m.img}
            alt={`Quote ${m.id}, ${m.name}`}
            fill
            sizes="(min-width: 1024px) 400px, 90vw"
            className="boot-in object-contain"
          />
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          {MACHINES.map((x, i) => (
            <span
              key={x.id}
              className="h-1 w-6 transition-colors"
              style={{ background: i === sel ? x.accent : "var(--slab)" }}
            />
          ))}
        </div>
      </div>

      {/* picker + spec receipt */}
      <div>
        <div className="grid grid-cols-6 gap-2">
          {MACHINES.map((x, i) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setSel(i)}
              aria-label={x.name}
              aria-pressed={i === sel}
              className={`relative aspect-square border bg-ink-2 transition-colors ${
                i === sel
                  ? "border-bone"
                  : "border-[var(--line)] hover:border-[var(--line-2)]"
              }`}
            >
              <Image
                src={x.img}
                alt=""
                fill
                sizes="72px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>

        <div key={m.id} className="receipt boot-in mt-6 px-6 pt-6 text-[13px]">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] opacity-60">
            <span>Spec sheet</span>
            <span>Quote · {m.id}</span>
          </div>
          <h3 className="mt-3 font-serif text-4xl leading-none">{m.name}</h3>
          <p className="mt-2 opacity-70">{m.tagline}</p>
          <div className="receipt-rule my-4" />
          <dl className="space-y-1.5 uppercase tracking-[0.12em]">
            {[
              ["Shell", m.shell],
              ["Screen", m.screen],
              ["Desk extra", m.extra],
              ["Supply", `1 of ${SUPPLY_TEXT}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 text-[12px]">
                <dt className="opacity-55">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="receipt-rule my-4" />
          <p className="text-center text-[11px] uppercase tracking-[0.2em] opacity-55">
            Thank you for your service
          </p>
        </div>
      </div>
    </div>
  );
}
