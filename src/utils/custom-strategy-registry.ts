// Registration entries for Home Assistant's strategy pickers (dashboard
// dialog since 2026.5, "Community sections" since 2026.11). Home Assistant
// prefixes `custom:` itself, so entries must carry the bare name; builds up to
// 1.44.8 registered `custom:dashboard-strategy`, which became `custom:custom:…`.

export interface CustomStrategyEntry {
  type: string;
  strategyType: 'dashboard' | 'view' | 'section';
  name?: string;
  description?: string;
  documentationURL?: string;
}

/** Add or replace an entry; also replaces a legacy `custom:`-prefixed entry of the same kind. */
export function registerCustomStrategy(registry: CustomStrategyEntry[], entry: CustomStrategyEntry): void {
  const index = registry.findIndex(
    (strategy) =>
      strategy.strategyType === entry.strategyType &&
      (strategy.type === entry.type || strategy.type === `custom:${entry.type}`)
  );
  if (index >= 0) registry.splice(index, 1, entry);
  else registry.push(entry);
}
