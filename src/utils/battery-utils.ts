// ====================================================================
// Battery status classification shared by summary and detail cards
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { isEntityCurrentlyAvailable, isUnavailableState } from './availability-utils';

export type BatteryStatus = 'critical' | 'low' | 'good';

type BatteryStatusConfig = Pick<
  Simon42StrategyConfig,
  | 'battery_critical_threshold'
  | 'battery_low_threshold'
  | 'hide_unavailable_entities'
  | 'unavailable_batteries_bucket'
>;

export function getBatteryStatus(
  hass: HomeAssistant,
  entityId: string,
  config: BatteryStatusConfig
): BatteryStatus | null {
  const state = hass.states[entityId];
  if (!state || !isEntityCurrentlyAvailable(hass, entityId, config)) return null;
  const unavailableBucket = config.unavailable_batteries_bucket === 'critical' ? 'critical' : 'good';
  if (isUnavailableState(state.state)) return unavailableBucket;

  if (entityId.startsWith('binary_sensor.')) {
    return state.state === 'on' ? 'critical' : 'good';
  }

  const unit = state.attributes?.unit_of_measurement;
  if (unit && unit !== '%') return null;

  const value = parseFloat(state.state);
  if (Number.isNaN(value)) return unavailableBucket;

  const criticalThreshold = config.battery_critical_threshold ?? 20;
  const lowThreshold = config.battery_low_threshold ?? 50;
  if (value < criticalThreshold) return 'critical';
  if (value <= lowThreshold) return 'low';
  return 'good';
}
