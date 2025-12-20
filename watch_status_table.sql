-- Create watch_status table for the Status-Only API
-- This table tracks watch status for media items by TMDB ID

CREATE TABLE IF NOT EXISTS watch_status (
  tmdb_id INTEGER PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('want_to_watch', 'watching', 'watched')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on updated_at for potential future queries
CREATE INDEX IF NOT EXISTS watch_status_updated_at_idx ON watch_status(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE watch_status ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (no authentication required)
CREATE POLICY "Enable all access for watch_status" ON watch_status
  FOR ALL USING (true) WITH CHECK (true);

-- Add comment to document the table purpose
COMMENT ON TABLE watch_status IS 'Global watch status store for media items across applications. Public API with no authentication.';
COMMENT ON COLUMN watch_status.tmdb_id IS 'The Movie Database (TMDB) ID for the media item';
COMMENT ON COLUMN watch_status.status IS 'Watch status: want_to_watch, watching, or watched';
COMMENT ON COLUMN watch_status.updated_at IS 'Timestamp of last status update';
