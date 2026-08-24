-- 1. Single privileged role is now "owner"
ALTER TYPE public.app_role RENAME VALUE 'admin' TO 'owner';

-- 2. Remove the public privilege-escalation entrypoint
DROP FUNCTION IF EXISTS public.claim_owner();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'owner'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'owner'::public.app_role);
$$;

-- 3. Exactly one owner, and only the fixed owner email may hold it
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_single_owner
  ON public.user_roles ((role)) WHERE role = 'owner'::public.app_role;

CREATE OR REPLACE FUNCTION public.enforce_owner_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE target_email text;
BEGIN
  IF NEW.role = 'owner'::public.app_role THEN
    SELECT lower(email) INTO target_email FROM auth.users WHERE id = NEW.user_id;
    IF target_email IS DISTINCT FROM 'pavi212026@gmail.com' THEN
      RAISE EXCEPTION 'Only the designated owner account may hold the owner role';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS enforce_owner_email_trg ON public.user_roles;
CREATE TRIGGER enforce_owner_email_trg
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_owner_email();

-- 4. Ensure the designated owner holds the role, and nobody else does
DELETE FROM public.user_roles
WHERE role = 'owner'::public.app_role
  AND user_id NOT IN (SELECT id FROM auth.users WHERE lower(email) = 'pavi212026@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'owner'::public.app_role FROM auth.users WHERE lower(email) = 'pavi212026@gmail.com'
ON CONFLICT DO NOTHING;

-- 5. No client may ever write role records
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
