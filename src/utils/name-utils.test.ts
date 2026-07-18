import { describe, expect, it } from 'vitest';
import type { AreaRegistryEntry } from '../types/registries';

import { mergeStacksOrder, normalizeAreasDisplay, sortLights } from './name-utils';

const areas: AreaRegistryEntry[] = [
  { area_id: 'wohnzimmer', name: 'Wohnzimmer' } as AreaRegistryEntry,
  { area_id: 'garten', name: 'Garten' } as AreaRegistryEntry,
  { area_id: 'innen_kameras', name: 'Innen Kameras' } as AreaRegistryEntry,
];

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

describe('normalizeAreasDisplay', () => {
  it('drops invalid and duplicate area ids from display lists', () => {
    expect(normalizeAreasDisplay(areas, {
      hidden: ['cams', 'garten', 'garten'],
      order: ['wohnzimmer', 'cams', 'wohnzimmer', 'innen_kameras'],
      nav_items: ['garten', 'cams', 'innen_kameras', 'garten'],
    })).toEqual({
      hidden: ['garten'],
      order: ['wohnzimmer', 'innen_kameras'],
      nav_items: ['garten', 'innen_kameras'],
    });
  });

  it('returns undefined when no valid area ids remain', () => {
    expect(normalizeAreasDisplay(areas, {
      hidden: ['cams'],
      order: ['deleted_area'],
      nav_items: ['missing'],
    })).toBeUndefined();
  });
});

describe('mergeStacksOrder', () => {
  it('adds the switches stack to existing saved orders without reordering them', () => {
    expect(mergeStacksOrder(['lights', 'misc'])).toEqual([
      'lights',
      'misc',
      'ups',
      'energy',
      'cameras',
      'locks',
      'climate',
      'covers',
      'covers_window',
      'media',
      'scenes',
      'switches',
      'room_pins',
    ]);
  });
});

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
