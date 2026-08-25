import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/admin/MediaField";
import { CrudManager } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/portfolio";

export const Route = createFileRoute("/admin/profile")({
  component: ProfileAdmin,
});

const TEXT_FIELDS: { name: keyof Profile; label: string; area?: boolean }[] = [
  { name: "full_name", label: "Full name" },
  { name: "headline", label: "Headline" },
  { name: "tagline", label: "Tagline", area: true },
  { name: "about", label: "About", area: true },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "location", label: "Location" },
  { name: "contact_heading", label: "Contact — heading" },
  { name: "contact_note", label: "Contact — availability note" },
  { name: "contact_description", label: "Contact — description", area: true },
  { name: "stat_projects", label: "Stat — projects" },
  { name: "stat_internships", label: "Stat — internships" },
  { name: "stat_cgpa", label: "Stat — CGPA" },
  { name: "stat_certifications", label: "Stat — certifications" },
];

function ProfileAdmin() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Partial<Profile> | null>(null);

  const profile = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Profile | null;
    },
  });

  const values = { ...(profile.data ?? {}), ...(draft ?? {}) } as Partial<Profile>;
  const set = (name: string, value: string) => setDraft((d) => ({ ...(d ?? {}), [name]: value }));

  const save = useMutation({
    mutationFn: async () => {
      if (!profile.data) throw new Error("Profile record missing");
      const { id: _id, ...payload } = values as Profile;
      const { error } = await supabase.from("profile").update(payload).eq("id", profile.data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setDraft(null);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-16">
      <section>
        <header>
          <h1 className="font-display text-2xl font-semibold">Profile</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Identity, contact details and hero statistics shown across the portfolio.
          </p>
        </header>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label>Profile photo</Label>
            <MediaField
              folder="profile"
              value={values.avatar_url ?? ""}
              onChange={(next) => set("avatar_url", next)}
            />
          </div>

          {TEXT_FIELDS.map((field) => (
            <div key={field.name} className={field.area ? "space-y-2 sm:col-span-2" : "space-y-2"}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.area ? (
                <Textarea
                  id={field.name}
                  rows={field.name === "about" ? 6 : 3}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : (
                <Input
                  id={field.name}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <Button type="submit" className="rounded-xl" disabled={save.isPending}>
              {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save profile
            </Button>
          </div>
        </form>
      </section>

      <CrudManager
        table="resumes"
        folder="resumes"
        title="Résumés"
        description="Upload the downloadable résumé. The published entry is used by the download button."
        primaryField="label"
        fields={[
          { name: "label", label: "Label", type: "text", placeholder: "Resume 2026" },
          { name: "file_url", label: "File", type: "media", full: true },
          { name: "is_active", label: "Active", type: "boolean" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />

      <CrudManager
        table="social_links"
        title="Social links"
        description="Links shown in the header, hero and footer."
        primaryField="platform"
        secondaryField="url"
        fields={[
          { name: "platform", label: "Platform", type: "text" },
          { name: "url", label: "URL", type: "text" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />
    </div>
  );
}
