import { useMutation } from "@tanstack/react-query";
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/portfolio";

const ICONS: Record<string, typeof Mail> = { LinkedIn: Linkedin, GitHub: Github, Email: Mail };

export function Contact({
  profile,
  links,
}: {
  profile: Profile;
  links: { id: string; platform: string; url: string }[];
}) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        body: form.body.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message sent", { description: "Thank you — I'll reply as soon as possible." });
      setForm({ name: "", email: "", subject: "", body: "" });
    },
    onError: () => toast.error("Could not send your message. Please try again."),
  });

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={profile.contact_heading || "Let's build something with data"}
      description={
        profile.contact_description ||
        "Open to data science, machine learning and analytics roles, internships and collaborations."
      }
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel space-y-5 p-6">
          {[
            { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
            { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
            { icon: MapPin, label: "Location", value: profile.location, href: undefined },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                {item.href ? (
                  <a href={item.href} className="break-words text-sm font-medium hover:text-primary">
                    {item.value}
                  </a>
                ) : (
                  <p className="break-words text-sm font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          {profile.contact_note ? (
            <p className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              {profile.contact_note}
            </p>
          ) : null}

          <div className="flex gap-2 pt-2">
            {links.map((link) => {
              const Icon = ICONS[link.platform] ?? Mail;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.platform}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <form
          className="surface-panel space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!form.name || !form.email || !form.body) {
              toast.error("Name, email and message are required.");
              return;
            }
            mutation.mutate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Input
              id="contact-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-body">Message</Label>
            <Textarea
              id="contact-body"
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl" disabled={mutation.isPending}>
            <Send className="mr-2 h-4 w-4" />
            {mutation.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </Section>
  );
}
