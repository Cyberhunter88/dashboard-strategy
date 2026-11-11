import type { Simon42StrategyConfig, WeatherStartKey, WeatherStartLayoutItem } from '../types/strategy';

type OptionalBlockConfig = Pick<
  Simon42StrategyConfig,
  'quick_action_entities' | 'show_media_section' | 'show_activity_section'
>;

/**
 * Overview blocks added after free layouts existed. A saved layout cannot
 * contain them yet, so an enabled block is appended once until the user
 * places it. Older blocks are left alone: removing them was a user choice.
 */
const LATE_OPTIONAL_BLOCKS: readonly { key: WeatherStartKey; enabled: (config: OptionalBlockConfig) => boolean }[] = [
  { key: 'quick_actions', enabled: (config) => (config.quick_action_entities ?? []).length > 0 },
  { key: 'media', enabled: (config) => config.show_media_section === true },
  { key: 'activity', enabled: (config) => config.show_activity_section === true },
];

export function withEnabledOptionalBlocks(
  items: WeatherStartLayoutItem[],
  config: OptionalBlockConfig
): WeatherStartLayoutItem[] {
  const present = new Set(items.map((item) => item.type));
  const missing = LATE_OPTIONAL_BLOCKS.filter(({ key, enabled }) => !present.has(key) && enabled(config));
  if (missing.length === 0) return items;
  return [...items, ...missing.map(({ key }) => ({ id: key, type: key }))];
}

/** True when the overview has no user-authored order or free-layout items. */
export function usesDefaultWeatherStartLayout(
  config: Pick<Simon42StrategyConfig, 'weather_start_order' | 'weather_start_layout_items'>
): boolean {
  return !config.weather_start_order?.length && !config.weather_start_layout_items?.length;
}

/** Explicit weather settings win; compact mode is only the fallback for the generated default layout. */
export function getWeatherStartWeatherMode(
  config: Pick<
    Simon42StrategyConfig,
    'weather_start_order' | 'weather_start_layout_items' | 'weather_start_weather_mode'
  >
): 'full' | 'compact_hourly' {
  return config.weather_start_weather_mode ?? (usesDefaultWeatherStartLayout(config) ? 'compact_hourly' : 'full');
}
