CREATE TABLE public.admin_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempted_email text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'denied',
  user_agent text,
  ip_address text,
  alert_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_login_attempts TO authenticated;
GRANT ALL ON public.admin_login_attempts TO service_role;

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view login attempts"
ON public.admin_login_attempts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'owner'::public.app_role));

CREATE INDEX admin_login_attempts_created_at_idx ON public.admin_login_attempts (created_at DESC);

CREATE TRIGGER set_updated_at_admin_login_attempts
BEFORE UPDATE ON public.admin_login_attempts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();