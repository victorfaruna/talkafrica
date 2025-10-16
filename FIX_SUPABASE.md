# Fix Supabase Configuration

## The Problem

Your `SUPABASE_ANON_KEY` in the `.env` file appears to be corrupted/duplicated, causing the "Invalid Compact JWS" error.

## The Solution

### 1. Get the Correct Anon Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `hhfchzkvuyiyrtyevjuw`
3. Go to **Settings** → **API**
4. Copy the **anon public** key (it should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 2. Update Your .env File

Replace your current `.env` file content with:

```env
DATABASE_URL="postgresql://postgres.hhfchzkvuyiyrtyevjuw:Koreayode2022@$@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL=https://hhfchzkvuyiyrtyevjuw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZmNoemt2dXlpeXJ0eWV2anV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2Mzc2NjcsImV4cCI6MjA3NTIxMzY2N30.MrPYG3bnVF4LuzNPcOJwh6g-UcPf-gbOrvVY6wblGi4
```

**Important**: Make sure the `SUPABASE_ANON_KEY` is a single, clean JWT token without any duplication.

### 3. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it `images`
4. Make it **Public**
5. Click **Create bucket**

### 4. Set Storage Policies

Go to **Storage** → **Policies** and add:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
```

### 5. Test the Fix

1. Restart your dev server: `npm run dev`
2. Try uploading an image again
3. The error should be resolved!

## Why This Happened

The JWT token got duplicated somehow, making it invalid. The correct anon key should be a single, clean JWT token.
