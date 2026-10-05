import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { isEntityCurrentlyAvailable } from './availability-utils';
import { getVisibleAreasFromHass } from './name-utils';
import { isRoomViewVisible } from './room-visibility';

export type UtilityViewKey = 'lights' | 'covers' | 'security' | 'batteries' | 'climate';

/** Shared route knowledge for diagnostics; unset automatic maintenance stays a possible target. */
export function getConfiguredNavigationPaths(config: Simon42StrategyConfig, hass: HomeAssistant): Set<string> {
  const paths = new Set<string>(['home']);
  for (const key of ['lights', 'covers', 'security', 'batteries', 'climate'] as const)
    if (isUtilityViewEnabled(config, key)) paths.add(key);
  if (config.show_cctv_view === true) paths.add('cctv');
  if (config.show_maintenance_view !== false) paths.add('maintenance');
  for (const area of getVisibleAreasFromHass(hass, config.areas_display, config.use_default_area_sort)) {
    if (isRoomViewVisible(config, hass, area.area_id)) paths.add(area.area_id);
  }
  for (const view of config.custom_views ?? []) if (view.path) paths.add(view.path);
  return paths;
}

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
