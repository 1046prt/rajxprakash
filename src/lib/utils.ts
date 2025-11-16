/**
 * Calculate estimated reading time for a given text
 * @param text - The text content to calculate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Object with reading time in minutes and word count
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): { readingTime: number; wordCount: number } {
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);

  return {
    readingTime,
    wordCount: words,
  };
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read" or "1 min read"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
