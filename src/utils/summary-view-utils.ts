import type { Simon42StrategyConfig } from '../types/strategy';

export type UtilityViewKey = 'lights' | 'covers' | 'security' | 'batteries' | 'climate';

/** Single source of truth for summary-backed utility view generation. */
export function isUtilityViewEnabled(config: Simon42StrategyConfig, view: UtilityViewKey): boolean {
  switch (view) {
    case 'lights':
      return config.show_light_summary !== false || config.show_light_view === true;
    case 'covers':
      return config.show_covers_summary !== false || config.show_covers_view === true;
    case 'security':
      return config.show_security_summary !== false || config.show_security_view === true;
    case 'batteries':
      return config.show_battery_summary !== false || config.show_battery_view === true;
    case 'climate':
      return config.show_climate_summary === true || config.show_climate_view === true;
  }
}
