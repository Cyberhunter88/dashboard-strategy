import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { buildMaintenanceScan, countMaintenanceItems, getBackupEntityIds, getMaintenanceStatusEntityIds } from './maintenance-utils';

/** Explicit false always disables a feature; undefined uses runtime capability. */
export function resolveFeatureToggle(value: boolean | undefined, capabilityAvailable: boolean): boolean {
  if (value === false) return false;
  if (value === true) return true;
  return capabilityAvailable;
}

/**
 * Maintenance is the only generated overview capability that is enabled by
 * default. Other overview sections retain their historical opt-in behavior.
 */

export function hasMaintenanceCapability(hass: HomeAssistant, config: Simon42StrategyConfig): boolean {
  const scan = buildMaintenanceScan(hass, config);
  return (
    countMaintenanceItems(hass, scan, config.battery_critical_threshold ?? 20) > 0 ||
    getBackupEntityIds(hass).length > 0 ||
    getMaintenanceStatusEntityIds(hass).length > 0
  );
}

/** Resolve the generated maintenance view without changing personal layout. */
export function resolveAutomaticFeatures(
  config: Simon42StrategyConfig,
  hass: HomeAssistant
): Simon42StrategyConfig {
  const maintenanceAvailable = hasMaintenanceCapability(hass, config);
  return {
    ...config,
    show_maintenance_view: resolveFeatureToggle(config.show_maintenance_view, maintenanceAvailable),
  };
}
