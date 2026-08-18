import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  alt,
  className,
  fallback,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    resolveMediaUrl(src).then((value) => {
      if (active) setUrl(value);
    });
    return () => {
      active = false;
    };
  }, [src]);

  if (!url) return <>{fallback ?? null}</>;
  return <img src={url} alt={alt} loading="lazy" className={cn(className)} />;
}
