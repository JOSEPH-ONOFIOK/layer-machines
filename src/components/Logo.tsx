export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 56" className={className} aria-hidden="true">
      <rect x="1" y="1" width="34" height="54" rx="17" fill="currentColor" />
      <path d="M1 20h15M20 36h15" stroke="var(--ink)" strokeWidth="3" />
      <rect x="14.5" y="13" width="5.5" height="30" rx="2.75" fill="var(--ink)" />
    </svg>
  );
}
