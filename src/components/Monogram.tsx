/** The Z monogram: two horizontals and a diagonal inside a construction circle. */
export const Z_PATH = "M14 18 H86 L22 82 H86";

export function Monogram({ size = 28, stroke = 9, className = "" }: { size?: number; stroke?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <path d={Z_PATH} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" strokeLinejoin="miter" />
      <circle cx="86" cy="18" r="6.5" fill="var(--signal)" />
    </svg>
  );
}
