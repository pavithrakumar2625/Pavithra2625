import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrudManager } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/portfolio";

export const Route = createFileRoute("/admin/contact")({
  component: ContactAdmin,
});

const CONTACT_FIELDS: { name: keyof Profile; label: string; area?: boolean }[] = [
  { name: "contact_heading", label: "Contact heading" },
  { name: "contact_note", label: "Availability note" },
  { name: "contact_description", label: "Contact description", area: true },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "location", label: "Location" },
];

function ContactAdmin() {
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
      const payload: Partial<Profile> = {};
      for (const field of CONTACT_FIELDS) {
        payload[field.name] = String(values[field.name] ?? "") as never;
      }
      const { error } = await supabase.from("profile").update(payload).eq("id", profile.data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contact details updated");
      setDraft(null);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-16">
      <section>
        <header>
          <h1 className="font-display text-2xl font-semibold">Contact</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Heading, description and contact details shown in the public Contact section.
          </p>
        </header>

        {profile.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading contact details…</p>
        ) : profile.isError ? (
          <p className="mt-8 text-sm text-destructive">Could not load contact details.</p>
        ) : (
          <form
            className="mt-8 grid gap-5 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            {CONTACT_FIELDS.map((field) => (
              <div key={field.name} className={field.area ? "space-y-2 sm:col-span-2" : "space-y-2"}>
                <Label htmlFor={`contact-${field.name}`}>{field.label}</Label>
                {field.area ? (
                  <Textarea
                    id={`contact-${field.name}`}
                    rows={3}
                    value={String(values[field.name] ?? "")}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                ) : (
                  <Input
                    id={`contact-${field.name}`}
                    value={String(values[field.name] ?? "")}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <Button type="submit" className="rounded-xl" disabled={save.isPending}>
                {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save contact details
              </Button>
            </div>
          </form>
        )}
      </section>

      <CrudManager
        table="social_links"
        title="Social links"
        description="LinkedIn, GitHub and other links shown in the contact section, header and footer."
        primaryField="platform"
        secondaryField="url"
        fields={[
          { name: "platform", label: "Platform", type: "text", placeholder: "LinkedIn" },
          { name: "url", label: "URL", type: "text" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />
    </div>
  );
}
