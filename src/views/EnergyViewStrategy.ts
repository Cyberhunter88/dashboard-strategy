// ====================================================================
// VIEW STRATEGY — ENERGY (top consumers and per-room energy sensors)
// ====================================================================
// Reuses the room energy block detection (power, energy, water, gas), so
// the view shows exactly the sensors the room views already group.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import type { LovelaceCardConfig, LovelaceSectionConfig, LovelaceViewConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { isEnergyBlockSensor } from '../utils/badge-utils';
import { localize } from '../utils/localize';
import { getVisibleAreasFromHass, normalizeAreasDisplay } from '../utils/name-utils';
import { isRoomNavigationAvailable } from '../utils/room-visibility';
import { createEnergySection } from '../sections/WeatherEnergySection';
import { createSectionsView } from '../utils/view-builder';
import { defineViewStrategy } from './view-strategy-base';

/** Never a wall of tiles: the ranking only helps while it stays short. */
export const MAX_TOP_CONSUMERS = 8;

const POWER_UNIT_FACTORS: Readonly<Record<string, number>> = { W: 1, kW: 1000, MW: 1_000_000, mW: 0.001 };

/** Current power draw in watts, or null when the state is not a usable power reading. */
export function powerInWatts(hass: HomeAssistant, entityId: string): number | null {
  const state = hass.states[entityId];
  if (!state || state.attributes?.device_class !== 'power') return null;
  const factor = POWER_UNIT_FACTORS[String(state.attributes?.unit_of_measurement ?? '')];
  const value = Number.parseFloat(state.state);
  if (factor === undefined || Number.isNaN(value)) return null;
  return value * factor;
}

function energyTile(entityId: string): LovelaceCardConfig {
  return { type: 'tile', entity: entityId, vertical: false, state_content: ['state', 'last_changed'] };
}

/**
 * Power sensors with the highest draw when the dashboard was generated.
 * The order is a snapshot; the tiles themselves stay live.
 */
export function collectTopConsumers(hass: HomeAssistant): string[] {
  return Registry.getVisibleEntityIdsForDomain('sensor')
    .map((entityId) => ({ entityId, watts: powerInWatts(hass, entityId) }))
    .filter((entry): entry is { entityId: string; watts: number } => entry.watts !== null && entry.watts > 0)
    .sort((a, b) => b.watts - a.watts || a.entityId.localeCompare(b.entityId))
    .slice(0, MAX_TOP_CONSUMERS)
    .map((entry) => entry.entityId);
}

function buildTopConsumersSection(hass: HomeAssistant): LovelaceSectionConfig | null {
  const entityIds = collectTopConsumers(hass);
  if (entityIds.length === 0) return null;
  return {
    type: 'grid',
    cards: [
      {
        type: 'heading',
        heading: localize('energy_view.top_consumers'),
        heading_style: 'title',
        icon: 'mdi:flash',
      },
      ...entityIds.map((entityId) => energyTile(entityId)),
    ],
  };
}

function buildAreaSections(hass: HomeAssistant, config: Simon42StrategyConfig): LovelaceSectionConfig[] {
  const areasDisplay = normalizeAreasDisplay(Object.values(hass.areas), config.areas_display);
  const sections: LovelaceSectionConfig[] = [];

  for (const area of getVisibleAreasFromHass(hass, areasDisplay, config.use_default_area_sort)) {
    const entityIds = Registry.getVisibleEntitiesForArea(area.area_id)
      .map((entry) => entry.entity_id)
      .filter((entityId) => {
        const state = hass.states[entityId];
        return (
          !!state && isEnergyBlockSensor(entityId.split('.')[0], state.attributes?.device_class as string | undefined)
        );
      });
    if (entityIds.length === 0) continue;

    sections.push({
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading: area.name,
          heading_style: 'title',
          icon: area.icon || 'mdi:floor-plan',
          ...(isRoomNavigationAvailable(config, hass, area.area_id)
            ? { tap_action: { action: 'navigate', navigation_path: area.area_id } }
            : {}),
        },
        ...entityIds.map((entityId) => energyTile(entityId)),
      ],
    });
  }

  return sections;
}

export function buildEnergyView(hass: HomeAssistant, config: Simon42StrategyConfig): LovelaceViewConfig {
  const sections: LovelaceSectionConfig[] = [];

  // The native distribution card needs the energy integration to be set up.
  if (hass.config?.components?.includes('energy')) {
    const distribution = createEnergySection(true, config.energy_link_dashboard !== false, true, false);
    if (distribution) sections.push(distribution);
  }

  const topConsumers = buildTopConsumersSection(hass);
  if (topConsumers) sections.push(topConsumers);
  sections.push(...buildAreaSections(hass, config));

  if (sections.length === 0) {
    sections.push({ type: 'grid', cards: [{ type: 'markdown', content: localize('energy_view.empty') }] });
  }

  return createSectionsView(sections, config);
}

async function generateEnergyView(
  config: { config?: Simon42StrategyConfig },
  hass: HomeAssistant
): Promise<LovelaceViewConfig> {
  const strategyConfig = config.config || {};
  if (!Registry.isCurrent(hass, strategyConfig)) Registry.initialize(hass, strategyConfig);
  return buildEnergyView(hass, strategyConfig);
}

defineViewStrategy('ll-strategy-dashboard-strategy-view-energy', generateEnergyView);
