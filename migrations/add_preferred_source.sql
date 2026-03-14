ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_source text null;
