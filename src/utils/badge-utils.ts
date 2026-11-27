// ====================================================================
// BADGE UTILITIES — Shared badge detection, color, and display logic
// ====================================================================
// Single source of truth for badge-related decisions used by both
// RoomViewStrategy (runtime) and the Editor (configuration UI).

import type { HomeAssistant } from '../types/homeassistant';
import type { GroupOptions } from '../types/strategy';
import type { LovelaceBadgeConfig } from '../types/lovelace';
import { isEntityRegistryHidden } from '../types/registries';
import { isDashboardLabelExcluded } from './entity-exclusion';

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

/** Whether the object id contains `token` as a whole underscore-delimited word. */
function hasNameToken(entityId: string, token: string): boolean {
  const objectId = entityId.slice(entityId.indexOf('.') + 1);
  return `_${objectId}_`.includes(`_${token}_`);
}

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
    // A declared device_class always wins over name heuristics, so a
    // temperature sensor called "..._battery_temperature" is not a battery.
    if (deviceClass === 'battery') return 'battery';
    if (deviceClass === 'temperature' || unit === '°C' || unit === '°F' || unit === 'K') return null;
    if (deviceClass === 'humidity') return null;
    if (deviceClass === 'pm25') return 'pm25';
    if (deviceClass === 'pm10') return 'pm10';
    if (deviceClass === 'carbon_dioxide') return 'co2';
    if (deviceClass === 'volatile_organic_compounds') return 'voc';
    if (deviceClass === 'illuminance') return 'illuminance';
    if (unit === 'g/m³') return 'absolute_humidity';
    if (unit === 'lx') return 'illuminance';
    if (unit === '%') return !deviceClass && hasNameToken(entityId, 'battery') ? 'battery' : null;
    if (deviceClass) return null;
    if (hasNameToken(entityId, 'battery')) return 'battery';
    if (hasNameToken(entityId, 'pm25') || hasNameToken(entityId, 'pm_2_5')) return 'pm25';
    if (hasNameToken(entityId, 'pm10') || hasNameToken(entityId, 'pm_10')) return 'pm10';
    if (hasNameToken(entityId, 'co2')) return 'co2';
    if (hasNameToken(entityId, 'voc')) return 'voc';
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
export type AreaPrimarySensorIssue = 'missing' | 'hidden' | 'label';

interface AreaPrimarySensorSource {
  temperature_entity_id?: string | null;
  humidity_entity_id?: string | null;
}

interface AreaSensorCandidate {
  entity_id: string;
  device_id?: string | null;
}

const PRIMARY_SENSOR_UNITS: Record<AreaPrimarySensorKind, ReadonlySet<string>> = {
  temperature: new Set(['°C', '°F', 'K']),
  humidity: new Set(['%']),
};

/**
 * Why an area's assigned temperature/humidity sensor cannot be shown.
 *
 * The `no_dboard` label (on the entity or its device) is strict and
 * dashboard-wide, so it also removes an assigned area sensor. The explicit
 * area assignment still wins over the softer dashboard rules
 * (config/diagnostic category, room hidden lists). A missing state and
 * entities hidden or disabled in Home Assistant block it as well.
 */
export function getAreaPrimarySensorIssue(hass: HomeAssistant, entityId: string): AreaPrimarySensorIssue | undefined {
  if (!hass.states[entityId]) return 'missing';
  if (isEntityRegistryHidden(hass.entities[entityId])) return 'hidden';
  if (isDashboardLabelExcluded(hass, entityId)) return 'label';
  return undefined;
}

const climateDevicesCache = new WeakMap<object, Set<string>>();

/** Devices that provide a climate entity (thermostats), cached per entity registry. */
function getClimateDeviceIds(hass: HomeAssistant): Set<string> {
  const cached = climateDevicesCache.get(hass.entities);
  if (cached) return cached;
  const ids = new Set<string>();
  for (const [entityId, entry] of Object.entries(hass.entities)) {
    if (entry.device_id && entityId.startsWith('climate.')) ids.add(entry.device_id);
  }
  climateDevicesCache.set(hass.entities, ids);
  return ids;
}

/** Sensors that measure something other than the room climate (appliances, servers, outdoors, ...). */
const NON_ROOM_SENSOR_PATTERN =
  /(^|[^a-z])(cpu|gpu|nas|server|proxmox|printer|drucker|fridge|freezer|k[uü]hlschrank|gefrier|oven|ofen|boiler|soil|pool|outdoor|outside|au[sß]en|garden|garten|core|processor|dew|taupunkt|battery|akku)([^a-z]|$)/i;

function isNumericState(state: string | undefined): boolean {
  return !Number.isNaN(parseFloat(state ?? ''));
}

/**
 * Pick a replacement room sensor when the assigned one cannot be shown.
 *
 * `candidates` must already be dashboard-visible area entities (Registry
 * visibility: no no_dboard, hidden, or config/diagnostic entities). Sensors
 * that look like appliance, server, or outdoor readings are skipped. Ranking:
 * a current numeric value first, then a device that provides both temperature
 * and humidity (a real room sensor), then other dedicated devices, then a
 * thermostat's own sensor, then device-less helpers such as smoothed values;
 * ties resolve by entity id.
 */
