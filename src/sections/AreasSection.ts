// ====================================================================
// Areas Section Builder
// ====================================================================
// Ported from dist/utils/simon42-section-builder.js (createAreasSection)
// with full TypeScript types.
// Creates area cards grouped by floor or as a single flat section.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { AreaRegistryEntry } from '../types/registries';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

// Area control domains to check (same as HA, with optional 'switch')
const CONTROL_DOMAINS = [
  'light',
  'fan',
  'switch',
  'cover-shutter',
  'cover-blind',
  'cover-curtain',
  'cover-shade',
  'cover-awning',
  'cover-garage',
  'cover-gate',
  'cover-door',
  'cover-window',
  'cover-damper',
] as const;

type ControlDomain = (typeof CONTROL_DOMAINS)[number];

const IMPORTANT_SENSOR_CLASSES = [
  'carbon_dioxide',
  'volatile_organic_compounds',
  'pm25',
  'pm10',
  'pressure',
  'illuminance',
  'power',
  'energy',
  'water',
  'gas',
] as const;

const IMPORTANT_SENSOR_CLASS_SET = new Set<string>(IMPORTANT_SENSOR_CLASSES);

const AREA_ENERGY_SENSOR_CLASSES = ['power', 'energy', 'water', 'gas'] as const;
const AREA_ENERGY_SENSOR_CLASS_SET = new Set<string>(AREA_ENERGY_SENSOR_CLASSES);

/**
 * Pre-computes which area-controls actually have entities in this area.
 * This avoids the area card having to scan all entities at render time.
 * Same approach as HA's areas-overview-view-strategy.
 */
function getAreaControls(areaId: string, hass: HomeAssistant): ControlDomain[] {
  const areaEntities = Registry.getVisibleEntitiesForArea(areaId);
  if (areaEntities.length === 0) return [];

  const found = new Set<ControlDomain>();

  for (const entity of areaEntities) {
    const state = hass.states[entity.entity_id];
    if (!state) continue;

    const domain = entity.entity_id.split('.')[0];
    const deviceClass = state.attributes?.device_class as string | undefined;

    if (domain === 'light') found.add('light');
    else if (domain === 'fan') found.add('fan');
    else if (domain === 'switch' && Registry.config.show_switches_on_areas) found.add('switch');
    else if (domain === 'cover' && deviceClass) {
      const key = `cover-${deviceClass}` as ControlDomain;
      if (CONTROL_DOMAINS.includes(key)) found.add(key);
    }
  }

  return [...found];
}

// Alert-relevant binary sensor device classes.
// Excludes noisy classes like light, connectivity, battery, plug, power, running, problem.
const ALERT_DEVICE_CLASSES = new Set([
  'motion', 'occupancy', 'sound',
  'moisture',
  'smoke', 'gas', 'heat', 'cold', 'safety', 'tamper', 'vibration',
]);

/**
 * Pre-computes which binary sensor alert classes exist in this area.
 * Only returns device classes from the allowlist that have at least one
 * binary_sensor entity, so the area card doesn't scan all entities at render time.
 */
function getAreaAlertClasses(areaId: string, hass: HomeAssistant): string[] {
  const areaEntities = Registry.getVisibleEntitiesForArea(areaId);
  if (areaEntities.length === 0) return [];

  const found = new Set<string>();

  for (const entity of areaEntities) {
    const domain = entity.entity_id.split('.')[0];
    if (domain !== 'binary_sensor') continue;

    const state = hass.states[entity.entity_id];
    const deviceClass = state?.attributes?.device_class as string | undefined;
    if (deviceClass && ALERT_DEVICE_CLASSES.has(deviceClass)) found.add(deviceClass);
  }

  return [...found];
}

/**
 * Pre-computes which sensor classes should be shown on the native area card.
 * Uses the Registry-visible entities only, so no_dboard labels and configured
 * hidden entities remain authoritative.
 */
