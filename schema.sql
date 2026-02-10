-- ============================================================================
-- ACCOUNT SYSTEM REDESIGN SCHEMA
-- ============================================================================
-- Run this script in your Supabase SQL Editor to apply changes.
-- ============================================================================

-- 1. USERS TABLE
-- Stores user profiles. Replaces the monolithic 'settings' columns.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle TEXT UNIQUE NOT NULL, -- 'juainny', 'erick'
    display_name TEXT NOT NULL,
    email TEXT, -- For Trakt/Gravatar (optional)
    avatar_config JSONB DEFAULT '{}'::JSONB, -- Stores existing avatar settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (though for now we might leave policies open or simple)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. USER MEDIA ACTIONS
-- Stores individual interactions that shouldn't be shared.
CREATE TABLE IF NOT EXISTS public.user_media_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    media_id BIGINT REFERENCES public.media(id) ON DELETE CASCADE, -- Assuming media.id is BIGINT
    rating FLOAT, -- 0-5 or 0-10
    review TEXT,
    reaction TEXT, -- 'happy', 'sad', etc.
    watched_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ignore_trakt BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, media_id)
);

ALTER TABLE public.user_media_actions ENABLE ROW LEVEL SECURITY;

-- 3. INTEGRATIONS (Trakt)
CREATE TABLE IF NOT EXISTS public.integrations (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'trakt'
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_mode TEXT DEFAULT 'both', -- 'both', 'up_only', 'down_only', 'none'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- 4. MODIFY MEDIA TABLE (Watchlist Items)
-- Add owner_id to distinguish Shared vs Personal items.
-- If owner_id is NULL, it's a SHARED item (default).
-- If owner_id is SET, it's a PERSONAL item.
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 5. SEED INITIAL USERS
-- Insert Juainny and Erick if they don't exist.
INSERT INTO public.users (handle, display_name, email)
VALUES 
    ('juainny', 'Juainny', 'me@juainny.com'),
    ('erick', 'Erick', 'erick@juainny.com')
ON CONFLICT (handle) DO NOTHING;

-- 6. MIGRATION HELPERS (Optional)
-- You can manually run updates to migrate data if needed.
-- Example: Migrate old 'juainny_reaction' from media table to user_media_actions
-- This is complex SQL, better handled by a script or incrementally.

-- ============================================================================
-- POLICIES (Simple "Application Logic" focus, but good practice)
-- ============================================================================

-- Allow read access to everything for now (since we trust the client app context)
CREATE POLICY "Allow public read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.user_media_actions FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.integrations FOR SELECT USING (true);

-- Allow updates/inserts (In a real app, we'd check auth.uid())
CREATE POLICY "Allow public insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow public all" ON public.user_media_actions FOR ALL USING (true);
CREATE POLICY "Allow public all" ON public.integrations FOR ALL USING (true);
