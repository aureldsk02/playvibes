import xss from "xss";

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(dirty: string): string {
  // Configure xss to strip all tags (equivalent to ALLOWED_TAGS: [])
  return xss(dirty, {
    whiteList: {}, // No tags allowed
    stripIgnoreTag: true, // Strip tags not in whitelist
    stripIgnoreTagBody: ["script"], // Strip script tag content
  });
}

/**
 * Sanitize user input for plain text fields
 * Removes all HTML and trims whitespace
 * @param input - The user input string
 * @returns Sanitized plain text
 */
export function sanitizeText(input: string): string {
  return sanitizeHtml(input).trim();
}

/**
 * Sanitize and validate URL
 * @param url - The URL string to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize array of strings
 * @param items - Array of strings to sanitize
 * @returns Array of sanitized strings
 */
export function sanitizeArray(items: string[]): string[] {
  return items.map((item) => sanitizeText(item)).filter((item) => item.length > 0);
}