function getAreaSensorClasses(area: AreaRegistryEntry, hass: HomeAssistant): string[] {
  const found = new Set<string>();
  const areaEntities = Registry.getVisibleEntitiesForArea(area.area_id);
  const visibleEntityIds = new Set(areaEntities.map((entity) => entity.entity_id));

  if (
    area.temperature_entity_id &&
    visibleEntityIds.has(area.temperature_entity_id) &&
    hass.states[area.temperature_entity_id]
  ) {
    found.add('temperature');
  }
  if (
    area.humidity_entity_id &&
    visibleEntityIds.has(area.humidity_entity_id) &&
    hass.states[area.humidity_entity_id]
  ) {
    found.add('humidity');
  }

  if (areaEntities.length === 0) return [...found];

  for (const entity of areaEntities) {
    const domain = entity.entity_id.split('.')[0];
    if (domain !== 'sensor') continue;

    const state = hass.states[entity.entity_id];
    const deviceClass = state?.attributes?.device_class as string | undefined;
    if (deviceClass && IMPORTANT_SENSOR_CLASS_SET.has(deviceClass)) {
      found.add(deviceClass);
    }
  }

  return [
    ...(['temperature', 'humidity'] as const).filter((sensorClass) => found.has(sensorClass)),
    ...IMPORTANT_SENSOR_CLASSES.filter((sensorClass) => found.has(sensorClass)),
  ];
}

function getAreaExcludedEntities(areaId: string, hass: HomeAssistant): string[] {
  const visibleEntityIds = new Set(
    Registry.getVisibleEntitiesForArea(areaId).map((entity) => entity.entity_id)
  );

  return Registry.getEntitiesForArea(areaId)
    .filter((entity) => hass.states[entity.entity_id] && !visibleEntityIds.has(entity.entity_id))
    .map((entity) => entity.entity_id);
}

function getAreaEnergyEntities(areaId: string, hass: HomeAssistant): string[] {
  const energyEntities: Array<{ entityId: string; order: number }> = [];

  for (const entity of Registry.getVisibleEntitiesForArea(areaId)) {
    const domain = entity.entity_id.split('.')[0];
    if (domain !== 'sensor') continue;

    const state = hass.states[entity.entity_id];
    const deviceClass = state?.attributes?.device_class as string | undefined;
    if (!deviceClass || !AREA_ENERGY_SENSOR_CLASS_SET.has(deviceClass)) continue;

    energyEntities.push({
      entityId: entity.entity_id,
      order: AREA_ENERGY_SENSOR_CLASSES.indexOf(deviceClass as (typeof AREA_ENERGY_SENSOR_CLASSES)[number]),
    });
  }

  return energyEntities
    .sort((a, b) => a.order - b.order || a.entityId.localeCompare(b.entityId))
    .map((entry) => entry.entityId);
}

function buildAreaEnergyCard(areaId: string, hass: HomeAssistant): LovelaceCardConfig | null {
  const entities = getAreaEnergyEntities(areaId, hass);
  if (entities.length === 0) return null;

  return {
    type: 'history-graph',
    title: localize('sections.energy'),
    entities,
    hours_to_show: 24,
    grid_options: { columns: 'full' },
  };
}

/**
 * Builds a single area card config for use in area sections.
 * Pre-filters controls and sensor_classes like HA does — the card
 * only gets what actually exists, avoiding expensive entity scanning at render.
 */
function buildAreaCard(area: AreaRegistryEntry, hass: HomeAssistant): LovelaceCardConfig {
  const controls = getAreaControls(area.area_id, hass);
  const sensorClasses = getAreaSensorClasses(area, hass);
  const excludeEntities = getAreaExcludedEntities(area.area_id, hass);

  // Pre-filter alert classes if enabled
  const alertClasses = Registry.config.show_alerts_on_areas
    ? getAreaAlertClasses(area.area_id, hass)
    : undefined;

  return {
    type: 'area',
    area: area.area_id,
    display_type: 'compact',
    sensor_classes: sensorClasses.length > 0 ? sensorClasses : undefined,
    alert_classes: alertClasses && alertClasses.length > 0 ? alertClasses : undefined,
    exclude_entities: excludeEntities.length > 0 ? excludeEntities : undefined,
    features: controls.length > 0 ? [{ type: 'area-controls', controls }] : [],
    features_position: 'inline',
    navigation_path: area.area_id,
    vertical: false,
    grid_options: { columns: 'full' },
  };
}

