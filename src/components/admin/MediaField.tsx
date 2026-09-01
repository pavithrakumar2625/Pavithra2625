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
}: {
  value: string;
  onChange: (value: string) => void;
  folder: string;
  accept?: string;
  preview?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          placeholder="Upload a file or paste a URL"
          onChange={(e) => onChange(e.target.value)}
        />
        <Button asChild type="button" variant="outline" className="shrink-0 rounded-xl">
          <label className="cursor-pointer">
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  const path = await uploadMedia(file, folder);
                  onChange(path);
                  toast.success("File uploaded");
                } catch (error) {
                  toast.error((error as Error).message);
                } finally {
                  setBusy(false);
                  event.target.value = "";
                }
              }}
            />
          </label>
        </Button>
      </div>
      {preview && value ? (
        /\.(mp4|webm|mov|m4v)$/i.test(value) ? (
          <p className="text-xs text-muted-foreground">Video file selected: {value}</p>
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