export function pickAreaFallbackSensor(
  kind: AreaPrimarySensorKind,
  candidates: readonly AreaSensorCandidate[],
  hass: HomeAssistant
): string | null {
  const units = PRIMARY_SENSOR_UNITS[kind];
  const classesByDevice = new Map<string, Set<string>>();
  for (const candidate of candidates) {
    const deviceClass = hass.states[candidate.entity_id]?.attributes?.device_class as string | undefined;
    if (!candidate.device_id || !candidate.entity_id.startsWith('sensor.') || !deviceClass) continue;
    const set = classesByDevice.get(candidate.device_id) ?? new Set<string>();
    set.add(deviceClass);
    classesByDevice.set(candidate.device_id, set);
  }
  let best: { id: string; rank: number } | null = null;
  for (const candidate of candidates) {
    const id = candidate.entity_id;
    if (!id.startsWith('sensor.')) continue;
    const state = hass.states[id];
    if (!state || state.attributes?.device_class !== kind) continue;
    if (!units.has(state.attributes?.unit_of_measurement as string)) continue;
    const available = isNumericState(state.state);
    const name = `${id.split('.')[1]} ${(state.attributes?.friendly_name as string) ?? ''}`;
    if (NON_ROOM_SENSOR_PATTERN.test(name.replace(/_/g, ' '))) continue;
    const device = candidate.device_id;
    let source: number;
    if (!device) source = 3;
    else if (getClimateDeviceIds(hass).has(device)) source = 2;
    else {
      const classes = classesByDevice.get(device);
      source = classes?.has('temperature') && classes.has('humidity') ? 0 : 1;
    }
    const rank = (available ? 0 : 4) + source;
    if (!best || rank < best.rank || (rank === best.rank && id < best.id)) best = { id, rank };
  }
  return best?.id ?? null;
}

/**
 * The area's temperature/humidity entity to show, or null.
 *
 * Uses the sensor assigned in the Home Assistant area settings. When that
 * sensor exists but cannot be shown (no_dboard, hidden, no state), a
 * replacement is picked from `candidates`. A sensor that is merely
 * unavailable stays: the strategy only regenerates on registry changes, so a
 * live-state switch would stick after the sensor recovers. Areas without an
 * assignment stay without the badge, which avoids guessing (e.g. server or
 * printer temperatures).
 */
export function resolveAreaPrimarySensor(
  area: AreaPrimarySensorSource,
  kind: AreaPrimarySensorKind,
  hass: HomeAssistant,
  candidates?: readonly AreaSensorCandidate[]
): string | null {
  const entityId = kind === 'temperature' ? area.temperature_entity_id : area.humidity_entity_id;
  if (!entityId) return null;
  if (!getAreaPrimarySensorIssue(hass, entityId)) return entityId;
  return candidates ? pickAreaFallbackSensor(kind, candidates, hass) : null;
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
  /** Render as the native HA 2026.11+ alert badge (colored and pulsing while active). */
  alert?: boolean;
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

// -- Room badge assembly ----------------------------------------------

/**
 * Build the room header badges: the area's primary temperature/humidity
 * sensors first, then the automatic candidates.
 *
 * The badge-local `hidden`, `additional`, `names_visible`, and `names_hidden`
 * options apply to primary sensors as well, so a user can hide the primary
 * badge without touching the Home Assistant area assignment. An entity never
 * renders twice (e.g. a primary sensor that is also listed in `additional`).
 */
export function buildRoomBadges(
  primary: ReadonlyArray<{ entity: string | null; color: string }>,
  candidates: BadgeCandidate[],
  options: GroupOptions | undefined,
  hass: HomeAssistant
): LovelaceBadgeConfig[] {
  const hidden = new Set(options?.hidden || []);
  const namesVisible = options ? new Set(options.names_visible || []) : null;
  const namesHidden = options ? new Set(options.names_hidden || []) : null;
  const all: BadgeCandidate[] = [
    ...primary.flatMap((p) => (p.entity && !hidden.has(p.entity) ? [{ entity: p.entity, color: p.color }] : [])),
    ...applyBadgeGroupOptions(candidates, options, hass),
  ];
  const seen = new Set<string>();
  const badges: LovelaceBadgeConfig[] = [];
  for (const badge of all) {
    if (seen.has(badge.entity)) continue;
    seen.add(badge.entity);
    const showName = resolveShowName(badge.entity, !!badge.showName, namesVisible, namesHidden);
    if (badge.alert) {
      badges.push({
        type: 'alert',
        entity: badge.entity,
        alert_color: badge.color,
        pulse: true,
        tap_action: { action: 'more-info' },
        ...(showName ? { show_name: true } : {}),
      });
      continue;
    }
    badges.push({
      type: 'entity',
      entity: badge.entity,
      color: badge.color,
      tap_action: { action: 'more-info' },
      ...(showName ? { show_name: true } : {}),
    });
  }
  return badges;
}
