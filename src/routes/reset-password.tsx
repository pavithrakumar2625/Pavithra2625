import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — Pavithra K Portfolio" },
      {
        name: "description",
        content: "Set a new password for the portfolio owner account.",
      },
      { property: "og:title", content: "Reset password — Pavithra K Portfolio" },
      { property: "og:description", content: "Set a new password for the portfolio owner account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async () => {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/admin" });
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
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Set a new password</h1>

          {ready ? (
            <>
              <div className="mt-7 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              </div>
              <Button className="mt-6 w-full rounded-xl" size="lg" onClick={submit} disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Update password
              </Button>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Open this page from the reset link sent to the owner email address. The link is what
              authorises the change.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
