-- Add bio columns to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS juainny_bio text,
ADD COLUMN IF NOT EXISTS erick_bio text;

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    media_id bigint REFERENCES media(id) ON DELETE CASCADE,
    tmdb_id bigint,
    action_type text NOT NULL, -- 'watched', 'want_to_watch', 'favorite', 'reaction', 'note_added', 'rate'
    user_id text NOT NULL, -- 'juainny', 'erick', 'both'
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Add indexes for faster queries on the feed
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON activity_log(action_type);

-- Note: No timestamp columns needed in media table - activity_log.created_at handles this
