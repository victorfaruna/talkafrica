# Supabase Storage Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it `images`
4. Make it **Public** (so images can be accessed via URL)
5. Click **Create bucket**

## 3. Set Up Environment Variables

Create a `.env` file in your project root with:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Configure Bucket Policies

In Supabase dashboard, go to **Storage** > **Policies** and add these policies:

### Policy 1: Allow public read access

```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
```

### Policy 2: Allow authenticated users to upload

```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
```

### Policy 3: Allow authenticated users to update/delete their own files

```sql
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (bucket_id = 'images');
```

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Try uploading an image through the admin panel
3. Check if the image appears in your Supabase Storage dashboard
4. Verify the image URL works in your blog posts

## Benefits of Using Supabase Storage

- ✅ **CDN**: Images are served via global CDN for fast loading
- ✅ **Scalable**: No storage limits like local filesystem
- ✅ **Reliable**: Images persist across deployments
- ✅ **Secure**: Built-in access controls and policies
- ✅ **Optimized**: Automatic image optimization and caching
