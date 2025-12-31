-- Add watched_at column to media table
ALTER TABLE media
ADD COLUMN IF NOT EXISTS watched_at TIMESTAMP WITH TIME ZONE;

-- Backfill watched_at from activity_log for items that are already watched
-- We take the MOST RECENT 'watched' activity for each media_id
UPDATE media
SET watched_at = subquery.latest_watch
FROM (
    SELECT media_id, MAX(created_at) as latest_watch
    FROM activity_log
    WHERE action_type = 'watched'
    GROUP BY media_id
) AS subquery
WHERE media.id = subquery.media_id AND media.watched = true;

-- For watched items that didn't have an activity log (legacy), default to created_at or now()
-- (Optional: better to leave null and handle in sort, or set to created_at)
UPDATE media
SET watched_at = created_at
WHERE watched = true AND watched_at IS NULL;
