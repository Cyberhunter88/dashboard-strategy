import { describe, expect, it } from 'vitest';

import { sortLights } from './name-utils';

const hass = {
  states: {
    'light.kitchen_ceiling': {
      entity_id: 'light.kitchen_ceiling',
      state: 'on',
      last_changed: '2026-07-06T08:00:00Z',
      attributes: { friendly_name: 'Alpha Ceiling' },
    },
    'light.accent': {
      entity_id: 'light.accent',
      state: 'on',
      last_changed: '2026-07-06T09:00:00Z',
      attributes: { friendly_name: 'Zulu Accent' },
    },
  },
} as any;

describe('sortLights', () => {
  it('sorts by last_changed by default', () => {
    const ids = ['light.kitchen_ceiling', 'light.accent'];

    ids.sort((a, b) => sortLights(a, b, hass, undefined));

    expect(ids).toEqual(['light.accent', 'light.kitchen_ceiling']);
  });

  it('sorts alphabetically when requested', () => {
    const ids = ['light.kitchen_ceiling', 'light.accent'];

    ids.sort((a, b) => sortLights(a, b, hass, 'name'));

    expect(ids).toEqual(['light.kitchen_ceiling', 'light.accent']);
  });

  it('supports custom display names for room-local sorting', () => {
    const ids = ['light.kitchen_ceiling', 'light.accent'];

    ids.sort((a, b) =>
      sortLights(a, b, hass, 'name', (entityId) =>
        entityId === 'light.kitchen_ceiling' ? 'Ceiling' : 'Accent'
      )
    );

    expect(ids).toEqual(['light.accent', 'light.kitchen_ceiling']);
  });
});
