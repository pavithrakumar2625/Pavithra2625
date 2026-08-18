import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { claimOwnerIfUnclaimed, useSession } from "@/lib/auth";

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

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await claimOwnerIfUnclaimed();
    navigate({ to: "/admin" });
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await claimOwnerIfUnclaimed();
    toast.success("Account created", {
      description: "If email confirmation is on, confirm your address before signing in.",
    });
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
            Private access for the portfolio owner. Visitors do not need an account.
          </p>

          <Tabs defaultValue="signin" className="mt-7">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="signin" className="rounded-lg">
                Sign in
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">
                Create owner account
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="signin" className="mt-6">
              <Button className="w-full rounded-xl" size="lg" onClick={signIn} disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Sign in
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="mt-6 space-y-3">
              <Button className="w-full rounded-xl" size="lg" onClick={signUp} disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create owner account
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Only the first account created becomes the portfolio owner. Any later account has no
                administrative access.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
