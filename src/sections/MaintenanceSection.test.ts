import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { createMaintenanceSection } from './MaintenanceSection';

function createHass(entities: EntityRegistryEntry[]): HomeAssistant {
  const states = Object.fromEntries(
    entities.map((entry) => [
      entry.entity_id,
      { entity_id: entry.entity_id, state: 'on', attributes: {} },
    ])
  );

  return {
    states,
    entities: Object.fromEntries(entities.map((entry) => [entry.entity_id, entry])),
    devices: {},
    areas: {},
    floors: {},
    locale: { language: 'en' },
  } as HomeAssistant;
}

beforeEach(() => Registry.resetForTesting());

describe('createMaintenanceSection', () => {
  it('includes pending updates categorized as config', () => {
    const hass = createHass([
      {
        entity_id: 'update.firmware',
        entity_category: 'config',
        hidden: false,
        labels: [],
      } as EntityRegistryEntry,
    ]);
    Registry.initialize(hass, {});

    const section = createMaintenanceSection(hass, true);

    expect(section?.cards?.some((card) => card.entity === 'update.firmware')).toBe(true);
  });
});