function buildAreaCards(area: AreaRegistryEntry, hass: HomeAssistant): LovelaceCardConfig[] {
  const cards = [buildAreaCard(area, hass)];
  const energyCard = buildAreaEnergyCard(area.area_id, hass);
  if (energyCard) cards.push(energyCard);
  return cards;
}

/**
 * Fallback floor icons based on HA's floor icons (mdi:home-floor-0 to mdi:home-floor-3, mdi:home-floor-negative-1).
 * HA doesn't provide a default icon for floors, but these are commonly used in custom floor plans.
 */
function getFloorIcon(level: number | null | undefined): string {
  if (level == null) return 'mdi:floor-plan';
  if (level === -1) return 'mdi:home-floor-negative-1';
  if (level >= 0 && level <= 3) return `mdi:home-floor-${level}`;
  return 'mdi:floor-plan';
}

/**
 * Creates the areas section(s).
 *
 * - Without floor grouping: returns a single section with all areas.
 * - With floor grouping: returns an array of sections, one per floor,
 *   plus an optional "Weitere Bereiche" section for areas without a floor.
 */
export function createAreasSection(
  visibleAreas: AreaRegistryEntry[],
  groupByFloors: boolean = false,
  hass: HomeAssistant | null = null
): LovelaceSectionConfig | LovelaceSectionConfig[] {
  // No floor grouping: flat list
  if (!groupByFloors || !hass) {
    return {
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading_style: 'title',
          heading: localize('sections.areas'),
        },
        ...visibleAreas.flatMap((area) => buildAreaCards(area, hass as HomeAssistant)),
      ],
    };
  }

  // Group areas by floor
  const areasByFloor = new Map<string, AreaRegistryEntry[]>();
  const areasWithoutFloor: AreaRegistryEntry[] = [];

  for (const area of visibleAreas) {
    if (area.floor_id) {
      if (!areasByFloor.has(area.floor_id)) {
        areasByFloor.set(area.floor_id, []);
      }
      areasByFloor.get(area.floor_id)?.push(area);
    } else {
      areasWithoutFloor.push(area);
    }
  }

  // Build sections per floor
  const sections: LovelaceSectionConfig[] = [];

  // Use HA's floor order from the registry. The hass.floors object preserves
  // the user-defined order from HA's "Reorder areas and floors" dialog via
  // Object.keys() insertion order — no separate sort_order field needed.
  const floorOrder = Object.keys(hass.floors);
  const sortedFloors = floorOrder.filter((id) => areasByFloor.has(id));

  for (const floorId of sortedFloors) {
    const areas = areasByFloor.get(floorId) ?? [];
    const floor = hass.floors[floorId] as (typeof hass.floors)[string] | undefined;
    const floorName = floor?.name || floorId;
    const floorIcon = floor?.icon || getFloorIcon(floor?.level);

    sections.push({
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading_style: 'title',
          heading: floorName,
          icon: floorIcon,
        },
        ...areas.flatMap((area) => buildAreaCards(area, hass)),
      ],
    });
  }

  // Areas without a floor
  if (areasWithoutFloor.length > 0) {
    sections.push({
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading_style: 'title',
          heading: localize('sections.areas_other'),
          icon: 'mdi:home-outline',
        },
        ...areasWithoutFloor.flatMap((area) => buildAreaCards(area, hass)),
      ],
    });
  }

  return sections;
}
