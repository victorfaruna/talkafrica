/**
 * TalkAfrica - Cloudinary Image Migration Script
 * 
 * Uploads all local static images to Cloudinary and prints
 * the new URLs so they can be used to replace hardcoded paths.
 * 
 * Usage: node scripts/upload-to-cloudinary.js
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ Missing CLOUDINARY_CLOUD_NAME in .env');
  process.exit(1);
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

/**
 * Recursively get all image files in a directory
 */
async function getImageFiles(dir) {
  const files = [];
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      if (stats.isDirectory()) {
        const nested = await getImageFiles(fullPath);
        files.push(...nested);
      } else if (IMAGE_EXTENSIONS.has(extname(entry).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    console.warn(`⚠️  Could not read dir: ${dir}`);
  }
  return files;
}

/**
 * Upload a single file to Cloudinary with folder structure preserved
 */
async function uploadFile(localPath, folderPrefix = 'talkafrica') {
  // Derive public_id from path: static/images/hero/ta-1.jpeg → talkafrica/hero/ta-1
  const relativePath = localPath.replace(join(projectRoot, 'static', 'images'), '').replace(/\\/g, '/');
  const withoutExt = relativePath.replace(/\.[^/.]+$/, '').replace(/^\//, '');
  const publicId = `${folderPrefix}/${withoutExt}`;

  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: false,           // Skip if already uploaded
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      localPath: localPath.replace(join(projectRoot, 'static'), '').replace(/\\/g, '/'),
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      sizeBytes: result.bytes,
      already_existed: false,
    };
  } catch (err) {
    // If error is "already exists", fetch existing
    if (err.error?.http_code === 400 || err.message?.includes('already exists')) {
      const existing = await cloudinary.api.resource(publicId);
      return {
        localPath: localPath.replace(join(projectRoot, 'static'), '').replace(/\\/g, '/'),
        cloudinaryUrl: existing.secure_url,
        publicId: existing.public_id,
        sizeBytes: existing.bytes,
        already_existed: true,
      };
    }
    throw err;
  }
}

async function main() {
  console.log('🚀 TalkAfrica → Cloudinary Migration');
  console.log(`☁️  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  // Directories to upload
  const dirsToUpload = [
    join(projectRoot, 'static', 'images', 'hero'),
    join(projectRoot, 'static', 'images'),         // top-level images (founder, logo, etc.)
  ];

  // Collect unique files (avoid double-scanning)
  const allFilesSet = new Set();
  const allFiles = [];

  for (const dir of dirsToUpload) {
    const files = await getImageFiles(dir);
    for (const f of files) {
      if (!allFilesSet.has(f)) {
        allFilesSet.add(f);
        allFiles.push(f);
      }
    }
  }

  // Filter out files inside subdirectories that will be scanned separately
  // (already unique due to Set above)

  console.log(`📁 Found ${allFiles.length} images to upload:\n`);
  allFiles.forEach(f => {
    const rel = f.replace(join(projectRoot, 'static'), '').replace(/\\/g, '/');
    console.log(`   ${rel}`);
  });
  console.log('');

  const results = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of allFiles) {
    const rel = file.replace(join(projectRoot, 'static'), '').replace(/\\/g, '/');
    process.stdout.write(`⬆️  Uploading ${rel} ... `);
    try {
      const result = await uploadFile(file);
      results.push(result);
      if (result.already_existed) {
        console.log(`✅ (already exists)`);
        skipped++;
      } else {
        console.log(`✅ uploaded (${(result.sizeBytes / 1024).toFixed(0)} KB)`);
        uploaded++;
      }
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      results.push({ localPath: rel, error: err.message });
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`📊 Summary: ${uploaded} uploaded, ${skipped} already existed, ${failed} failed`);
  console.log('='.repeat(70) + '\n');

  // Print URL mapping for use in code
  console.log('📋 URL MAPPING (copy these into Hero.svelte and other components):\n');
  
  const heroResults = results.filter(r => r.localPath?.includes('/hero/') && !r.error);
  const otherResults = results.filter(r => !r.localPath?.includes('/hero/') && !r.error);

  if (heroResults.length > 0) {
    console.log('// Hero images (replace in Hero.svelte):');
    console.log('const heroImages = [');
    for (const r of heroResults) {
      console.log(`  "${r.cloudinaryUrl}",`);
    }
    console.log('];\n');
  }

  if (otherResults.length > 0) {
    console.log('// Other images:');
    for (const r of otherResults) {
      console.log(`// ${r.localPath}`);
      console.log(`// → ${r.cloudinaryUrl}`);
    }
  }

  console.log('\n✅ Done! Update your components with the Cloudinary URLs above.');
  console.log('🎯 These images will now be served from Cloudinary CDN, not Vercel.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
