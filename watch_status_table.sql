-- Create watch_status table for the Status-Only API
-- This table tracks watch status for media items (movies, shows, or specific episodes)

-- Drop if exists to ensure we have the new composite key structure
DROP TABLE IF EXISTS watch_status;

CREATE TABLE watch_status (
  tmdb_id INTEGER NOT NULL,
  season_number INTEGER NOT NULL DEFAULT 0,
  episode_number INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('want_to_watch', 'watching', 'watched')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (tmdb_id, season_number, episode_number)
);

-- Create index on updated_at
CREATE INDEX IF NOT EXISTS watch_status_updated_at_idx ON watch_status(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE watch_status ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (no authentication required)
DROP POLICY IF EXISTS "Enable all access for watch_status" ON watch_status;
CREATE POLICY "Enable all access for watch_status" ON watch_status
  FOR ALL USING (true) WITH CHECK (true);

-- Add comments
COMMENT ON TABLE watch_status IS 'Global watch status store. Uses (tmdb_id, season, episode) as composite key. Season/Episode = 0 for movies/series-level tracking.';

