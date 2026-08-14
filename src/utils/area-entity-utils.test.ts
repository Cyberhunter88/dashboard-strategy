import { describe, expect, it } from 'vitest';

import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { createRoomEntities } from './area-entity-utils';
import { getEditableAreaEntities } from './area-entity-utils';
import { Registry } from '../Registry';
import { makeHass } from '../../tests/fixtures/hass';

describe('createRoomEntities', () => {
  it('deduplicates automatically generated room entities by entity_id', () => {
    const camera = {
      entity_id: 'camera.driveway',
    } as EntityRegistryEntry;
    const light = {
      entity_id: 'light.driveway',
    } as EntityRegistryEntry;
    const hass = {
      states: {
        'camera.driveway': { attributes: {} },
        'light.driveway': { attributes: {} },
      },
    } as unknown as HomeAssistant;

    const result = createRoomEntities([camera, camera, light, light], hass, []);

    expect(result.cameras).toEqual(['camera.driveway']);
    expect(result.lights).toEqual(['light.driveway']);
  });

  it('classifies humidifiers, valves, and water heaters into room misc groups', () => {
    const humidifier = {
      entity_id: 'humidifier.office',
    } as EntityRegistryEntry;
    const valve = {
      entity_id: 'valve.radiator',
    } as EntityRegistryEntry;
    const waterHeater = {
      entity_id: 'water_heater.boiler',
    } as EntityRegistryEntry;
    const hass = {
      states: {
        'humidifier.office': { attributes: {} },
        'valve.radiator': { attributes: {} },
        'water_heater.boiler': { attributes: {} },
      },
    } as unknown as HomeAssistant;

    const result = createRoomEntities([humidifier, valve, waterHeater], hass, []);

    expect(result.humidifier).toEqual(['humidifier.office']);
    expect(result.valve).toEqual(['valve.radiator']);
    expect(result.water_heater).toEqual(['water_heater.boiler']);
  });

  it('groups lawn mowers with vacuums for room rendering', () => {
    const vacuum = { entity_id: 'vacuum.downstairs' } as EntityRegistryEntry;
    const mower = { entity_id: 'lawn_mower.garden' } as EntityRegistryEntry;
    const hass = {
      states: {
        'vacuum.downstairs': { attributes: {} },
        'lawn_mower.garden': { attributes: {} },
      },
    } as unknown as HomeAssistant;

    const result = createRoomEntities([vacuum, mower], hass, []);

    expect(result.vacuum).toEqual(['vacuum.downstairs', 'lawn_mower.garden']);
  });
});

describe('getEditableAreaEntities', () => {
  it('excludes config and diagnostic registry entities from editor pickers', () => {
    const hass = makeHass({
      areas: [{ area_id: 'office', name: 'Office' }],
      entities: [
        { entity_id: 'sensor.visible', area_id: 'office', state: '1' },
        { entity_id: 'select.config', area_id: 'office', state: 'auto', entity_category: 'config' },
        { entity_id: 'sensor.diagnostic', area_id: 'office', state: 'ok', entity_category: 'diagnostic' },
      ],
    });
    Registry.resetForTesting();
    expect(getEditableAreaEntities('office', hass, {}).map((entry) => entry.entity_id))
      .toEqual(['sensor.visible']);
  });
});
