# Cloudinary Setup Guide

## Getting Your Cloudinary Credentials

1. **Go to Cloudinary**: https://cloudinary.com/
2. **Sign up for free** (no credit card required)
3. **After signup**, you'll see your **Dashboard**
4. **Copy these values**:
   - Cloud Name
   - API Key
   - API Secret

## Setting Up Environment Variables

Create or update your `.env` file in the project root:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Important Notes

- Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual values from Cloudinary dashboard
- Keep these values **secret** - never commit them to Git
- The `.env` file should already be in `.gitignore`

## Next Steps

After setting up the environment variables:
1. Restart your dev server (`npm run dev`)
2. Go to Admin → Posts → Create/Edit Post
3. Try uploading an image
4. The image should now be stored in Cloudinary!

## Re-uploading Existing Images

All your old posts have broken images. You'll need to:
1. Go to each post in the admin panel
2. Click "Edit"
3. Upload a new image
4. Save the post

The new images will be stored in Cloudinary and work properly.
