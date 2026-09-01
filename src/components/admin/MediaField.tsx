import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartImage } from "@/components/site/SmartImage";
import { uploadMedia } from "@/lib/media";

export function MediaField({
  value,
  onChange,
  folder,
  accept = "image/*",
  preview = true,
  onUploaded,
}: {
  value: string;
  onChange: (value: string) => void;
  folder: string;
  accept?: string;
  preview?: boolean;
  onUploaded?: (path: string, file: File) => void;
}) {
  const [busy, setBusy] = useState<"image" | "video" | null>(null);
  const acceptsVideo = accept.includes("video");

  const handleFile = async (file: File, input: HTMLInputElement) => {
    setBusy(file.type.startsWith("video/") ? "video" : "image");
    try {
      const path = await uploadMedia(file, folder);
      onChange(path);
      onUploaded?.(path, file);
      toast.success("File uploaded");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(null);
      input.value = "";
    }
  };

  const uploadButton = (kind: "image" | "video") => (
    <Button asChild type="button" variant="outline" className="shrink-0 rounded-xl">
      <label className="cursor-pointer">
        {busy === kind ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {kind === "video" ? "Upload video" : acceptsVideo ? "Upload image" : "Upload"}
        <input
          type="file"
          accept={kind === "video" ? "video/*" : "image/*"}
          className="hidden"
          disabled={busy !== null}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file, event.target);
          }}
        />
      </label>
    </Button>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          placeholder="Upload a file or paste a URL"
          onChange={(e) => onChange(e.target.value)}
        />
        {uploadButton("image")}
        {acceptsVideo ? uploadButton("video") : null}
      </div>
      {preview && value ? (
        /\.(mp4|webm|mov|m4v)$/i.test(value) ? (
          <video
            src={value.startsWith("http") || value.startsWith("/") ? value : undefined}
            controls
            className="h-36 w-auto max-w-full rounded-xl border border-border"
          >
            <track kind="captions" />
          </video>
        ) : (
          <SmartImage
            src={value}
            alt="Preview"
            className="h-28 w-auto rounded-xl border border-border object-cover"
          />
        )
      ) : null}
    </div>
  );
}
