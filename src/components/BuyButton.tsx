import { SITE } from "@/lib/site";

export function BuyButton({
  className = "",
  label = `Buy ${SITE.ticker}`,
}: {
  className?: string;
  label?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 border px-5 py-3 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors";
  if (!SITE.buyUrl) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed border-[var(--line-2)] text-mute ${className}`}
        title="Trading opens at launch"
      >
        {label}
        <span className="text-[10px] tracking-[0.2em] text-bone/60">· Soon</span>
      </span>
    );
  }
  return (
    <a
      href={SITE.buyUrl}
      target="_blank"
      rel="noreferrer"
      className={`${base} border-bone bg-bone text-ink hover:bg-transparent hover:text-bone ${className}`}
    >
      {label} <span aria-hidden>›</span>
    </a>
  );
}
