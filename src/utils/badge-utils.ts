// ====================================================================
// BADGE UTILITIES — Shared badge detection, color, and display logic
// ====================================================================
// Single source of truth for badge-related decisions used by both
// RoomViewStrategy (runtime) and the Editor (configuration UI).

import type { HomeAssistant } from '../types/homeassistant';
import type { GroupOptions } from '../types/strategy';

// -- Badge color map (device_class → HA color name) -------------------

export const BADGE_COLOR_MAP: Record<string, string> = {
  temperature: 'red',
  humidity: 'indigo',
  pm25: 'orange',
  pm10: 'orange',
  carbon_dioxide: 'green',
  volatile_organic_compounds: 'purple',
  illuminance: 'amber',
  battery: 'red',
  motion: 'yellow',
  occupancy: 'cyan',
  presence: 'cyan',
  moisture: 'blue',
  window: 'teal',
  door: 'teal',
  smoke: 'red',
  gas: 'red',
  wind_speed: 'blue',
  pressure: 'deep-purple',
  power: 'orange',
  energy: 'orange',
};

// -- Badge color for a specific entity --------------------------------

/** Get badge color for an entity based on its device_class, with unit fallbacks */
export function getColorForEntity(entityId: string, hass: HomeAssistant): string {
  const state = hass.states[entityId];
  if (!state) return 'grey';
  const dc = state.attributes?.device_class as string | undefined;
  if (dc && BADGE_COLOR_MAP[dc]) return BADGE_COLOR_MAP[dc];
  const unit = state.attributes?.unit_of_measurement as string | undefined;
  if (unit === 'lx') return 'amber';
  if (unit === 'g/m³') return 'blue';
  return 'grey';
}

export const ROOM_ENERGY_SENSOR_CLASSES = ['power', 'energy', 'water', 'gas'] as const;
const ROOM_ENERGY_SENSOR_CLASS_SET = new Set<string>(ROOM_ENERGY_SENSOR_CLASSES);

export function isEnergyBlockSensor(domain: string, deviceClass: string | undefined): boolean {
  return domain === 'sensor' && !!deviceClass && ROOM_ENERGY_SENSOR_CLASS_SET.has(deviceClass);
}

// -- Badge candidate detection ----------------------------------------

/**
 * Check if a sensor/binary_sensor entity qualifies as a badge candidate.
 * Temperature and humidity are excluded (handled by HA area config).
 * Battery detection returns true but threshold check remains with the caller.
 */
export function isBadgeCandidate(
  domain: string,
  deviceClass: string | undefined,
  unit: string | undefined,
  entityId: string
): boolean {
  if (domain === 'sensor') {
    // Battery (caller must check threshold)
    if (deviceClass === 'battery' || entityId.includes('battery')) return true;
    // Skip temperature/humidity (handled by HA area config, not auto-detected)
    if (deviceClass === 'temperature' || unit === '°C' || unit === '°F') return false;
    if (deviceClass === 'humidity' || unit === '%') return false;
    // Air quality
    if (deviceClass === 'pm25' || entityId.includes('pm_2_5') || entityId.includes('pm25')) return true;
    if (deviceClass === 'pm10' || entityId.includes('pm_10') || entityId.includes('pm10')) return true;
    if (deviceClass === 'carbon_dioxide' || entityId.includes('co2')) return true;
    if (deviceClass === 'volatile_organic_compounds' || entityId.includes('voc')) return true;
    // Light / humidity
    if (deviceClass === 'illuminance' || unit === 'lx') return true;
    if (unit === 'g/m³') return true; // absolute humidity
    return false;
  }
  if (domain === 'binary_sensor') {
    return (
      deviceClass === 'motion' ||
      deviceClass === 'occupancy' ||
      deviceClass === 'presence' ||
      deviceClass === 'window' ||
      deviceClass === 'door' ||
      deviceClass === 'smoke' ||
      deviceClass === 'gas'
    );
  }
  return false;
}

/** Keep one automatic badge per type until the user explicitly curates that type. */
export function selectBadgeEntitiesOfType(entities: string[], hiddenBadges: ReadonlySet<string>): string[] {
  const first = entities[0];
  if (!first) return [];
  const curated = entities.some((entityId) => hiddenBadges.has(entityId));
  return curated ? entities.filter((entityId) => !hiddenBadges.has(entityId)) : [first];
}

export interface BadgeCandidate {
  entity: string;
  color: string;
  showName?: boolean;
}

/** Apply badge-only deselection and explicitly added room badges. */
export function applyBadgeGroupOptions(
  candidates: BadgeCandidate[],
  options: GroupOptions | undefined,
  hass: HomeAssistant
): BadgeCandidate[] {
  const hidden = new Set(options?.hidden || []);
  const result = candidates.filter((candidate) => !hidden.has(candidate.entity));
  for (const entityId of options?.additional || []) {
    if (!hass.states[entityId] || result.some((candidate) => candidate.entity === entityId)) continue;
    result.push({ entity: entityId, color: getColorForEntity(entityId, hass) });
  }
  return result;
}

// -- Default show_name ------------------------------------------------

/** Whether a badge with this device_class shows its entity name by default */
export function isDefaultShowName(deviceClass: string | undefined): boolean {
  return deviceClass === 'window' || deviceClass === 'door';
}

// -- Show name resolution ---------------------------------------------

/** Resolve whether a badge should show its entity name (config overrides > defaults) */
export function resolveShowName(
  entityId: string,
  defaultShowName: boolean,
  namesVisible: Set<string> | null | undefined,
  namesHidden: Set<string> | null | undefined
): boolean {
  if (namesHidden?.has(entityId)) return false;
  if (namesVisible?.has(entityId)) return true;
  return defaultShowName;
}
