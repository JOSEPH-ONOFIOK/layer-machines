import { Reveal } from "./Reveal";

export function SectionHead({
  kicker,
  title,
  sub,
  as: H = "h2",
}: {
  /** Kept for call-site compatibility; no longer rendered. */
  n?: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className="mb-8 max-w-3xl sm:mb-16">
      <div className="kicker flex items-center gap-3">
        <span className="h-px w-8 bg-bone/60" />
        {kicker}
      </div>
      <H className="mt-4 font-serif text-[clamp(2.2rem,5.5vw,4rem)] uppercase leading-[0.95]">
        {title}
      </H>
      {sub && <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-mute">{sub}</p>}
    </Reveal>
  );
}
