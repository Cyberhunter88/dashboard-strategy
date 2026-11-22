// ====================================================================
// BADGE UTILITIES — Shared badge detection, color, and display logic
// ====================================================================
// Single source of truth for badge-related decisions used by both
// RoomViewStrategy (runtime) and the Editor (configuration UI).

import type { HomeAssistant } from '../types/homeassistant';
import type { GroupOptions } from '../types/strategy';
import { isEntityRegistryHidden } from '../types/registries';

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
function getColorForEntity(entityId: string, hass: HomeAssistant): string {
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

/** Automatic room badge buckets, in the order the room header renders them. */
export type BadgeSensorType =
  | 'pm25'
  | 'pm10'
  | 'co2'
  | 'voc'
  | 'illuminance'
  | 'battery'
  | 'motion'
  | 'occupancy'
  | 'absolute_humidity'
  | 'smoke'
  | 'gas'
  | 'window'
  | 'door';

/**
 * Classify a sensor/binary_sensor into its automatic badge bucket.
 *
 * Single source of truth for the room view and the editor badge list.
 * Energy block classes, temperature, and humidity return null: temperature
 * and humidity come only from the Home Assistant area settings.
 * Battery sensors are classified regardless of level; the caller applies
 * the critical threshold.
 */
export function classifyBadgeSensor(
  domain: string,
  deviceClass: string | undefined,
  unit: string | undefined,
  entityId: string
): BadgeSensorType | null {
  if (domain === 'sensor') {
    if (isEnergyBlockSensor(domain, deviceClass)) return null;
    if (deviceClass === 'battery' || entityId.includes('battery')) return 'battery';
    if (deviceClass === 'temperature' || unit === '°C' || unit === '°F') return null;
    if (deviceClass === 'humidity' || unit === '%') return null;
    if (unit === 'g/m³') return 'absolute_humidity';
    if (deviceClass === 'pm25' || entityId.includes('pm_2_5') || entityId.includes('pm25')) return 'pm25';
    if (deviceClass === 'pm10' || entityId.includes('pm_10') || entityId.includes('pm10')) return 'pm10';
    if (deviceClass === 'carbon_dioxide' || entityId.includes('co2')) return 'co2';
    if (deviceClass === 'volatile_organic_compounds' || entityId.includes('voc')) return 'voc';
    if (deviceClass === 'illuminance' || unit === 'lx') return 'illuminance';
    return null;
  }
  if (domain === 'binary_sensor') {
    switch (deviceClass) {
      case 'motion':
      case 'window':
      case 'door':
      case 'smoke':
      case 'gas':
        return deviceClass;
      case 'occupancy':
      case 'presence':
        return 'occupancy';
    }
  }
  return null;
}

/** Default critical battery threshold shared with the battery views. */
export const DEFAULT_BATTERY_CRITICAL_THRESHOLD = 20;

/** Whether a battery sensor is below the configured critical threshold. */
export function isCriticalBatteryBadge(state: string | undefined, criticalThreshold?: number): boolean {
  const value = parseFloat(state ?? '');
  return !isNaN(value) && value < (criticalThreshold ?? DEFAULT_BATTERY_CRITICAL_THRESHOLD);
}

// -- Area primary sensors ---------------------------------------------

export type AreaPrimarySensorKind = 'temperature' | 'humidity';
export type AreaPrimarySensorIssue = 'missing' | 'hidden';

interface AreaPrimarySensorSource {
  temperature_entity_id?: string | null;
  humidity_entity_id?: string | null;
}

/**
 * Why an area's assigned temperature/humidity sensor cannot be shown.
 *
 * The assignment in the Home Assistant area settings is an explicit choice,
 * so dashboard-level exclusions (no_dboard label, configured hidden lists,
 * config/diagnostic category) do not apply. Only a missing state and
 * entities hidden or disabled in Home Assistant block it.
 */
export function getAreaPrimarySensorIssue(hass: HomeAssistant, entityId: string): AreaPrimarySensorIssue | undefined {
  if (!hass.states[entityId]) return 'missing';
  if (isEntityRegistryHidden(hass.entities[entityId])) return 'hidden';
  return undefined;
}

/** The area's assigned temperature/humidity entity when it can be shown. */
export function resolveAreaPrimarySensor(
  area: AreaPrimarySensorSource,
  kind: AreaPrimarySensorKind,
  hass: HomeAssistant
): string | null {
  const entityId = kind === 'temperature' ? area.temperature_entity_id : area.humidity_entity_id;
  if (!entityId || getAreaPrimarySensorIssue(hass, entityId)) return null;
  return entityId;
}

/**
 * Keep one automatic badge per type until the user explicitly curates that type.
 *
 * With `deviceKey`, the automatic selection keeps one badge per device instead
 * (entities without a device count individually). This lets rooms with several
 * physical sensors of one type, such as two motion sensors in a stairwell
 * hallway, show each sensor while a camera's motion/person/vehicle/animal
 * entities still collapse into a single badge.
 */
export function selectBadgeEntitiesOfType(
  entities: string[],
  hiddenBadges: ReadonlySet<string>,
  deviceKey?: (entityId: string) => string | null | undefined
): string[] {
  const first = entities[0];
  if (!first) return [];
  const curated = entities.some((entityId) => hiddenBadges.has(entityId));
  if (curated) return entities.filter((entityId) => !hiddenBadges.has(entityId));
  if (!deviceKey) return [first];
  const seenDevices = new Set<string>();
  return entities.filter((entityId) => {
    const key = deviceKey(entityId);
    if (!key) return true;
    if (seenDevices.has(key)) return false;
    seenDevices.add(key);
    return true;
  });
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
