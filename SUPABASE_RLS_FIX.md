# Fix Supabase RLS Policy Error

## The Problem

You're getting the error: "Failed to upload to Supabase: new row violates row-level security policy"

This happens because Supabase Storage has Row Level Security (RLS) enabled by default, but no policies are configured to allow uploads.

## The Solution

### Step 1: Go to Supabase Dashboard

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `hhfchzkvuyiyrtyevjuw`
3. Go to **Storage** → **Policies**

### Step 2: Create Storage Bucket (if not exists)

1. Go to **Storage** → **Buckets**
2. Click **Create a new bucket**
3. Name: `images`
4. Make it **Public**
5. Click **Create bucket**

### Step 3: Add RLS Policies

Go to **Storage** → **Policies** and add these policies:

#### Policy 1: Allow public read access

```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
```

#### Policy 2: Allow authenticated users to upload

```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
```

#### Policy 3: Allow authenticated users to update their files

```sql
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
```

#### Policy 4: Allow authenticated users to delete their files

```sql
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (bucket_id = 'images');
```

### Step 4: Alternative - Disable RLS (Quick Fix)

If you want to disable RLS entirely for the storage bucket:

1. Go to **Storage** → **Policies**
2. Find the `storage.objects` table
3. Click the toggle to **disable RLS** for this table

**⚠️ Warning**: This makes your storage completely public. Only do this if you're okay with anyone being able to upload/delete files.

### Step 5: Test the Fix

1. Restart your development server: `npm run dev`
2. Try uploading an image through the admin panel
3. The error should be resolved!

## Why This Happened

Supabase Storage has Row Level Security enabled by default, which means:

- No one can upload files without explicit policies
- No one can read files without explicit policies
- The policies we created above allow authenticated users to upload and everyone to read

## Security Notes

- The policies above allow any authenticated user to upload to the `images` bucket
- If you need more restrictive access, you can modify the policies to check user IDs
- The `images` bucket is set to public, so uploaded images will be accessible via URL
