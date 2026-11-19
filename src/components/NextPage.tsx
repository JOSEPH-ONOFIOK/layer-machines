import Link from "next/link";

/** Bottom-of-page handoff so every page leads somewhere. */
export function NextPage({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Link
      href={href}
      className="group mx-auto mb-16 flex max-w-7xl items-center justify-between gap-6 border-y border-[var(--line-2)] px-4 py-8 transition-colors hover:bg-ink-2 sm:px-6"
    >
      <div>
        <div className="kicker">Next · {label}</div>
        <div className="mt-2 font-serif text-[clamp(1.8rem,4vw,3rem)] uppercase leading-none">
          {title}
        </div>
      </div>
      <span className="text-3xl text-mute transition-transform duration-300 group-hover:translate-x-2 group-hover:text-bone">
        →
      </span>
    </Link>
  );
}
