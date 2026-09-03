import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { resolveAutomaticFeatures, resolveFeatureToggle } from './feature-availability';

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

  it('automatically enables only the generated maintenance view', () => {
    const hass = createHass({
      'update.firmware': { state: 'on', attributes: {} },
      'climate.living_room': { state: 'heat', attributes: {} },
      'calendar.family': { state: 'off', attributes: {} },
    });
    Registry.initialize(hass, {});

    expect(resolveAutomaticFeatures({}, hass)).toMatchObject({ show_maintenance_view: true });
    expect(resolveAutomaticFeatures({}, hass)).not.toHaveProperty('show_search_card');
    expect(resolveAutomaticFeatures({}, hass)).not.toHaveProperty('show_agenda_section');
    expect(resolveAutomaticFeatures({}, hass)).not.toHaveProperty('show_climate_summary');
  });

  it('does not enable maintenance without usable maintenance data', () => {
    const hass = createHass({});
    Registry.initialize(hass, {});

    expect(resolveAutomaticFeatures({}, hass)).toMatchObject({ show_maintenance_view: false });
  });

  it('preserves an explicit maintenance view choice', () => {
    const hass = createHass({ 'update.firmware': { state: 'on', attributes: {} } });
    Registry.initialize(hass, {});

    expect(resolveAutomaticFeatures({ show_maintenance_view: false }, hass).show_maintenance_view).toBe(false);
    expect(resolveAutomaticFeatures({ show_maintenance_view: true }, createHass({})).show_maintenance_view).toBe(true);
  });
});
