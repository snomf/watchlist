-- Create the flairs table
CREATE TABLE IF NOT EXISTS flairs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL, -- Hex code or CSS color name
    icon TEXT, -- FontAwesome class or emoji
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the media_flairs join table
CREATE TABLE IF NOT EXISTS media_flairs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    media_id BIGINT NOT NULL, -- Assuming media.id is BIGINT based on typical Supabase setup, check if it's UUID
    flair_id UUID NOT NULL REFERENCES flairs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(media_id, flair_id)
);

-- Add RLS policies (optional but recommended)
ALTER TABLE flairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_flairs ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on flairs" ON flairs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on media_flairs" ON media_flairs FOR SELECT USING (true);

-- Allow write access to authenticated users (or everyone if anon is used for everything)
-- For this app, it seems we are using anon key for everything, so we might need to allow anon write or check if there's auth.
-- Assuming 'anon' role for now based on supabase-client.js
CREATE POLICY "Allow anon insert on flairs" ON flairs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on flairs" ON flairs FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on flairs" ON flairs FOR DELETE USING (true);

CREATE POLICY "Allow anon insert on media_flairs" ON media_flairs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete on media_flairs" ON media_flairs FOR DELETE USING (true);
