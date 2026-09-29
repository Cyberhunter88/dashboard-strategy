import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { isEntityCurrentlyAvailable } from './availability-utils';

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

export function countActiveClimateEntities(
  hass: HomeAssistant,
  entityIds: Set<string> | null,
  config: Simon42StrategyConfig
): number {
  let count = 0;
  if (!entityIds) return count;
  for (const id of entityIds) {
    if (!isEntityCurrentlyAvailable(hass, id, config)) continue;
    const state = hass.states[id];
    if (!state || !state.state || state.state === 'off' || state.state === 'unavailable' || state.state === 'unknown') {
      continue;
    }
    const action = state.attributes?.hvac_action;
    if (action === 'idle' || action === 'off') continue;
    count++;
  }
  return count;
}
