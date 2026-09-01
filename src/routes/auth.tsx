import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { reportAdminLoginAttempt } from "@/lib/security.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner sign in — Pavithra K Portfolio" },
      {
        name: "description",
        content: "Private sign-in for the portfolio owner to manage content in the admin dashboard.",
      },
      { property: "og:title", content: "Owner sign in — Pavithra K Portfolio" },
      { property: "og:description", content: "Private administration access for the portfolio owner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot">("signin");

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      // Fire-and-forget: server logs the denied attempt and alerts the owner.
      void reportAdminLoginAttempt({ data: { attemptedEmail: email } }).catch(() => {});
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  const sendReset = async () => {
    if (!email) {
      toast.error("Enter the owner email address first.");
      return;
    }
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    toast.success("Reset link sent", {
      description: "If this address belongs to the owner account, a reset link is on its way.",
    });
    setMode("signin");
  };

  return (
    <main className="hero-glow grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 rounded-xl">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to portfolio
          </Link>
        </Button>

        <div className="surface-panel p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Portfolio administration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Private access for the portfolio owner. Visitors do not need an account — the portfolio is
            fully public.
          </p>

          <div className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Owner email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode === "signin" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void signIn();
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 space-y-3">
            {mode === "signin" ? (
              <>
                <Button className="w-full rounded-xl" size="lg" onClick={signIn} disabled={busy}>
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Sign in
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                <Button className="w-full rounded-xl" size="lg" onClick={sendReset} disabled={busy}>
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Send reset link
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  onClick={() => setMode("signin")}
                >
                  Back to sign in
                </button>
              </>
            )}
            <p className="text-xs leading-relaxed text-muted-foreground">
              Registration is closed. Administrative access is permanently limited to the single owner
              account and is enforced by the database, not the interface.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
