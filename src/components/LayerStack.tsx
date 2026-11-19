"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LogoMark } from "./Logo";
import { MACHINES, SITE, SUPPLY_TEXT } from "@/lib/site";

type Plate = {
  key: string;
  code: string;
  name: string;
  value: (m: (typeof MACHINES)[number]) => string;
  note: string;
};

// bottom of the stack first
const PLATES: Plate[] = [
  {
    key: "chain",
    code: "L0",
    name: "Chain",
    value: () => SITE.chain,
    note: "Everything settles here. The ground floor every machine is bolted to.",
  },
  {
    key: "contract",
    code: "L1",
    name: "Contract",
    value: () => SITE.standard,
    note: `Token and NFT in one. 1 ${SITE.ticker} in, 1 machine out. ${SUPPLY_TEXT} max.`,
  },
  {
    key: "desk",
    code: "L2",
    name: "Desk",
    value: (m) => `Quote · ${m.id}`,
    note: "The base plate. Keyboard, serial number and the receipt slot that pays you.",
  },
  {
    key: "shell",
    code: "L3",
    name: "Shell",
    value: (m) => m.shell,
    note: "The casing colour, drawn at random when your machine boots.",
  },
  {
    key: "screen",
    code: "L4",
    name: "Screen",
    value: (m) => m.screen,
    note: "What it shows when it's on. Some screens are rarer than others.",
  },
  {
    key: "extra",
    code: "L5",
    name: "Desk extra",
    value: (m) => m.extra,
    note: "The thing sitting next to it. Mugs, cacti, floppies. Personality.",
  },
  {
    key: "owner",
    code: "L6",
    name: "Operator",
    value: () => "You",
    note: "The top layer. Hold it, rent it out, collect the receipts.",
  },
];

