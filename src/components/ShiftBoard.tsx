"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { MACHINES, SHIFT_POST, SITE } from "@/lib/site";

type Kind = "link" | "pick" | "boot" | "wallet";
type Task = {
  id: string;
  wo: string;
  title: string;
  sub: string;
  hours: number;
  kind: Kind;
  href?: string;
  cta?: string;
};

const postUrl = (text: string) =>
  `https://x.com/intent/post?text=${encodeURIComponent(text)}`;

// Link tasks with an empty href show as "opens at launch" and don't block the pass.
// Fill SITE.x / SITE.telegram and they switch on by themselves.
const TASKS: Task[] = [
  {
    id: "follow",
    wo: "WO-01",
    title: "Report to the floor manager",
    sub: "Follow Layer Machines on X.",
    hours: 1,
    kind: "link",
    href: SITE.x,
    cta: "Open X",
  },
  {
    id: "radio",
    wo: "WO-02",
    title: "Clock into the break room",
    sub: "Join the Telegram. Gossip, alpha, coffee.",
    hours: 1,
    kind: "link",
    href: SITE.telegram,
    cta: "Open Telegram",
  },
  {
    id: "post",
    wo: "WO-03",
    title: "Announce your shift",
    sub: "Tell the timeline you clocked in.",
    hours: 1,
    kind: "link",
    href: postUrl(SHIFT_POST),
    cta: "Post on X",
  },
  {
    id: "pick",
    wo: "WO-04",
    title: "Choose your station",
    sub: "Pick the machine you want on your desk.",
    hours: 1,
    kind: "pick",
  },
  {
    id: "boot",
    wo: "WO-05",
    title: "Run the power-on sequence",
    sub: "Screens light up in order. Repeat it back without a fault.",
    hours: 2,
    kind: "boot",
  },
  {
    id: "wallet",
    wo: "WO-06",
    title: "File your payroll address",
    sub: "Where your receipts get printed to.",
    hours: 2,
    kind: "wallet",
  },
];

const SHIFT = TASKS.reduce((n, t) => n + t.hours, 0);
const KEY = "lm-shift-v1";
const isLocked = (t: Task) => t.kind === "link" && !t.href;

type Saved = { done: string[]; machine: number | null; wallet: string; at: string | null };
const EMPTY: Saved = { done: [], machine: null, wallet: "", at: null };

// tiny localStorage-backed store; falls back to memory when storage is blocked
const listeners = new Set<() => void>();
let mem: string | null = null;
function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY) ?? mem;
  } catch {
    return mem;
  }
}
function parse(raw: string | null): Saved {
  if (!raw) return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}
function save(next: Saved) {
  mem = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, mem);
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
const noop = () => () => {};

