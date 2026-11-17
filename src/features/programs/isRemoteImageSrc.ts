/** Client-safe: true when the image URL is absolute http(s). */
export function isRemoteImageSrc(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
