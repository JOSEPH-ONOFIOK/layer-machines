"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MACHINES } from "@/lib/site";

// back row first so the front row paints over it, same as the lineup art
const SLOTS = [
  { x: 2, y: 6, z: 1 },
  { x: 34, y: 0, z: 1 },
  { x: 66, y: 6, z: 1 },
  { x: 2, y: 40, z: 2 },
  { x: 34, y: 34, z: 2 },
  { x: 66, y: 40, z: 2 },
];

export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const [booted, setBooted] = useState<Set<number>>(new Set());

  function onMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r || e.pointerType !== "mouse") return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  }

  function boot(i: number) {
    setBooted((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto aspect-[1/0.86] w-full max-w-[640px] select-none"
    >
      {/* the plinth */}
      <div
        className="absolute inset-x-0 top-[22%] h-[72%] rounded-[50%] lg:inset-x-[-4%] transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${tilt.x * -6}px, ${tilt.y * -4}px)`,
          background:
            "radial-gradient(ellipse at 50% 40%, #333337 0%, #262629 55%, #1f1f22 100%)",
          boxShadow:
            "0 26px 0 #161618, 0 26px 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12), 0 60px 120px rgba(0,0,0,0.7)",
        }}
      />
      {MACHINES.map((m, i) => {
        const s = SLOTS[i];
        const depth = s.z === 2 ? 14 : 8;
        const on = booted.has(i);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => boot(i)}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            aria-label={`Machine ${m.id}, ${m.name}`}
            aria-pressed={on}
            className="group absolute w-[32%] cursor-pointer outline-none transition-transform duration-500 ease-out focus-visible:ring-1 focus-visible:ring-bone"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              zIndex: s.z * 10 + (hover === i ? 5 : 0),
              transform: `translate(${tilt.x * depth}px, ${tilt.y * depth * 0.6}px)`,
            }}
          >
            <span
              className="bob block"
              style={{ animationDelay: `${i * -0.9}s` }}
            >
              <span
                className="block transition-transform duration-300 ease-out group-hover:-translate-y-3"
              >
                <Image
                  src={m.img}
                  alt=""
                  width={356}
                  height={335}
                  priority={i < 3}
                  className="h-auto w-full transition-[filter] duration-300"
                  style={{
                    filter: on
                      ? `drop-shadow(0 0 22px ${m.accent}88) brightness(1.08)`
                      : hover === i
                        ? "brightness(1.06)"
                        : "none",
                  }}
                />
              </span>
            </span>
            <span
              className={`pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[var(--line-2)] bg-ink/90 px-2 py-1 text-[10px] uppercase tracking-[0.18em] transition-opacity duration-200 ${
                hover === i ? "opacity-100" : "opacity-0"
              }`}
            >
              Quote · {m.id} · {m.name}
            </span>
          </button>
        );
      })}
      <p className="absolute -bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-[0.24em] text-mute">
        Tap a machine to switch it on
      </p>
    </div>
  );
}
