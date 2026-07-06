import { afterEach, describe, expect, it, vi } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { getBatteryEntities } from './entity-filter';

function createHass(
  states: HomeAssistant['states'],
  entities: HomeAssistant['entities']
): HomeAssistant {
  return {
    states,
    entities,
    devices: {},
    areas: {},
    floors: {},
  } as HomeAssistant;
}

describe('getBatteryEntities', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters Battery Notes helper entities when configured', () => {
    const hass = createHass(
      {
        'sensor.notes_battery': {
          entity_id: 'sensor.notes_battery',
          state: '25',
          attributes: { device_class: 'battery', unit_of_measurement: '%' },
        } as any,
        'sensor.real_battery': {
          entity_id: 'sensor.real_battery',
          state: '30',
          attributes: { device_class: 'battery', unit_of_measurement: '%' },
        } as any,
      },
      {
        'sensor.notes_battery': {
          entity_id: 'sensor.notes_battery',
          labels: [],
          platform: 'battery_notes',
        } as EntityRegistryEntry,
        'sensor.real_battery': {
          entity_id: 'sensor.real_battery',
          labels: [],
          platform: 'zha',
        } as EntityRegistryEntry,
      }
    );

    vi.spyOn(Registry, 'getEntityIdsForDomain').mockImplementation((domain: string) => {
      if (domain === 'sensor') return ['sensor.notes_battery', 'sensor.real_battery'];
      if (domain === 'binary_sensor') return [];
      return [];
    });
    vi.spyOn(Registry, 'isExcludedByLabel').mockReturnValue(false);
    vi.spyOn(Registry, 'isHiddenByConfig').mockReturnValue(false);
    vi.spyOn(Registry, 'getEntity').mockImplementation((entityId: string) => hass.entities[entityId]);

    expect(getBatteryEntities(hass, {})).toEqual(['sensor.notes_battery', 'sensor.real_battery']);
    expect(getBatteryEntities(hass, { hide_battery_notes_entities: true })).toEqual(['sensor.real_battery']);
  });
});
