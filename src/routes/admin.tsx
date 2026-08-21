import { BrandMark } from "@/components/site/BrandMark";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MoonStar,
  Sun,
  Trophy,
  UserRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Pavithra K Portfolio" },
      { name: "description", content: "Private content management dashboard for the portfolio owner." },
      { property: "og:title", content: "Admin dashboard — Pavithra K Portfolio" },
      { property: "og:description", content: "Manage portfolio content, media and messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/skills", label: "Skills", icon: Wrench },
  { to: "/admin/profile", label: "Profile & resume", icon: UserRound },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

function AdminLayout() {
  const { session, loading } = useSession();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(session?.user.id);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  if (loading || (session && roleLoading)) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  if (!session) {
    return <AccessCard title="Sign in required" body="Please sign in with the portfolio owner account." />;
  }

  if (!isAdmin) {
    return (
      <AccessCard
        title="Not authorised"
        body="This account does not have administrative access to the portfolio."
        showSignOut
      />
    );
  }

  const sidebar = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to as never}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-sidebar-border bg-sidebar p-4 lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-2">
          <BrandMark className="h-9 w-9" />
          <span className="font-display text-sm font-semibold">Admin panel</span>
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">{sidebar}</div>
        <SignOutButton onDone={() => navigate({ to: "/auth" })} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/90 px-5 py-3 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl lg:hidden"
              aria-label="Toggle admin navigation"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="truncate text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Toggle theme" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link to="/">View site</Link>
            </Button>
          </div>
        </header>

        {open ? (
          <div className="border-b border-border bg-sidebar p-4 lg:hidden">
            {sidebar}
            <div className="mt-3">
              <SignOutButton onDone={() => navigate({ to: "/auth" })} />
            </div>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SignOutButton({ onDone }: { onDone: () => void }) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start rounded-xl text-muted-foreground"
      onClick={async () => {
        await supabase.auth.signOut();
        onDone();
      }}
    >
      <LogOut className="mr-3 h-4 w-4" /> Log out
    </Button>
  );
}

function AccessCard({
  title,
  body,
  showSignOut,
}: {
  title: string;
  body: string;
  showSignOut?: boolean;
}) {
  return (
    <main className="hero-glow grid min-h-screen place-items-center px-5">
      <div className="surface-panel max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-xl">
            <Link to="/auth">Go to sign in</Link>
          </Button>
          {showSignOut ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
