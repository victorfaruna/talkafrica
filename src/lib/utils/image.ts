/**
 * Cloudinary image optimization utility for TalkAfrica
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  fit?: 'fill' | 'scale' | 'pad' | 'crop' | 'thumb';
  gravity?: 'auto' | 'center' | 'face';
}

const DEFAULT_OPTIONS: ImageOptions = {
  quality: 'auto',
  format: 'auto',
  fit: 'fill',
  gravity: 'auto'
};

/**
 * Transforms a Cloudinary URL or regular URL into an optimized Cloudinary URL
 * @param url The original image URL
 * @param options Optimization options
 * @returns Modified URL string
 */
export function getOptimizedImageUrl(url: string | null | undefined, options: ImageOptions = {}): string {
  if (!url) return '/images/placeholder.webp';
  
  // If it's not a Cloudinary URL, return as is (with fallback)
  if (!url.includes('cloudinary.com')) return url;

  const opt = { ...DEFAULT_OPTIONS, ...options };
  
  // Cloudinary transformation string
  const transforms: string[] = [];
  
  if (opt.quality) transforms.push(`q_${opt.quality}`);
  if (opt.format) transforms.push(`f_${opt.format}`);
  if (opt.width) transforms.push(`w_${opt.width}`);
  if (opt.height) transforms.push(`h_${opt.height}`);
  if (opt.fit) transforms.push(`c_${opt.fit}`);
  if (opt.gravity) transforms.push(`g_${opt.gravity}`);

  const transformString = transforms.join(',');
  
  // Inject transformations into the URL
  // Typical Cloudinary URL: https://res.cloudinary.com/demo/image/upload/v12345678/sample.jpg
  // We want: https://res.cloudinary.com/demo/image/upload/w_400,c_fill/v12345678/sample.jpg
  
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformString}/`);
  }

  return url;
}

/**
 * Generates a srcset string for responsive images
 * @param url The original image URL
 * @param widths Array of widths to generate
 * @returns srcset string
 */
export function getImageSrcset(url: string | null | undefined, widths: number[] = [400, 800, 1200]): string {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ');
}
