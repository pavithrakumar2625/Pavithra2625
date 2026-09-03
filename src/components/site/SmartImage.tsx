import { useEffect, useState } from "react";
import { getCachedMediaUrl, resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  alt,
  className,
  fallback,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  /** Load immediately with high fetch priority (use for above-the-fold images). */
  priority?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(() => getCachedMediaUrl(src));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setFailed(false);
    const cached = getCachedMediaUrl(src);
    setUrl(cached);
    if (cached) return;
    resolveMediaUrl(src).then((value) => {
      if (active) setUrl(value);
    });
    return () => {
      active = false;
    };
  }, [src]);

  if (!url || failed) return <>{fallback ?? null}</>;
  return (
    <img
      src={url}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={cn(className)}
    />
  );
}
