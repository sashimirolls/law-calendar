/**
 * Browser-compatible base64 encoding
 */
export function encodeBase64(str: string): string {
  return btoa(str);
}

export function decodeBase64(str: string): string {
  return atob(str);
}