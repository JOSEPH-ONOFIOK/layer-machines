import type { Metadata } from "next";
import { NextPage } from "@/components/NextPage";
import { SectionHead } from "@/components/SectionHead";
import { ShiftBoard } from "@/components/ShiftBoard";

export const metadata: Metadata = {
  title: "Shift board",
  description: "Six work orders. Punch your time card. Print a numbered operator pass.",
};

export default function ShiftPage() {
  return (
    <main className="grid-bg">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
        <SectionHead
          as="h1"
          n="01"
          kicker="Shift board"
          title={
            <>
              Clock a full
              <br />
              shift.
            </>
          }
          sub="Six work orders before the floor opens. Each one punches your time card. Log every hour and you print a numbered operator pass."
        />
        <ShiftBoard />
      </section>
      <NextPage href="/faq" label="Room D" title="Questions" />
    </main>
  );
}
