import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { Registry } from '../Registry';
import {
  buildMaintenanceScan,
  countMaintenanceItems,
  getMaintenanceStatusEntityIds,
  getBackupEntityIds,
} from './maintenance-utils';

const ENERGY_DEVICE_CLASSES = new Set(['energy', 'gas', 'power', 'water']);
const ENERGY_UNITS = new Set(['W', 'kW', 'Wh', 'kWh', 'm³', 'L']);

/** Explicit false always disables a feature; undefined uses runtime capability. */
export function resolveFeatureToggle(value: boolean | undefined, capabilityAvailable: boolean): boolean {
  if (value === false) return false;
  if (value === true) return true;
  return capabilityAvailable;
}

function isUsableState(hass: HomeAssistant, entityId: string): boolean {
  const state = hass.states[entityId];
  return Boolean(state && state.state !== 'unknown' && state.state !== 'unavailable');
}

export function visibleEntityIds(hass: HomeAssistant, domain: string): string[] {
  return Registry.getVisibleEntityIdsForDomain(domain).filter((entityId) => isUsableState(hass, entityId));
}

export function hasVisibleEntities(hass: HomeAssistant, domain: string): boolean {
  return visibleEntityIds(hass, domain).length > 0;
}

export function hasVisibleEntitiesInDomains(hass: HomeAssistant, domains: string[]): boolean {
  return domains.some((domain) => hasVisibleEntities(hass, domain));
}

function parseDate(value: unknown): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

/**
 * Calendar entities expose their next event through start_time/end_time.
 * Treat an event that is currently running as useful as well.
 */
export function calendarHasUpcomingEvent(hass: HomeAssistant, entityId: string, now = Date.now()): boolean {
  const state = hass.states[entityId];
  if (!state) return false;

  const start = parseDate(state.attributes?.start_time);
  const end = parseDate(state.attributes?.end_time);
  return (end ?? start ?? Number.NEGATIVE_INFINITY) >= now;
}

export function getCalendarEntitiesWithUpcomingEvents(
  hass: HomeAssistant,
  calendarEntities?: string[],
  now = Date.now()
): string[] {
  const visible = visibleEntityIds(hass, 'calendar');
  const candidates =
    Array.isArray(calendarEntities) && calendarEntities.length > 0
      ? calendarEntities.filter((entityId) => visible.includes(entityId))
      : visible;
  return candidates.filter((entityId) => calendarHasUpcomingEvent(hass, entityId, now));
}

export function hasUpcomingCalendarEvents(hass: HomeAssistant): boolean {
  return getCalendarEntitiesWithUpcomingEvents(hass).length > 0;
}

function isNumericState(hass: HomeAssistant, entityId: string): boolean {
  const value = Number(hass.states[entityId]?.state);
  return Number.isFinite(value);
}

export function hasEnergyCapability(hass: HomeAssistant, config?: Simon42StrategyConfig): boolean {
  if (config?.power_badge_entity && isUsableState(hass, config.power_badge_entity)) return true;

  return [...visibleEntityIds(hass, 'sensor'), ...visibleEntityIds(hass, 'number')].some((entityId) => {
    if (!isNumericState(hass, entityId)) return false;
    const state = hass.states[entityId];
    const deviceClass = state?.attributes?.device_class;
    const unit = state?.attributes?.unit_of_measurement;
    return ENERGY_DEVICE_CLASSES.has(String(deviceClass)) || ENERGY_UNITS.has(String(unit));
  });
}

export function hasSearchCardCapability(): boolean {
  if (typeof customElements === 'undefined') return false;
  return customElements.get('search-card') !== undefined && customElements.get('card-tools') !== undefined;
}

export function hasMaintenanceCapability(hass: HomeAssistant, config: Simon42StrategyConfig): boolean {
  const scan = buildMaintenanceScan(hass, config);
  return (
    countMaintenanceItems(hass, scan, config.battery_critical_threshold ?? 20) > 0 ||
    getBackupEntityIds(hass).length > 0 ||
    getMaintenanceStatusEntityIds(hass).length > 0
  );
}

/**
 * Resolve only capability-aware features. Personal layout and entity
 * configuration is intentionally copied unchanged.
 */
export function resolveAutomaticFeatures(
  config: Simon42StrategyConfig,
  hass: HomeAssistant
): Simon42StrategyConfig {
  const maintenanceAvailable = hasMaintenanceCapability(hass, config);
  const visibleSensorIds = new Set(visibleEntityIds(hass, 'sensor'));
  return {
    ...config,
    show_search_card: resolveFeatureToggle(config.show_search_card, hasSearchCardCapability()),
    show_agenda_section: resolveFeatureToggle(config.show_agenda_section, hasUpcomingCalendarEvents(hass)),
    show_climate_summary: resolveFeatureToggle(config.show_climate_summary, hasVisibleEntities(hass, 'climate')),
    show_covers_summary: resolveFeatureToggle(config.show_covers_summary, hasVisibleEntities(hass, 'cover')),
    show_plants_section: resolveFeatureToggle(config.show_plants_section, hasVisibleEntities(hass, 'plant')),
    show_todos_section: resolveFeatureToggle(config.show_todos_section, hasVisibleEntities(hass, 'todo')),
    show_vacuums_section: resolveFeatureToggle(
      config.show_vacuums_section,
      hasVisibleEntitiesInDomains(hass, ['vacuum', 'lawn_mower'])
    ),
    ...(Array.isArray(config.pollen_entities)
      ? { pollen_entities: config.pollen_entities.filter((entityId) => visibleSensorIds.has(entityId)) }
      : {}),
    show_maintenance_section: resolveFeatureToggle(config.show_maintenance_section, maintenanceAvailable),
    show_maintenance_view: resolveFeatureToggle(config.show_maintenance_view, maintenanceAvailable),
  };
}
