-- FIX MIGRATION: activity_log safely
-- Run this to insure migration completes regardless of current state

DO $$
BEGIN
    -- 1. If 'user_id' is still TEXT, rename it to 'user_id_legacy'
    -- We check the data type of 'user_id' in information_schema
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activity_log' 
        AND column_name = 'user_id' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE public.activity_log RENAME COLUMN user_id TO user_id_legacy;
    END IF;

    -- 2. Ensure 'user_id' column exists as UUID (The new column)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activity_log' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.activity_log ADD COLUMN user_id UUID REFERENCES public.users(id);
    END IF;

    -- 3. Update the UUID column from the Legacy Text column
    -- Try matching 'juainny' -> user.handle
    UPDATE public.activity_log al
    SET user_id = u.id
    FROM public.users u
    WHERE al.user_id_legacy = u.handle
    AND al.user_id IS NULL;

    -- 4. Special case: Map 'user1' -> 'juainny', 'user2' -> 'erick' if legacy data used that
    UPDATE public.activity_log al
    SET user_id = u.id
    FROM public.users u
    WHERE al.user_id_legacy = 'user1' AND u.handle = 'juainny'
    AND al.user_id IS NULL;

    UPDATE public.activity_log al
    SET user_id = u.id
    FROM public.users u
    WHERE al.user_id_legacy = 'user2' AND u.handle = 'erick'
    AND al.user_id IS NULL;

END $$;
