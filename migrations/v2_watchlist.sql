-- ============================================================================
-- Watchlist v2 Migrations: Individual Watchlists + Discover Page
-- ============================================================================

-- 1. Add visibility to media
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'shared' CHECK (visibility IN ('shared', 'juainny', 'erick'));

-- 2. Add default_visibility to settings
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS default_visibility text DEFAULT 'shared' CHECK (default_visibility IN ('shared', 'juainny', 'erick'));

-- 3. Create kino_sessions table for watchparties
CREATE TABLE IF NOT EXISTS public.kino_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text,
    imdb_id text,
    poster_url text,
    stream_url text,
    created_by text,
    active boolean DEFAULT true,
    participants text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Note: user_id on episode_progress should already be present according to specs,
-- so we'll just query it that way.
