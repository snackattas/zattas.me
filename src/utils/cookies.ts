/**
 * Get a cookie value by name
 * @param name Cookie name to retrieve
 * @returns Cookie value or empty string if not found
 */
export function getCookie(name: string): string {
  if (typeof document === 'undefined') {
    return '';
  }
  
  // Escape special regex characters in the cookie name
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Use regex to match the cookie name and capture its value
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + escapedName + '=([^;]*)'));
  
  if (match && match[2]) {
    try {
      // Decode the cookie value to handle special characters
      return decodeURIComponent(match[2]);
    } catch {
      // If decoding fails, return the raw value
      return match[2];
    }
  }
  
  return "";
}

/**
 * Set a cookie
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration (optional, defaults to session cookie)
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  
  // Encode the value to handle special characters safely
  const encodedValue = encodeURIComponent(value);
  document.cookie = name + "=" + encodedValue + expires + "; path=/";
}
