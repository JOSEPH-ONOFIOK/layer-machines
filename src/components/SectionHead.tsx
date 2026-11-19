import { Reveal } from "./Reveal";

export function SectionHead({
  n,
  kicker,
  title,
  sub,
  as: H = "h2",
}: {
  n: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className="mb-12 max-w-3xl sm:mb-16">
      <div className="kicker flex items-center gap-3">
        <span className="text-bone">[{n}]</span>
        <span className="h-px w-8 bg-[var(--line-2)]" />
        {kicker}
      </div>
      <H className="mt-5 font-serif text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.95]">
        {title}
      </H>
      {sub && <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-mute">{sub}</p>}
    </Reveal>
  );
}
