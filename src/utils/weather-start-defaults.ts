import type { Simon42StrategyConfig } from '../types/strategy';

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
