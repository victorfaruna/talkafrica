import { createHash } from 'node:crypto';
import { cloudinary } from './cloudinary';
import { INLINE_IMAGE_PATTERN } from './article-media';

// Used only on explicit editor saves. Existing records are never bulk migrated.
// Paste, drop and the editor's compressor may produce data URIs even though the
// toolbar upload button already stores images in Cloudinary.
export async function storeInlineImages(html: string) {
    const images = [...new Set(html.match(new RegExp(INLINE_IMAGE_PATTERN, 'g')) ?? [])];
    const urls = new Map<string, string>();
    for (const uri of images) {
        const hash = createHash('sha256').update(uri).digest('hex');
        const uploaded = await cloudinary.uploader.upload(uri, {
            resource_type: 'image', folder: 'talkafrica/inline',
            public_id: hash, overwrite: false,
        });
        if (!uploaded.secure_url) throw new Error('Inline image upload failed; article has not been saved.');
        urls.set(uri, uploaded.secure_url);
    }
    return html.replace(new RegExp(INLINE_IMAGE_PATTERN, 'g'), (uri) => urls.get(uri)!);
}
