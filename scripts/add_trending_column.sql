-- Add is_trending_news column if it doesn't exist
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_trending_news BOOLEAN NOT NULL DEFAULT false;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name = 'is_trending_news';
