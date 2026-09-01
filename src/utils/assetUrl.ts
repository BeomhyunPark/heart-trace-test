export function assetUrl(path: string, baseUrl = import.meta.env.BASE_URL): string {
  const normalizedPath = path.replace(/^\/+/, '');

  return `${baseUrl}${normalizedPath}`;
}
