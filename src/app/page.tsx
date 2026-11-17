import Image from "next/image";
import { Nav } from "@/components/Nav";
import { HeroStage } from "@/components/HeroStage";
import { FractionMeter } from "@/components/FractionMeter";
import { Lineup } from "@/components/Lineup";
import { EarnPrinter } from "@/components/EarnPrinter";
import { BuyButton } from "@/components/BuyButton";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { FAQ, SITE, STEPS, SUPPLY_TEXT } from "@/lib/site";

function SectionHead({
  n,
  kicker,
  title,
  sub,
}: {
  n: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-3xl sm:mb-16">
      <div className="kicker flex items-center gap-3">
        <span className="text-bone">[{n}]</span>
        <span className="h-px w-8 bg-[var(--line-2)]" />
        {kicker}
      </div>
      <h2 className="mt-5 font-serif text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.95]">
        {title}
      </h2>
      {sub && <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-mute">{sub}</p>}
    </Reveal>
  );
}

const TICKER = [
  `${SUPPLY_TEXT} machines`,
  `1 ${SITE.ticker} = 1 machine`,
  "Fractions complete on your next buy",
  "Own › Rent › Earn",
  `${SITE.standard} on ${SITE.chain}`,
  "Every buy prints a receipt",
];

export default function Home() {
  const links = [
    ["X", SITE.x],
    ["Telegram", SITE.telegram],
    ["Docs", SITE.docsUrl],
  ] as const;

  return (
    <>
      <Nav />
      <main id="top" className="grid-bg">
        {/* HERO */}
        <section className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-20">
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
            <div className="mt-8 h-[2px] w-16 bg-bone" />
            <p className="mt-8 text-[15px] font-semibold uppercase tracking-[0.32em]">
              Own <span className="text-mute">›</span> Rent{" "}
              <span className="text-mute">›</span> Earn
            </p>
            <p className="mt-6 max-w-md text-[14px] leading-relaxed text-mute">
              Hold a whole {SITE.ticker} and a machine boots up in your wallet.
              Rent it out or keep it running. Every buy pays the machines.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <BuyButton />
              <a
                href="#meter"
                className="inline-flex items-center gap-2 border border-[var(--line-2)] px-5 py-3 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-bone"
              >
                How 404 works
              </a>
            </div>
          </div>
          <HeroStage />
        </section>

        <div className="meander" />

        {/* TICKER */}
        <div className="overflow-hidden border-b border-[var(--line)] bg-ink py-4">
          <div className="marquee-track flex">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
                {TICKER.map((t) => (
                  <span
                    key={t}
                    className="flex items-center whitespace-nowrap px-8 text-[12px] uppercase tracking-[0.22em] text-mute"
                  >
                    <span className="mr-8 text-bone">✦</span>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* HOW */}
        <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
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
                    <span className="text-[12px] tracking-[0.2em] text-mute">
                      [{s.n}]
                    </span>
                    <span className="font-serif text-3xl uppercase">{s.verb}</span>
                  </div>
                  <h3 className="mt-10 text-[15px] font-semibold uppercase tracking-[0.14em]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-mute">{s.body}</p>
                  <div className="receipt mt-8 px-4 pt-4 text-[11px] uppercase tracking-[0.14em] transition-transform duration-500 group-hover:translate-y-1">
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

        {/* METER */}
        <section
          id="meter"
          className="scroll-mt-20 border-y border-[var(--line)] bg-ink/70"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
            <SectionHead
              n="02"
              kicker="The 404 meter"
              title={
                <>
                  Tokens in.
                  <br />
                  Machines out.
                </>
              }
              sub={`Drag your balance. Every whole ${SITE.ticker} is a machine in your wallet, and fractions wait as a frame until you top them up.`}
            />
            <Reveal>
              <FractionMeter />
            </Reveal>
          </div>
        </section>

        {/* LINEUP */}
        <section id="lineup" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
          <SectionHead
            n="03"
            kicker="The lineup"
            title={
              <>
                Every desk
                <br />
                is different.
              </>
            }
            sub="Shells, screens and desk extras are drawn per machine. Here are six to meet before the rest roll off the line."
          />
          <Reveal>
            <Lineup />
          </Reveal>
        </section>

        {/* EARN */}
        <section id="earn" className="scroll-mt-20 border-y border-[var(--line)] bg-ink/70">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
            <SectionHead
              n="04"
              kicker="Earn"
              title={
                <>
                  Every buy
                  <br />
                  prints a receipt.
                </>
              }
              sub="A cut of each buy goes to the machines that are switched on. Move the sliders and print yourself a slip."
            />
            <Reveal>
              <EarnPrinter />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
          <SectionHead n="05" kicker="FAQ" title="Questions." />
          <div className="border-t border-[var(--line-2)]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[var(--line-2)]">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[14px] uppercase tracking-[0.12em] transition-colors hover:text-bone/80">
                  {f.q}
                  <span className="faq-plus text-xl text-mute transition-transform duration-300">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-[14px] leading-relaxed text-mute">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-[var(--line)]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
            <div className="relative overflow-hidden border border-[var(--line-2)]">
              <Image
                src="/art/banner.jpg"
                alt="Layer Machines banner: four machines on a stepped platform"
                width={1280}
                height={426}
                className="h-auto w-full"
              />
            </div>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="font-serif text-[clamp(2rem,5vw,3.4rem)] uppercase leading-none">
                Clock in.
              </p>
              <BuyButton />
            </div>
          </div>
        </section>
      </main>

      <div className="meander" />
      <footer className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-[11px] uppercase tracking-[0.18em] text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-5 w-auto text-bone" />
            <span>
              Layer Machines · {SUPPLY_TEXT} machines on {SITE.chain}
            </span>
          </div>
          <div className="flex gap-6">
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
