import { describe, expect, it } from 'vitest';

import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { createRoomEntities } from './area-entity-utils';

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
});
