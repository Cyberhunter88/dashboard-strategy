import { describe, expect, it } from 'vitest';
import type { AreaRegistryEntry } from '../types/registries';

import { mergeStacksOrder, normalizeAreasDisplay, sortLights, stripAreaName } from './name-utils';

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
    expect(
      normalizeAreasDisplay(areas, {
        hidden: ['cams', 'garten', 'garten'],
        order: ['wohnzimmer', 'cams', 'wohnzimmer', 'innen_kameras'],
        nav_items: ['garten', 'cams', 'innen_kameras', 'garten'],
      })
    ).toEqual({
      hidden: ['garten'],
      order: ['wohnzimmer', 'innen_kameras'],
      nav_items: ['garten', 'innen_kameras'],
    });
  });

  it('returns undefined when no valid area ids remain', () => {
    expect(
      normalizeAreasDisplay(areas, {
        hidden: ['cams'],
        order: ['deleted_area'],
        nav_items: ['missing'],
      })
    ).toBeUndefined();
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
      sortLights(a, b, hass, 'name', (entityId) => (entityId === 'light.kitchen_ceiling' ? 'Ceiling' : 'Accent'))
    );

    expect(ids).toEqual(['light.accent', 'light.kitchen_ceiling']);
  });
});

describe('stripAreaName with device-prefixed names (HA 2026.11)', () => {
  const area = { area_id: 'k', name: 'Küche' } as AreaRegistryEntry;
  const h = (name: string, deviceName = 'Deckenlampe') =>
    ({
      states: { 'light.a': { entity_id: 'light.a', state: 'on', attributes: { friendly_name: name } } },
      entities: { 'light.a': { entity_id: 'light.a', device_id: 'd1' } },
      devices: { d1: { id: 'd1', name: deviceName } },
    }) as any;

  it('removes the device name prefix', () => {
    expect(stripAreaName('light.a', area, h('Deckenlampe Licht'))).toBe('Licht');
  });
  it('removes area and device prefix together', () => {
    expect(stripAreaName('light.a', area, h('Küche Deckenlampe Licht'))).toBe('Licht');
  });
  it('keeps the name when only the device name would remain empty', () => {
    expect(stripAreaName('light.a', area, h('Deckenlampe'))).toBe('Deckenlampe');
  });
  it('keeps the name without a device', () => {
    const noDevice = { ...h('Deckenlampe Licht'), entities: {} };
    expect(stripAreaName('light.a', area, noDevice)).toBe('Deckenlampe Licht');
  });
});