export function ShiftBoard() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const s = useMemo(() => parse(raw), [raw]);
  const setS = useCallback((fn: Saved | ((p: Saved) => Saved)) => {
    save(typeof fn === "function" ? fn(parse(readRaw())) : fn);
  }, []);

  const done = new Set(s.done);
  const live = TASKS.filter((t) => !isLocked(t));
  const allDone = live.every((t) => done.has(t.id));
  const hours = TASKS.filter((t) => done.has(t.id)).reduce((n, t) => n + t.hours, 0);
  const liveHours = live.reduce((n, t) => n + t.hours, 0);

  const complete = useCallback((id: string, patch: Partial<Saved> = {}) => {
    setS((p) => {
      const next = { ...p, ...patch, done: p.done.includes(id) ? p.done : [...p.done, id] };
      const finished = TASKS.filter((t) => !isLocked(t)).every((t) => next.done.includes(t.id));
      if (finished && !next.at) next.at = new Date().toISOString();
      return next;
    });
  }, [setS]);

  const reset = () => setS(EMPTY);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      {/* work orders */}
      <ol className="flex flex-col gap-3">
        {TASKS.map((t) => (
          <WorkOrder
            key={t.id}
            t={t}
            done={done.has(t.id)}
            locked={isLocked(t)}
            s={s}
            onDone={complete}
          />
        ))}
        {/* phones: keep the punches in view while you work */}
        <li className="sticky bottom-3 z-10 lg:hidden" aria-hidden>
          <a
            href="#timecard"
            className="flex items-center justify-between gap-3 border border-[var(--line-2)] bg-ink/90 px-4 py-3 backdrop-blur-md"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-mute">
              {allDone && ready ? "Pass printed ↓" : "Time card"}
            </span>
            <span className="flex gap-1">
              {TASKS.flatMap((t) =>
                Array.from({ length: t.hours }, (_, k) => (
                  <span
                    key={`${t.id}${k}`}
                    className={`block h-2.5 w-2.5 rounded-full border ${
                      done.has(t.id) ? "punched border-bone bg-bone" : isLocked(t) ? "border-[#2a2a2e]" : "border-[var(--line-2)]"
                    }`}
                  />
                )),
              )}
            </span>
            <span className="text-[12px] tabular-nums">
              {hours}/{liveHours}H
            </span>
          </a>
        </li>
      </ol>

      {/* time card */}
      <div id="timecard" className="scroll-mt-20 lg:sticky lg:top-24 lg:self-start">
        <TimeCard s={s} done={done} hours={hours} liveHours={liveHours} allDone={allDone && ready} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-mute">
          <span>Saved on this device only</span>
          {s.done.length > 0 && (
            <button type="button" onClick={reset} className="underline-offset-4 hover:text-bone hover:underline">
              Clock out · reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── work order row ───────────────────────── */

function WorkOrder({
  t,
  done,
  locked,
  s,
  onDone,
}: {
  t: Task;
  done: boolean;
  locked: boolean;
  s: Saved;
  onDone: (id: string, patch?: Partial<Saved>) => void;
}) {
  return (
    <li
      className={`relative border bg-ink-2 transition-colors duration-300 ${
        done ? "border-bone/40" : "border-[var(--line-2)]"
      } ${locked ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center border text-[12px] transition-colors ${
            done ? "border-bone bg-bone text-ink" : "border-[var(--line-2)] text-mute"
          }`}
          aria-hidden
        >
          {done ? "✓" : locked ? "·" : ""}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em]">
              <span className="mr-2 font-normal text-mute">{t.wo}</span>
              {t.title}
            </h3>
            <span className="text-[11px] tabular-nums tracking-[0.16em] text-mute">
              +{t.hours}H
            </span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-mute">{t.sub}</p>

          {!done && !locked && (
            <div className="mt-4">
              {t.kind === "link" && <LinkTask t={t} onDone={() => onDone(t.id)} />}
              {t.kind === "pick" && (
                <PickTask value={s.machine} onPick={(i) => onDone(t.id, { machine: i })} />
              )}
              {t.kind === "boot" && <BootTask onDone={() => onDone(t.id)} />}
              {t.kind === "wallet" && <WalletTask onDone={(w) => onDone(t.id, { wallet: w })} />}
            </div>
          )}
          {locked && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-mute">
              Opens at launch · doesn&apos;t count against you
            </p>
          )}
          {done && t.kind === "pick" && s.machine !== null && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-bone/80">
              Station: {MACHINES[s.machine].name}
            </p>
          )}
          {done && t.kind === "wallet" && s.wallet && (
            <p className="mt-2 text-[11px] tracking-[0.12em] text-bone/80">{short(s.wallet)}</p>
          )}
        </div>
      </div>
    </li>
  );
}

const btn =
  "inline-flex items-center gap-2 border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors";

