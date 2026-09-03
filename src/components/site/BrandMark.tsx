import { cn } from "@/lib/utils";
import pkLogoAsset from "@/assets/pk-logo.png.asset.json";

/**
 * Personal brand mark for Pavithra K — luxury PK monogram.
 * Rendered as a small rounded tile so the deep-navy logo background
 * reads as an intentional app-icon chip in both light and dark themes.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={pkLogoAsset.url}
      alt="Pavithra K brand mark"
      width={1024}
      height={1024}
      className={cn("rounded-lg object-cover shadow-sm ring-1 ring-border/60", className)}
    />
  );
}
