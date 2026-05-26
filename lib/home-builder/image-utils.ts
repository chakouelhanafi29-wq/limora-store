export function isValidImageSrc(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src || src === "/") return false;

  if (src.startsWith("/")) {
    return src.length > 1;
  }

  return src.startsWith("http://") || src.startsWith("https://");
}
