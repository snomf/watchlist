-- ============================================================================
-- ACCOUNT SYSTEM SYNC FIX (INTEGRATING WITH EXISTING USER_PROFILES)
-- ============================================================================

-- 1. Ensure USER_PROFILES has necessary columns for the app
-- We use 'user_id' as the handle (e.g. 'juainny') and 'name' as the display name.
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{}'::JSONB;

-- 2. USER MEDIA ACTIONS (Stores ignore_trakt, auto_pull, etc.)
-- Links to user_profiles.id
CREATE TABLE IF NOT EXISTS public.user_media_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    media_id BIGINT REFERENCES public.media(id) ON DELETE CASCADE,
    rating FLOAT,
    review TEXT,
    reaction TEXT,
    watched_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ignore_trakt BOOLEAN DEFAULT FALSE,
    auto_pull BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, media_id)
);

ALTER TABLE public.user_media_actions ENABLE ROW LEVEL SECURITY;

-- 3. INTEGRATIONS (Trakt)
-- Links to user_profiles.id
CREATE TABLE IF NOT EXISTS public.integrations (
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'trakt'
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_mode TEXT DEFAULT 'both',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- 4. MODIFY MEDIA TABLE
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 5. SEED INITIAL USERS (into user_profiles if missing)
-- We check by user_id (the handle)
INSERT INTO public.user_profiles (user_id, name, nicknames)
VALUES 
    ('juainny', 'Juainny', 'Juainny'),
    ('erick', 'Erick', 'Erick')
ON CONFLICT (user_id) DO NOTHING;

-- 6. POLICIES (Conditional Block)
DO $$
BEGIN
    -- user_profiles Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read' AND tablename = 'user_profiles') THEN
        CREATE POLICY "Allow public read" ON public.user_profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'user_profiles') THEN
        CREATE POLICY "Allow public insert" ON public.user_profiles FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update' AND tablename = 'user_profiles') THEN
        CREATE POLICY "Allow public update" ON public.user_profiles FOR UPDATE USING (true);
    END IF;

    -- Media Actions Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read' AND tablename = 'user_media_actions') THEN
        CREATE POLICY "Allow public read" ON public.user_media_actions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all' AND tablename = 'user_media_actions') THEN
        CREATE POLICY "Allow public all" ON public.user_media_actions FOR ALL USING (true);
    END IF;

    -- Integrations Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read' AND tablename = 'integrations') THEN
        CREATE POLICY "Allow public read" ON public.integrations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all' AND tablename = 'integrations') THEN
        CREATE POLICY "Allow public all" ON public.integrations FOR ALL USING (true);
    END IF;
END
$$;
