-- Add unique constraint on subdomain to prevent duplicates
ALTER TABLE public.subdomain_requests 
ADD CONSTRAINT subdomain_requests_subdomain_unique UNIQUE (subdomain);