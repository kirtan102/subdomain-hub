-- Create a function to check subdomain availability (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_subdomain_available(subdomain_to_check text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.subdomain_requests
    WHERE subdomain = subdomain_to_check
  )
$$;