// ====================================================================
// Ordering helpers
// ====================================================================

export function mergeConfiguredOrder<T extends string>(stored: T[] | undefined, defaults: readonly T[]): T[] {
  if (!stored || stored.length === 0) return [...defaults];

  const validKeys = new Set(defaults);
  const seen = new Set<T>();
  const known: T[] = [];

  for (const key of stored) {
    if (!validKeys.has(key) || seen.has(key)) continue;
    known.push(key);
    seen.add(key);
  }

  return [...known, ...defaults.filter((key) => !seen.has(key))];
}
