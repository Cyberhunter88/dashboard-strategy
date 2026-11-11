// ====================================================================
// Recent activity — latest motion, door, window and lock events
// ====================================================================
// Uses the native logbook card, so the list stays live without the
// strategy tracking state. Requires the logbook integration.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

const ACTIVITY_BINARY_SENSOR_CLASSES = new Set([
  'motion',
  'occupancy',
  'presence',
  'door',
  'window',
  'garage_door',
  'opening',
]);
const ACTIVITY_COVER_CLASSES = new Set(['door', 'garage', 'gate']);
/** Same opt-out label as the security log, so one label hides an entity from both. */
const ACTIVITY_EXCLUDE_LABEL = 'no_seclog';
/** The logbook card subscribes per entity; keep the subscription bounded. */
export const MAX_ACTIVITY_ENTITIES = 60;
const ACTIVITY_HOURS = 12;

export function collectActivityEntityIds(hass: HomeAssistant): string[] {
  const deviceClass = (id: string): unknown => hass.states[id]?.attributes?.device_class;
  const ids = [
    ...Registry.getVisibleEntityIdsForDomain('lock'),
    ...Registry.getVisibleEntityIdsForDomain('binary_sensor').filter((id) =>
      ACTIVITY_BINARY_SENSOR_CLASSES.has(String(deviceClass(id)))
    ),
    ...Registry.getVisibleEntityIdsForDomain('cover').filter((id) =>
      ACTIVITY_COVER_CLASSES.has(String(deviceClass(id)))
    ),
  ];
  return ids
    .filter((id) => Registry.getEntity(id)?.labels.includes(ACTIVITY_EXCLUDE_LABEL) !== true)
    .slice(0, MAX_ACTIVITY_ENTITIES);
}

export function createActivitySection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;
  if (!hass.config?.components?.includes('logbook')) return null;

  const entityIds = collectActivityEntityIds(hass);
  if (entityIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.activity'),
      icon: 'mdi:history',
    });
  }
  cards.push({
    type: 'logbook',
    entities: entityIds,
    target: { entity_id: entityIds },
    hours_to_show: ACTIVITY_HOURS,
    grid_options: { columns: 'full' },
  });

  return { type: 'grid', cards };
}
