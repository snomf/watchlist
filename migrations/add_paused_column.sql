-- ============================================================================
-- Migration to add 'paused' column to the 'media' table
-- ============================================================================

ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS paused BOOLEAN DEFAULT FALSE;
