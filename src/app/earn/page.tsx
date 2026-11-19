import type { Metadata } from "next";
import { FractionMeter } from "@/components/FractionMeter";
import { EarnPrinter } from "@/components/EarnPrinter";
import { NextPage } from "@/components/NextPage";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Earn",
  description: `How ${SITE.standard} turns ${SITE.ticker} into machines, and how machines get paid.`,
};

export default function EarnPage() {
  return (
    <main className="grid-bg">
      <section id="meter" className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-24 sm:pt-36">
        <SectionHead
          as="h1"
          n="01"
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
      </section>

      <section id="earn" className="border-y border-[var(--line)] bg-ink/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24">
          <SectionHead
            n="02"
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

      <div className="pt-16" />
      <NextPage href="/shift" label="Room C" title="Clock a shift" />
    </main>
  );
}
