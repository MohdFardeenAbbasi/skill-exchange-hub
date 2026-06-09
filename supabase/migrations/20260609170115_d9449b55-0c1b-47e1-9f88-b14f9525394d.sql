
-- Replace public-readable policy with authenticated-only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure anon cannot read profiles at all
REVOKE SELECT ON public.profiles FROM anon;

-- Column-level: hide email column from general authenticated reads
REVOKE SELECT (email) ON public.profiles FROM authenticated, anon;

-- Owner can still update/select their own row through the helper below.
-- Service role retains full access for admin tasks via edge functions.
GRANT SELECT (email) ON public.profiles TO service_role;

-- Helper: return a user's email only if caller is that user OR an admin.
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email
  FROM public.profiles
  WHERE user_id = _user_id
    AND (auth.uid() = _user_id OR public.has_role(auth.uid(), 'admin'));
$$;

REVOKE ALL ON FUNCTION public.get_user_email(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;