function LinkTask({ t, onDone }: { t: Task; onDone: () => void }) {
  const [wait, setWait] = useState<number | null>(null);
  useEffect(() => {
    if (wait === null || wait <= 0) return;
    const id = setTimeout(() => setWait((w) => (w ?? 1) - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={t.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => setWait((w) => w ?? 4)}
        className={`${btn} border-[var(--line-2)] hover:border-bone hover:bg-bone hover:text-ink`}
      >
        {t.cta} <span aria-hidden>↗</span>
      </a>
      {wait !== null && (
        <button
          type="button"
          disabled={wait > 0}
          onClick={onDone}
          className={`${btn} border-bone ${
            wait > 0 ? "cursor-wait text-mute" : "bg-bone text-ink hover:bg-transparent hover:text-bone"
          }`}
        >
          {wait > 0 ? `Checking in ${wait}s` : "I did it"}
        </button>
      )}
    </div>
  );
}

function PickTask({ value, onPick }: { value: number | null; onPick: (i: number) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {MACHINES.map((m, i) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Pick ${m.name}`}
          title={m.name}
          className="group relative aspect-square border transition-colors"
          style={{ borderColor: value === i ? m.accent : "var(--line-2)" }}
        >
          <Image
            src={m.img}
            alt=""
            fill
            sizes="80px"
            className="object-contain p-1 transition-transform duration-300 group-hover:-translate-y-1"
          />
        </button>
      ))}
    </div>
  );
}

/* power-on sequence: a memory game on the six screens */
const SEQ_LEN = 5;
function makeSeq() {
  const next: number[] = [];
  while (next.length < SEQ_LEN) {
    const r = Math.floor(Math.random() * MACHINES.length);
    if (r !== next[next.length - 1]) next.push(r);
  }
  return next;
}

function BootTask({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "fault" | "ok">("idle");
  const [seq, setSeq] = useState<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const next = makeSeq();
    setSeq(next);
    setStep(0);
    setPhase("show");
    next.forEach((n, i) => {
      later(() => setLit(n), 500 + i * 620);
      later(() => setLit(null), 500 + i * 620 + 400);
    });
    later(() => setPhase("input"), 500 + next.length * 620);
  }

  function press(i: number) {
    if (phase !== "input") return;
    setLit(i);
    later(() => setLit((l) => (l === i ? null : l)), 220);
    if (seq[step] !== i) {
      setPhase("fault");
      later(() => setPhase("idle"), 1100);
      return;
    }
    if (step + 1 === seq.length) {
      setPhase("ok");
      later(onDone, 700);
    } else setStep(step + 1);
  }

  const status = {
    idle: "Standby",
    show: "Watch the screens…",
    input: `Your turn · ${step}/${SEQ_LEN}`,
    fault: `Fault at step ${step + 1}. Rebooting.`,
    ok: "All systems online",
  }[phase];

  return (
    <div className={phase === "fault" ? "shake" : ""}>
      <div className="grid grid-cols-6 gap-2">
        {MACHINES.map((m, i) => {
          const on = lit === i || phase === "ok";
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => press(i)}
              disabled={phase !== "input"}
              aria-label={`Screen ${m.id}`}
              className="relative aspect-[4/3] border transition-[background,box-shadow,border-color] duration-150"
              style={{
                borderColor: on ? m.accent : phase === "fault" ? "#d14b4b" : "var(--line-2)",
                background: on ? m.accent : "#08080a",
                boxShadow: on ? `0 0 24px ${m.accent}aa, inset 0 0 12px #fff6` : "inset 0 0 14px #000",
                cursor: phase === "input" ? "pointer" : "default",
              }}
            >
              <span
                className="absolute bottom-0.5 right-1 text-[8px] tabular-nums"
                style={{ color: on ? "#000a" : "#3a3a3f" }}
              >
                {m.id.slice(-1)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`text-[10px] uppercase tracking-[0.2em] ${
            phase === "fault" ? "text-[#e06060]" : phase === "ok" ? "text-bone" : "text-mute"
          } ${phase === "show" ? "caret" : ""}`}
        >
          {status}
        </span>
        {(phase === "idle" || phase === "fault") && (
          <button
            type="button"
            onClick={start}
            className={`${btn} border-[var(--line-2)] hover:border-bone hover:bg-bone hover:text-ink`}
          >
            {seq.length ? "Retry" : "Power on"}
          </button>
        )}
      </div>
    </div>
  );
}

function WalletTask({ onDone }: { onDone: (w: string) => void }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  const valid = /^0x[a-fA-F0-9]{40}$/.test(v.trim());
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onDone(v.trim());
        else setErr(true);
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        value={v}
        onChange={(e) => {
          setV(e.target.value);
          setErr(false);
        }}
        placeholder="0x…"
        spellCheck={false}
        autoComplete="off"
        aria-label="EVM wallet address"
        aria-invalid={err}
        className={`min-w-0 flex-1 border bg-ink px-3 py-2 text-[12px] tracking-[0.06em] outline-none placeholder:text-[#4a4a50] focus:border-bone ${
          err ? "shake border-[#d14b4b]" : "border-[var(--line-2)]"
        }`}
      />
      <button
        type="submit"
        className={`${btn} justify-center ${
          valid ? "border-bone bg-bone text-ink hover:bg-transparent hover:text-bone" : "border-[var(--line-2)] text-mute"
        }`}
      >
        File it
      </button>
      {err && (
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#e06060] sm:hidden">
          Needs a 0x address, 42 characters
        </span>
      )}
    </form>
  );
}

/* ───────────────────────── time card / pass ───────────────────────── */

const short = (w: string) => `${w.slice(0, 6)}…${w.slice(-4)}`;
const employeeNo = (w: string) =>
  w ? String((parseInt(w.slice(-6), 16) % SITE.supply) + 1).padStart(4, "0") : "----";

function TimeCard({
  s,
  done,
  hours,
  liveHours,
  allDone,
}: {
  s: Saved;
  done: Set<string>;
  hours: number;
  liveHours: number;
  allDone: boolean;
}) {
  const m = s.machine !== null ? MACHINES[s.machine] : null;
  const slots = TASKS.flatMap((t) =>
    Array.from({ length: t.hours }, () => ({ t, on: done.has(t.id), locked: isLocked(t) })),
  );

  if (allDone) return <ShiftPass s={s} />;

  return (
    <div className="receipt px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.2em]">
        <div>
          <div className="font-semibold">Time card</div>
          <div className="opacity-60">Layer Machines · Floor 1</div>
        </div>
        <div className="text-right">
          <div className="opacity-60">No.</div>
          <div className="font-semibold tabular-nums">{employeeNo(s.wallet)}</div>
        </div>
      </div>

      <div className="receipt-rule my-4" />

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Hours logged</div>
          <div className="font-serif text-6xl leading-none tabular-nums">
            {hours}
            <span className="text-2xl opacity-40">/{liveHours}</span>
          </div>
        </div>
        <div className="relative h-20 w-20">
          {m ? (
            <Image key={m.id} src={m.img} alt={m.name} fill sizes="80px" className="boot-in object-contain" />
          ) : (
            <div className="grid h-full w-full place-items-center border border-dashed border-black/25 text-center text-[8px] uppercase tracking-[0.16em] opacity-50">
              No station
            </div>
          )}
        </div>
      </div>

      {/* punch strip */}
      <div className="mt-5 grid grid-cols-8 gap-1.5">
        {slots.map((sl, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="relative grid aspect-[1/1.5] w-full place-items-center border border-black/20"
              style={
                sl.locked
                  ? {
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 6px)",
                    }
                  : undefined
              }
            >
              {sl.on && (
                <span className="punched block h-[46%] w-[60%] rounded-full bg-ink shadow-[inset_0_2px_3px_rgba(255,255,255,0.15)]" />
              )}
            </div>
            <span className="text-[8px] tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <div className="receipt-rule my-4" />

      <div className="space-y-1 text-[10px] uppercase tracking-[0.16em]">
        {TASKS.map((t) => (
          <div key={t.id} className="flex justify-between gap-3">
            <span className={done.has(t.id) ? "" : "opacity-45"}>
              {t.wo} {t.title}
            </span>
            <span className="shrink-0 tabular-nums">
              {isLocked(t) ? "soon" : done.has(t.id) ? `${t.hours}.0` : "--"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[9px] uppercase tracking-[0.24em] opacity-50">
        Full shift prints your pass
      </p>
    </div>
  );
}

function ShiftPass({ s }: { s: Saved }) {
  const m = MACHINES[s.machine ?? 0];
  const no = employeeNo(s.wallet);
  const date = s.at ? new Date(s.at) : new Date();
  const when = date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const share = postUrl(
    `Clocked a full shift at ${SITE.name}. Operator #${no}, running ${m.name}. ${SHIFT} hours, zero faults.`,
  );

  return (
    <div
      className="boot-in relative overflow-hidden border bg-ink-2 p-5 sm:p-6"
      style={{ borderColor: m.accent, boxShadow: `0 0 80px ${m.accent}22` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 80% 0%, ${m.accent}33, transparent 60%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.22em] text-mute">
          <span>Shift pass</span>
          <span>{SITE.standard} · {SITE.chain}</span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-mute">Operator</div>
            <div className="font-serif text-[clamp(3rem,10vw,4.5rem)] leading-none tabular-nums">
              #{no}
            </div>
            <div
              className="stamp mt-4 inline-block border-2 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.24em]"
              style={{ borderColor: m.accent, color: m.accent }}
            >
              Clocked in
            </div>
          </div>
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            <Image
              src={m.img}
              alt={m.name}
              fill
              sizes="128px"
              className="bob object-contain"
              style={{ filter: `drop-shadow(0 0 20px ${m.accent}88)` }}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--line-2)] pt-4 text-[11px] uppercase tracking-[0.14em]">
          {[
            ["Station", m.name],
            ["Payroll", s.wallet ? short(s.wallet) : "—"],
            ["Clocked", when],
            ["Status", "On shift"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[9px] tracking-[0.22em] text-mute">{k}</dt>
              <dd className={`mt-0.5 truncate ${k === "Payroll" ? "normal-case" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>


        <a
          href={share}
          target="_blank"
          rel="noreferrer"
          className={`${btn} mt-6 w-full justify-center border-bone bg-bone text-ink hover:bg-transparent hover:text-bone`}
        >
          Post my pass <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
