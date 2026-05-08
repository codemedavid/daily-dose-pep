-- Adds an optional image_url column to the protocols table so admins
-- can post a protocol as just an image (other fields optional).
ALTER TABLE protocols
  ADD COLUMN IF NOT EXISTS image_url text;
