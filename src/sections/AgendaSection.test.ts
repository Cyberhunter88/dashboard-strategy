import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { createAgendaSection } from './AgendaSection';

function createHass(): HomeAssistant {
  const states = {
    'calendar.abfalltermine': {
      entity_id: 'calendar.abfalltermine',
      state: 'off',
      attributes: { start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
    },
    'calendar.test': {
      entity_id: 'calendar.test',
      state: 'off',
      attributes: {},
    },
  };
  const entities = Object.fromEntries(
    Object.keys(states).map((entityId) => [
      entityId,
      { entity_id: entityId, labels: [], hidden: false } as EntityRegistryEntry,
    ])
  );
  return {
    states,
    entities,
    devices: {},
    areas: {},
    floors: {},
    locale: { language: 'de' },
  } as unknown as HomeAssistant;
}

beforeEach(() => Registry.resetForTesting());

describe('createAgendaSection', () => {
  it('omits an empty calendar and keeps the upcoming calendar', () => {
    const hass = createHass();
    Registry.initialize(hass, {});

    const section = createAgendaSection(hass, true);
    expect(section?.cards?.some((card) => card.type === 'calendar')).toBe(true);
    expect(section?.cards?.find((card) => card.type === 'calendar')?.entities).toEqual(['calendar.abfalltermine']);
  });

  it('returns no section when no calendar has an upcoming event', () => {
    const hass = createHass();
    delete hass.states['calendar.abfalltermine'].attributes.start_time;
    Registry.initialize(hass, {});

    expect(createAgendaSection(hass, true)).toBeNull();
  });
});
