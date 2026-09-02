import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/site/SmartImage";
import { SmartVideo } from "@/components/site/SmartVideo";
import { projectMediaQuery, projectQuery } from "@/lib/portfolio";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Case study | Pavithra K` },
        {
          name: "description",
          content: `Detailed case study of the ${title} project by Pavithra K: problem, technical solution, implementation and outcome.`,
        },
        { property: "og:title", content: `${title} — Case study | Pavithra K` },
        {
          property: "og:description",
          content: `Problem, solution, implementation and results for the ${title} project.`,
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const project = useQuery(projectQuery(slug));
  const media = useQuery(projectMediaQuery(project.data?.id));

  if (project.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-sm text-muted-foreground">Loading case study…</p>
      </main>
    );
  }

  if (!project.data) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">Case study not found</h1>
          <Button asChild variant="outline" className="mt-6 rounded-xl">
            <Link to="/">Back to portfolio</Link>
          </Button>
        </div>
      </main>
    );
  }

  const p = project.data;
  const blocks = [
    { title: "The problem", body: p.problem },
    { title: "The solution", body: p.solution },
    { title: "Implementation", body: p.implementation },
    { title: "Outcome", body: p.outcome },
  ].filter((b) => b.body);

  return (
    <main className="hero-glow min-h-screen pb-24">
      <div className="mx-auto w-full max-w-5xl px-5 pt-12 sm:px-8 sm:pt-16">
        <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-xl">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to portfolio
          </Link>
        </Button>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary">{p.category}</span>
            <span>·</span>
            <span>{p.period}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {p.full_description || p.short_description}
          </p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {p.tech_stack.map((tech) => (
              <Badge key={tech} variant="outline" className="rounded-md font-normal">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.demo_url ? (
              <Button asChild className="rounded-xl">
                <a href={p.demo_url} target="_blank" rel="noreferrer noopener">
                  Live demo <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : null}
            {p.github_url ? (
              <Button asChild variant="outline" className="rounded-xl">
                <a href={p.github_url} target="_blank" rel="noreferrer noopener">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </a>
              </Button>
            ) : null}
          </div>
        </header>

        {p.cover_url ? (
          <div className="surface-panel mt-12 overflow-hidden p-0">
            <SmartImage src={p.cover_url} alt={p.title} className="w-full object-cover" />
          </div>
        ) : null}

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <div className="space-y-10">
            {blocks.map((block) => (
              <section key={block.title}>
                <h2 className="font-display text-xl font-semibold">{block.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{block.body}</p>
              </section>
            ))}
          </div>

          {p.features.length ? (
            <aside className="surface-panel p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-base font-semibold">Key features</h2>
              <ul className="mt-4 space-y-3">
                {p.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>

        {media.data?.length ? (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold">Project gallery</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {media.data.map((item) => (
                <figure key={item.id} className="surface-panel overflow-hidden">
                  {isVideoMedia(item) ? (
                    <SmartVideo
                      src={item.url}
                      className="aspect-[16/10] w-full bg-black object-cover"
                    />
                  ) : (
                    <SmartImage
                      src={item.url}
                      alt={item.caption || p.title}
                      className="aspect-[16/10] w-full object-cover"
                      fallback={
                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                          Media unavailable
                        </div>
                      }
                    />
                  )}
                  {item.caption ? (
                    <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function isVideoMedia(item: { url: string; media_type?: string }) {
  return (
    item.media_type === "video" || /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(item.url)
  );
}
