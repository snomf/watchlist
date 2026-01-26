-- MIGRATION: activity_log user_id from text to UUID

-- 1. Add temporary column
ALTER TABLE public.activity_log ADD COLUMN user_id_uuid UUID REFERENCES public.users(id);

-- 2. Populate UUIDs based on text handles
UPDATE public.activity_log
SET user_id_uuid = (SELECT id FROM public.users WHERE handle = 'juainny')
WHERE user_id = 'juainny' OR user_id = 'user1';

UPDATE public.activity_log
SET user_id_uuid = (SELECT id FROM public.users WHERE handle = 'erick')
WHERE user_id = 'erick' OR user_id = 'user2';

-- 3. Handle 'both' case?
-- If user_id was 'both', we might need to duplicate entries? 
-- Or simpler: Keep 'user_id' as text for now, but prefer UUID?
-- The user said: "I think thill will need to get changed and trasfered."
-- Let's just create the column for now and START using it for new entries.
-- Ideally we want to drop the text column eventually.

-- For 'both', we can perhaps leave NULL or assign to a special 'Shared' user? 
-- Or if the app logic handles 'both', we need to see how.
-- App `loadActivityFeed` does: .or(`user_id.eq.${user},user_id.eq.both`)

-- PROPOSAL:
-- We keep `user_id` text column for legacy 'both' support for now?
-- OR we migrate 'both' to... what?
-- Maybe we don't use 'both' anymore in the new system.
-- If 'both', we insert two rows?

-- Let's just migrate the known users first.
-- We will rename the old column to `user_id_legacy` and new one to `user_id`.

ALTER TABLE public.activity_log RENAME COLUMN user_id TO user_id_legacy;
ALTER TABLE public.activity_log RENAME COLUMN user_id_uuid TO user_id;

-- Make it nullable for now? Yes.
