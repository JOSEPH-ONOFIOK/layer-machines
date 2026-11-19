import type { Metadata } from "next";
import { NextPage } from "@/components/NextPage";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "ERC-404, fractions, renting and payouts: the short answers.",
};

export default function FaqPage() {
  return (
    <main className="grid-bg">
      <section className="mx-auto max-w-4xl px-4 pb-14 pt-24 sm:px-6 sm:pb-24 sm:pt-36">
        <SectionHead as="h1" n="01" kicker="FAQ" title="Questions." />
        <div className="border-t border-[var(--line-2)]">
          {FAQ.map((f, i) => (
            <details key={f.q} className="group border-b border-[var(--line-2)]" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-[14px] uppercase tracking-[0.12em] transition-colors hover:text-bone/80">
                {f.q}
                <span className="faq-plus text-xl text-mute transition-transform duration-300">+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <NextPage href="/machines" label="Back to Room A" title="Meet the machines" />
    </main>
  );
}
