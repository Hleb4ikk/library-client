type Params = Record<string, string | number | boolean | null | undefined>;

export function generateCacheKey(type: string, params?: Params): string {
  if (!params || Object.keys(params).length === 0) {
    return `${type}:()`;
  }

  const sortedParts = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);

  return `${type}:(${sortedParts.join('&')})`;
}
