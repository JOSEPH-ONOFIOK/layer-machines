import type { Metadata } from "next";
import { Lineup } from "@/components/Lineup";
import { LayerStack } from "@/components/LayerStack";
import { NextPage } from "@/components/NextPage";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Machines",
  description: "Meet the lineup and see how every Layer Machine is built, layer by layer.",
};

export default function MachinesPage() {
  return (
    <main className="grid-bg">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-36">
        <SectionHead
          as="h1"
          n="01"
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

      <section id="layers" className="scroll-mt-20 border-t border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-24">
          <SectionHead
            n="02"
            kicker="Built in layers"
            title={
              <>
                It&apos;s layers
                <br />
                all the way down.
              </>
            }
            sub={`One machine, pulled apart into everything it's made of: the ${SITE.chain} chain at the bottom, you at the top.`}
          />
        </div>
        <LayerStack />
      </section>

      <NextPage href="/earn" label="Room B" title="How it pays" />
    </main>
  );
}
