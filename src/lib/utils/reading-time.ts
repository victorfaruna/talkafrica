/**
 * Calculate estimated reading time for article content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    
    // Remove extra whitespace and count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Minimum 1 minute
    return Math.max(1, readingTime);
}


