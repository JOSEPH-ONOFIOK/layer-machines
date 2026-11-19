import Image from "next/image";
import Link from "next/link";
import { HeroStage } from "@/components/HeroStage";
import { BuyButton } from "@/components/BuyButton";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { MACHINES, SITE, STEPS, SUPPLY_TEXT } from "@/lib/site";

const TICKER = [
  `${SUPPLY_TEXT} machines`,
  `1 ${SITE.ticker} = 1 machine`,
  "Fractions complete on your next buy",
  "Own › Rent › Earn",
  `${SITE.standard} on ${SITE.chain}`,
  "Every buy prints a receipt",
];

const DOORS = [
  {
    href: "/machines",
    code: "A",
    title: "Machines",
    body: "Meet the lineup, then watch one come apart layer by layer.",
    img: MACHINES[2].img,
    accent: MACHINES[2].accent,
  },
  {
    href: "/earn",
    code: "B",
    title: "Earn",
    body: "Drag the 404 meter, then print yourself an earnings receipt.",
    img: MACHINES[4].img,
    accent: MACHINES[4].accent,
  },
  {
    href: "/shift",
    code: "C",
    title: "Shift board",
    body: "Six work orders. Punch your time card. Print an operator pass.",
    img: MACHINES[5].img,
    accent: MACHINES[5].accent,
  },
  {
    href: "/faq",
    code: "D",
    title: "FAQ",
    body: "ERC-404, fractions, renting, payouts. The short answers.",
    img: MACHINES[0].img,
    accent: MACHINES[0].accent,
  },
];

export default function Home() {
  return (
    <main id="top" className="grid-bg">
      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl lg:min-h-[100svh] items-center gap-8 px-4 pb-12 pt-24 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-28 lg:grid-cols-[1fr_1.15fr] lg:pt-20">
        <div>
          <div className="kicker flex items-center gap-3 !text-bone/80">
            <LogoMark className="h-5 w-auto text-bone" />
            {SITE.standard} on {SITE.chain} · {SUPPLY_TEXT} machines
          </div>
          <h1 className="mt-7 font-serif text-[clamp(3.6rem,10vw,7.6rem)] uppercase leading-[0.86] tracking-[-0.01em]">
            Layer
            <br />
            Machines
          </h1>
          <div className="mt-8 hidden h-[2px] w-16 bg-bone sm:block" />
          <p className="mt-8 text-[15px] font-semibold uppercase tracking-[0.32em]">
            Own <span className="text-mute">›</span> Rent{" "}
            <span className="text-mute">›</span> Earn
          </p>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">
            Hold a whole {SITE.ticker} and a machine boots up in your wallet.
            Rent it out or keep it running. Every buy pays the machines.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 sm:mt-9 sm:gap-3">
            <BuyButton />
            <Link
              href="/shift"
              className="inline-flex items-center gap-2 border border-[var(--line-2)] px-5 py-3 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-bone"
            >
              Clock in <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <HeroStage />
      </section>

      {/* TICKER */}
      <div className="overflow-hidden border-b border-[var(--line)] bg-ink py-4">
        <div className="marquee-track flex">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {TICKER.map((t) => (
                <span
                  key={t}
                  className="flex items-center whitespace-nowrap px-8 text-[13px] uppercase tracking-[0.18em] text-mute"
                >
                  <span className="mr-8 text-bone">✦</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* DOORS */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24">
          <SectionHead n="02" kicker="The floor" title="Pick a room." />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {DOORS.map((d, i) => (
              <Reveal key={d.href} delay={i * 90}>
                <Link
                  href={d.href}
                  className="group relative flex h-full flex-col overflow-hidden border border-[var(--line-2)] bg-ink-2 p-4 sm:p-5 transition-colors hover:border-bone/60"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 70% 20%, ${d.accent}22, transparent 65%)` }}
                  />
                  <div className="relative flex items-center justify-between text-[12px] uppercase tracking-[0.16em] text-mute">
                    <span>Room {d.code}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-bone">
                      →
                    </span>
                  </div>
                  <div className="relative mx-auto my-4 h-20 w-20 sm:my-6 sm:h-32 sm:w-32 transition-transform duration-500 group-hover:-translate-y-2">
                    <Image src={d.img} alt="" fill sizes="128px" className="object-contain" />
                  </div>
                  <h3 className="relative font-serif text-2xl uppercase leading-none sm:text-3xl">{d.title}</h3>
                  <p className="relative mt-2 hidden text-[15px] leading-relaxed text-mute sm:block">{d.body}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead
          n="01"
          kicker="How it works"
          title={
            <>
              Three moves.
              <br />
              One machine.
            </>
          }
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 120} className="group">
              <div className="h-full border border-[var(--line-2)] bg-ink-2 p-6 transition-colors group-hover:border-bone/50">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] tracking-[0.16em] text-mute">[{s.n}]</span>
                  <span className="font-serif text-3xl uppercase">{s.verb}</span>
                </div>
                <h3 className="mt-10 text-[15px] font-semibold uppercase tracking-[0.14em]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">{s.body}</p>
                <div className="receipt mt-8 hidden px-4 sm:block pt-4 text-[12px] uppercase tracking-[0.14em] transition-transform duration-500 group-hover:translate-y-1">
                  {s.lines.map((l) => (
                    <div key={l} className="flex justify-between py-0.5">
                      <span>{l}</span>
                      <span className="opacity-50">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

    </main>
  );
}
