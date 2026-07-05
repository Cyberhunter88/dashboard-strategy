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
});
