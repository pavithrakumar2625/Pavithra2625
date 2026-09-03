import { cn } from "@/lib/utils";

/**
 * Personal brand mark for Pavithra K — luxury PK monogram.
 * Rendered as a small rounded tile so the deep-navy logo background
 * reads as an intentional app-icon chip in both light and dark themes.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/pk-logo.png"
      alt="Pavithra K brand mark"
      width={256}
      height={256}
      loading="eager"
      decoding="sync"
      className={cn("rounded-lg object-cover shadow-sm ring-1 ring-border/60", className)}
    />
  );
}
