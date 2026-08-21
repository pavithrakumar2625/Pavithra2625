import { cn } from "@/lib/utils";

/**
 * Personal brand mark for Pavithra K.
 * Geometric hybrid: the bowl + stem of a "P" whose lower stem branches into the
 * diagonal legs of a "K", punctuated with data nodes for a subtle AI/data cue.
 * Uses currentColor so it adapts to dark/light themes.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Pavithra K brand mark"
      className={cn("text-primary", className)}
      fill="none"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* stem */}
        <path d="M9 4.5V27.5" />
        {/* P bowl */}
        <path d="M9 4.5h7.5a5.75 5.75 0 0 1 0 11.5H9" />
        {/* K leg */}
        <path d="M9 19.5 22 27.5" opacity="0.9" />
      </g>
      <g fill="currentColor">
        <circle cx="9" cy="4.5" r="2.6" />
        <circle cx="22" cy="27.5" r="2.6" />
        <circle cx="9" cy="19.5" r="1.7" opacity="0.75" />
      </g>
    </svg>
  );
}
