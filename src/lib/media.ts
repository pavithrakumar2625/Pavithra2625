import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "portfolio-media";

const cache = new Map<string, string>();
const STORE_KEY = "pf-media-urls";
const TTL_MS = 6 * 24 * 60 * 60 * 1000; // refresh before the 7-day signature expires

type StoredEntry = { url: string; at: number };

function readStore(): Record<string, StoredEntry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, StoredEntry>;
  } catch {
    return {};
  }
}

function writeStore(ref: string, url: string) {
  if (typeof window === "undefined") return;
  try {
    const store = readStore();
    store[ref] = { url, at: Date.now() };
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable — in-memory cache still applies */
  }
}

/** Returns an already-known URL synchronously so images can paint on first render. */
export function getCachedMediaUrl(ref?: string | null): string | null {
  if (!ref) return null;
  if (/^https?:\/\//.test(ref) || ref.startsWith("data:") || ref.startsWith("/")) return ref;
  const inMemory = cache.get(ref);
  if (inMemory) return inMemory;
  const entry = readStore()[ref];
  if (entry && Date.now() - entry.at < TTL_MS) {
    cache.set(ref, entry.url);
    return entry.url;
  }
  return null;
}

/**
 * Resolves a stored media reference to a usable URL.
 * Absolute URLs pass through; storage paths get a long-lived signed URL.
 */
export async function resolveMediaUrl(ref?: string | null): Promise<string | null> {
  if (!ref) return null;
  // Absolute URLs, data URIs and site-relative public assets are already usable.
  if (/^https?:\/\//.test(ref) || ref.startsWith("data:") || ref.startsWith("/")) return ref;
  const cached = getCachedMediaUrl(ref);
  if (cached) return cached;
  const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(ref, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  cache.set(ref, data.signedUrl);
  writeStore(ref, data.signedUrl);
  return data.signedUrl;
}

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}