const RM = "(prefers-reduced-motion: reduce)";
const subRM = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function LayerStack() {
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [pick, setPick] = useState(1);
  const [compact, setCompact] = useState(false);
  const still = useSyncExternalStore(
    subRM,
    () => window.matchMedia(RM).matches,
    () => false,
  );

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(clamp(-r.top / (total || 1)));
      setCompact(window.innerWidth < 1024);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const m = MACHINES[pick];
  // first 15% of scroll: stack stays shut, then it blows apart
  // phones: no long scroll, just show it exploded
  const flat = still || compact;
  const open = flat ? 1 : ease(clamp((p - 0.08) / 0.5));
  const active = flat ? -1 : Math.min(PLATES.length - 1, Math.floor(clamp((p - 0.12) / 0.8) * PLATES.length));
  const gap = (compact ? 6 : 10) + open * (compact ? 26 : 40);
  const spin = 45 - open * 18;

  return (
    <div ref={wrap} className="relative lg:h-[240vh]">
      <div className="flex items-center overflow-hidden pb-16 lg:sticky lg:top-0 lg:h-[100svh] lg:pb-0">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:gap-12">
          {/* the stack */}
          <div className="relative mx-auto aspect-[1/0.78] w-full max-w-[560px] [perspective:1800px] lg:aspect-square">
            <div
              className="absolute left-1/2 top-[68%] h-0 w-0 [transform-style:preserve-3d] lg:top-[66%]"
              style={{ transform: `rotateX(60deg) rotateZ(${spin}deg)` }}
            >
              {PLATES.map((pl, i) => {
                const z = i * gap;
                const lit = i === active;
                const past = active >= 0 && i < active;
                return (
                  <div
                    key={pl.key}
                    className="stack-plate absolute [transform-style:preserve-3d]"
                    style={{
                      transform: `translate(-50%,-50%) translateZ(${z + (lit ? 18 : 0)}px)`,
                    }}
                  >
                    {/* slab thickness */}
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "translateZ(-7px)",
                        background: "#0c0c0e",
                        boxShadow: `0 0 0 1px ${lit ? m.accent : "rgba(255,255,255,0.08)"}`,
                      }}
                    />
                    <PlateFace pl={pl} m={m} lit={lit} dim={past} />
                  </div>
                );
              })}
            </div>
            {/* readout */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between text-[11px] uppercase tracking-[0.18em] text-mute">
              <span>Exploded view · Quote {m.id}</span>
              <span className="tabular-nums">Sep {Math.round(open * 100)}%</span>
            </div>
          </div>

          {/* the spec sheet */}
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {MACHINES.map((mm, i) => (
                <button
                  key={mm.id}
                  type="button"
                  onClick={() => setPick(i)}
                  aria-pressed={pick === i}
                  aria-label={`Show ${mm.name}`}
                  className="relative h-12 w-12 border transition-colors sm:h-14 sm:w-14"
                  style={{
                    borderColor: pick === i ? mm.accent : "var(--line-2)",
                    background: pick === i ? `${mm.accent}14` : "transparent",
                  }}
                >
                  <Image src={mm.img} alt="" fill sizes="56px" className="object-contain p-1" />
                </button>
              ))}
            </div>
            <ol className="border-t border-[var(--line-2)]">
              {[...PLATES].reverse().map((pl) => {
                const i = PLATES.indexOf(pl);
                const lit = i === active;
                return (
                  <li
                    key={pl.key}
                    className="grid grid-cols-[2.6rem_1fr_auto] items-baseline gap-3 border-b border-[var(--line)] py-2.5 transition-colors duration-300 sm:py-3"
                    style={{ color: lit ? "var(--bone)" : undefined }}
                  >
                    <span
                      className="text-[12px] tabular-nums tracking-[0.18em] transition-colors"
                      style={{ color: lit ? m.accent : "var(--mute)" }}
                    >
                      {pl.code}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-[13px] uppercase tracking-[0.18em] transition-colors ${lit ? "text-bone" : "text-mute"}`}
                      >
                        {pl.name}
                      </div>
                      <div
                        className="grid transition-[grid-template-rows] duration-500 ease-out"
                        style={{ gridTemplateRows: lit ? "1fr" : "0fr" }}
                      >
                        <p className="overflow-hidden text-[14px] leading-relaxed text-mute">
                          <span className="block pt-1.5">{pl.note}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-right text-[13px] uppercase tracking-[0.12em] ${lit ? "text-bone" : "text-mute/70"}`}
                    >
                      {pl.value(m)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlateFace({
  pl,
  m,
  lit,
  dim,
}: {
  pl: Plate;
  m: (typeof MACHINES)[number];
  lit: boolean;
  dim: boolean;
}) {
  const edge = lit ? m.accent : "rgba(255,255,255,0.22)";
  const base = "absolute inset-0 overflow-hidden transition-[box-shadow,opacity,background] duration-300";
  const style: React.CSSProperties = {
    boxShadow: `0 0 0 1px ${edge}${lit ? `, 0 0 40px ${m.accent}55` : ""}`,
    opacity: dim ? 0.55 : 1,
  };

  const label = (
    <span className="absolute bottom-2 left-2.5 text-[9px] uppercase tracking-[0.18em] text-bone/60">
      {pl.code} · {pl.name}
    </span>
  );

  switch (pl.key) {
    case "chain":
      return (
        <div
          className={base}
          style={{
            ...style,
            background: "#141416",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <LogoMark className="h-[34%] w-auto text-bone/90" />
          </div>
          {label}
        </div>
      );
    case "contract":
      return (
        <div className={base} style={{ ...style, background: "rgba(20,20,22,0.92)" }}>
          <div className="absolute inset-[14%] grid place-items-center border border-dashed border-white/20 text-center">
            <div>
              <div className="font-serif text-[clamp(1.4rem,5vw,2.4rem)] leading-none">404</div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.16em] text-mute">
                token ⇄ nft
              </div>
            </div>
          </div>
          {label}
        </div>
      );
    case "desk":
      return (
        <div className={base} style={{ ...style, background: `color-mix(in srgb, ${m.accent} 22%, #18181b)` }}>
          <div
            className="absolute inset-x-[16%] bottom-[22%] h-[34%]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.5) 2px, transparent 2px), linear-gradient(rgba(0,0,0,0.5) 2px, transparent 2px)",
              backgroundSize: "12px 12px",
              backgroundColor: "rgba(255,255,255,0.75)",
            }}
          />
          <div className="absolute right-[10%] top-[12%] h-[40%] w-[12%] bg-white/85" />
          {label}
        </div>
      );
    case "shell":
      return (
        <div
          className={base}
          style={{
            ...style,
            background: `linear-gradient(135deg, ${m.accent} 0%, color-mix(in srgb, ${m.accent} 60%, #000) 100%)`,
          }}
        >
          <div className="absolute inset-[18%] border border-black/20" />
          <div className="absolute right-[22%] top-[24%] flex flex-col gap-1">
            {[0, 1, 2].map((k) => (
              <span key={k} className="block h-[2px] w-6 bg-black/25" />
            ))}
          </div>
          <span className="absolute bottom-2 left-2.5 text-[9px] uppercase tracking-[0.18em] text-black/55">
            {pl.code} · {pl.name}
          </span>
        </div>
      );
    case "screen":
      return (
        <div className={base} style={{ ...style, background: "rgba(10,10,12,0.9)" }}>
          <div
            className="absolute inset-[16%] grid place-items-center"
            style={{
              background: "#060608",
              boxShadow: `inset 0 0 30px ${m.accent}40, 0 0 0 6px color-mix(in srgb, ${m.accent} 40%, #111)`,
            }}
          >
            <span
              className="text-[clamp(0.6rem,2vw,0.8rem)] uppercase tracking-[0.16em]"
              style={{ color: m.accent, textShadow: `0 0 8px ${m.accent}` }}
            >
              {m.screen}
            </span>
          </div>
          {label}
        </div>
      );
    case "extra":
      return (
        <div className={base} style={{ ...style, background: "rgba(16,16,18,0.55)" }}>
          <div
            className="absolute right-[18%] top-[18%] grid h-[28%] w-[28%] place-items-center rounded-full"
            style={{ background: `${m.accent}`, boxShadow: `0 0 24px ${m.accent}88` }}
          >
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-black/70">
              +1
            </span>
          </div>
          <span className="absolute left-[14%] top-[22%] max-w-[50%] text-[11px] uppercase leading-tight tracking-[0.16em] text-bone/80">
            {m.extra}
          </span>
          {label}
        </div>
      );
    default:
      return (
        <div
          className={base}
          style={{
            ...style,
            background: lit ? `${m.accent}1f` : "rgba(255,255,255,0.03)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="absolute inset-[10%] border border-dashed border-white/40" />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-[12px] uppercase tracking-[0.3em] text-bone">0x…you</div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.16em] text-mute">operator seat</div>
            </div>
          </div>
          {label}
        </div>
      );
  }
}
