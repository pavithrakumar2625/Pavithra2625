import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "portfolio-media";

const cache = new Map<string, string>();

/**
 * Resolves a stored media reference to a usable URL.
 * Absolute URLs pass through; storage paths get a long-lived signed URL.
 */
export async function resolveMediaUrl(ref?: string | null): Promise<string | null> {
  if (!ref) return null;
  if (/^https?:\/\//.test(ref) || ref.startsWith("data:")) return ref;
  const cached = cache.get(ref);
  if (cached) return cached;
  const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(ref, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  cache.set(ref, data.signedUrl);
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
