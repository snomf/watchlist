-- 1. Create USER MEDIA ACTIONS table
-- This stores individual interactions like ignore_trakt and auto_pull per item.
CREATE TABLE IF NOT EXISTS public.user_media_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    media_id BIGINT REFERENCES public.media(id) ON DELETE CASCADE,
    ignore_trakt BOOLEAN DEFAULT FALSE,
    auto_pull BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, media_id)
);

-- Enable RLS
ALTER TABLE public.user_media_actions ENABLE ROW LEVEL SECURITY;

-- Allow public access (as per existing project pattern)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all' AND tablename = 'user_media_actions') THEN
        CREATE POLICY "Allow public all" ON public.user_media_actions FOR ALL USING (true);
    END IF;
END
$$;

-- 2. Ensure INTEGRATIONS table has required columns
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS sync_mode TEXT DEFAULT 'both';
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITH TIME ZONE;
