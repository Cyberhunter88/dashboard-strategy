import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import {
  getCalendarEntitiesWithUpcomingEvents,
  hasEnergyCapability,
  resolveAutomaticFeatures,
  resolveFeatureToggle,
} from './feature-availability';

function createHass(
  states: Record<string, { state: string; attributes?: Record<string, unknown> }>
): HomeAssistant {
  const entities = Object.fromEntries(
    Object.keys(states).map((entityId) => [
      entityId,
      { entity_id: entityId, labels: [], hidden: false } as EntityRegistryEntry,
    ])
  );
  return {
    states: Object.fromEntries(
      Object.entries(states).map(([entityId, value]) => [entityId, { entity_id: entityId, ...value }])
    ),
    entities,
    devices: {},
    areas: {},
    floors: {},
    config: { version: '2026.9.0' },
    locale: { language: 'de' },
  } as unknown as HomeAssistant;
}

beforeEach(() => Registry.resetForTesting());

describe('feature availability', () => {
  it('keeps explicit values authoritative', () => {
    expect(resolveFeatureToggle(false, true)).toBe(false);
    expect(resolveFeatureToggle(true, false)).toBe(true);
    expect(resolveFeatureToggle(undefined, true)).toBe(true);
    expect(resolveFeatureToggle(undefined, false)).toBe(false);
  });

  it('selects only calendars with a current or upcoming event', () => {
    const hass = createHass({
      'calendar.future': {
        state: 'off',
        attributes: { start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
      },
      'calendar.empty': { state: 'off', attributes: {} },
    });
    Registry.initialize(hass, {});

    expect(getCalendarEntitiesWithUpcomingEvents(hass)).toEqual(['calendar.future']);
    expect(getCalendarEntitiesWithUpcomingEvents(hass, ['calendar.empty'])).toEqual([]);
  });

  it('detects valid energy sensors but ignores non-numeric values', () => {
    const withPower = createHass({
      'sensor.power': { state: '42', attributes: { device_class: 'power', unit_of_measurement: 'W' } },
    });
    Registry.initialize(withPower, {});
    expect(hasEnergyCapability(withPower)).toBe(true);

    const withoutPower = createHass({
      'sensor.old_plug': { state: 'unknown', attributes: { device_class: 'power' } },
    });
    Registry.initialize(withoutPower, {});
    expect(hasEnergyCapability(withoutPower)).toBe(false);
  });

  it('automatically enables available overview features and preserves false', () => {
    const hass = createHass({
      'calendar.family': {
        state: 'off',
        attributes: { start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
      },
      'climate.living_room': { state: 'heat', attributes: {} },
      'update.firmware': { state: 'on', attributes: {} },
    });
    Registry.initialize(hass, {});

    expect(resolveAutomaticFeatures({}, hass)).toMatchObject({
      show_agenda_section: true,
      show_climate_summary: true,
      show_maintenance_section: true,
      show_maintenance_view: true,
    });
    expect(
      resolveAutomaticFeatures(
        {
          show_search_card: false,
          show_agenda_section: false,
          show_climate_summary: false,
          show_maintenance_section: false,
          show_maintenance_view: false,
        },
        hass
      )
    ).toMatchObject({
      show_agenda_section: false,
      show_search_card: false,
      show_climate_summary: false,
      show_maintenance_section: false,
      show_maintenance_view: false,
    });
  });

  it('does not enable maintenance without usable maintenance data', () => {
    const hass = createHass({});
    Registry.initialize(hass, {});

    expect(resolveAutomaticFeatures({}, hass)).toMatchObject({
      show_covers_summary: false,
      show_plants_section: false,
      show_todos_section: false,
      show_vacuums_section: false,
      show_maintenance_section: false,
      show_maintenance_view: false,
    });
  });

  it('removes unavailable or missing pollen entities from generated sections', () => {
    const hass = createHass({
      'sensor.pollen_grass': { state: 'low', attributes: {} },
      'sensor.pollen_tree': { state: 'unavailable', attributes: {} },
    });
    Registry.initialize(hass, {});

    expect(
      resolveAutomaticFeatures(
        { pollen_entities: ['sensor.pollen_grass', 'sensor.pollen_tree', 'sensor.pollen_missing'] },
        hass
      ).pollen_entities
    ).toEqual(['sensor.pollen_grass']);
  });
});
