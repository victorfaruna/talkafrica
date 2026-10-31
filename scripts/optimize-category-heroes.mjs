import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const directory = path.join(root, 'static/images/category');
const output = path.join(directory, 'optimized');
await mkdir(output, { recursive: true });
const sources = (await readdir(directory))
    .filter(name => /-hero\.(jpg|png)$/.test(name))
    .map(name => ({ key: name.replace(/-hero\.(jpg|png)$/, ''), file: path.join(directory, name) }));
sources.push({ key: 'default', file: path.join(root, 'static/images/big-screen-bg-v2.jpg') });
const manifest = {};
let originalBytes = 0;
let mobileBytes = 0;
let desktopBytes = 0;

for (const source of sources) {
    const input = await readFile(source.file);
    const metadata = await sharp(input).rotate().metadata();
    const hash = createHash('sha256').update(input).update('webp-q76-effort5-v1').digest('hex').slice(0, 10);
    const widths = [...new Set([640, 1280, 1920].map(width => Math.min(width, metadata.width)))];
    const variants = [];
    for (const width of widths) {
        const filename = `${source.key}-${hash}-${width}.webp`;
        const info = await sharp(input).rotate().resize({ width, withoutEnlargement: true })
            .webp({ quality: 76, effort: 5 }).toFile(path.join(output, filename));
        variants.push({ src: `/images/category/optimized/${filename}`, width: info.width, bytes: info.size });
    }
    manifest[source.key] = {
        src: variants.at(-1).src,
        srcset: variants.map(image => `${image.src} ${image.width}w`).join(', '),
    };
    originalBytes += input.length;
    mobileBytes += variants[0].bytes;
    desktopBytes += variants.at(-1).bytes;
    console.log(`${source.key}: ${(input.length / 1024).toFixed(0)} KB -> ${(variants[0].bytes / 1024).toFixed(0)} KB small / ${(variants.at(-1).bytes / 1024).toFixed(0)} KB large`);
}

await writeFile(path.join(root, 'src/lib/category-hero-images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${sources.length} heroes: ${(100 * (1 - mobileBytes / originalBytes)).toFixed(1)}% smaller at 640px; ${(100 * (1 - desktopBytes / originalBytes)).toFixed(1)}% smaller at desktop size.`);
