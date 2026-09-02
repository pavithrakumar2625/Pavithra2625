import { ArrowUpRight, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/site/SmartImage";
import type { Profile } from "@/lib/portfolio";

const ICONS: Record<string, typeof Mail> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Email: Mail,
};

export function Hero({
  profile,
  links,
  resumeUrl,
}: {
  profile: Profile;
  links: { id: string; platform: string; url: string }[];
  resumeUrl: string | null;
}) {

  return (
    <section id="home" className="hero-glow relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Open to Data Science &amp; AI roles — 2026
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl">
            {profile.full_name.split(" ")[0]}{" "}
            <span className="text-gradient">{profile.full_name.split(" ").slice(1).join(" ")}</span>
          </h1>

          <p className="mt-4 font-display text-lg font-medium text-foreground/90 sm:text-xl">
            {profile.headline}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {resumeUrl ? (
              <Button asChild size="lg" className="rounded-xl">
                <a href={resumeUrl} target="_blank" rel="noreferrer noopener">
                  <Download className="mr-2 h-4 w-4" /> Download resume
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <a href="#contact">
                Contact me <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-7 flex items-center gap-2">
            {links.map((link) => {
              const Icon = ICONS[link.platform] ?? ArrowUpRight;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.platform}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md">
          {/* AI-inspired atmosphere behind the portrait only */}
          <div
            className="absolute -inset-10 -z-10 rounded-full bg-primary/30 blur-[90px]"
            aria-hidden
          />
          <div
            className="absolute -top-10 -right-8 -z-10 h-48 w-48 rounded-full bg-chart-2/25 blur-[70px]"
            aria-hidden
          />
          <div
            className="absolute inset-x-8 -bottom-6 -z-10 h-28 rounded-full bg-[var(--gradient-accent)] opacity-30 blur-3xl"
            aria-hidden
          />
          <div className="hero-portrait relative aspect-[4/5]">
            <SmartImage
              src={profile.avatar_url}
              alt={`Portrait of ${profile.full_name}`}
              className="hero-portrait-img h-full w-full object-cover"
              fallback={
                <div className="grid h-full w-full place-items-center">
                  <span className="font-display text-6xl font-bold text-gradient">
                    {profile.full_name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </div>
              }
            />
          </div>
        </div>

      </div>

    </section>
  );
}
