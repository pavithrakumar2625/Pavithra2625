import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const COUNTERS = [
  { table: "projects", label: "Projects", to: "/admin/projects" },
  { table: "experiences", label: "Experience", to: "/admin/experience" },
  { table: "education", label: "Education", to: "/admin/education" },
  { table: "certifications", label: "Certifications", to: "/admin/certifications" },
  { table: "achievements", label: "Achievements", to: "/admin/achievements" },
  { table: "skills", label: "Skills", to: "/admin/skills" },
] as const;

function Dashboard() {
  const counts = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        COUNTERS.map(async (counter) => {
          const { count } = await supabase
            .from(counter.table as never)
            .select("*", { count: "exact", head: true });
          return [counter.table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  const messages = useQuery({
    queryKey: ["admin", "recent-messages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return (data ?? []) as {
        id: string;
        name: string;
        subject: string;
        is_read: boolean;
        created_at: string;
      }[];
    },
  });

  const projects = useQuery({
    queryKey: ["admin", "recent-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,period,is_published")
        .order("sort_order", { ascending: true });
      return (data ?? []) as { id: string; title: string; period: string; is_published: boolean }[];
    },
  });

  return (
    <div>
      <header>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage every section of the public portfolio from here.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTERS.map((counter) => (
          <Link
            key={counter.table}
            to={counter.to}
            className="surface-panel lift-on-hover block p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {counter.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {counts.data?.[counter.table] ?? "—"}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="surface-panel p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="font-display text-lg font-semibold">Projects</h2>
            <Button asChild size="sm" variant="outline" className="shrink-0 rounded-xl">
              <Link to="/admin/projects">
                Manage <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ul className="mt-5 space-y-3">
            {projects.data?.map((project) => (
              <li key={project.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.period}</p>
                </div>
                <Badge
                  variant={project.is_published ? "secondary" : "outline"}
                  className="shrink-0 rounded-md font-normal"
                >
                  {project.is_published ? "Published" : "Draft"}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-panel p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="font-display text-lg font-semibold">Recent messages</h2>
            <Button asChild size="sm" variant="outline" className="shrink-0 rounded-xl">
              <Link to="/admin/messages">
                Inbox <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          {messages.data?.length ? (
            <ul className="mt-5 space-y-3">
              {messages.data.map((message) => (
                <li key={message.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{message.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {message.subject || "No subject"}
                    </p>
                  </div>
                  {!message.is_read ? (
                    <Badge className="shrink-0 rounded-md font-normal">New</Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">No messages yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
