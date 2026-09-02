import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function SmartVideo({
  src,
  className,
  poster,
}: {
  src?: string | null;
  className?: string;
  poster?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    resolveMediaUrl(src).then((value) => {
      if (active) setUrl(value);
    });
    return () => {
      active = false;
    };
  }, [src]);

  if (!url) {
    return <div className={cn("animate-pulse bg-muted", className)} />;
  }

  return (
    <video
      src={url}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={cn(className)}
    >
      <track kind="captions" />
    </video>
  );
}
