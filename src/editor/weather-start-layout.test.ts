import { describe, expect, it } from 'vitest';
import {
  buildLegacyWeatherStartLayoutItems,
  computeWeatherStartAreaOptions,
  computeWeatherStartFloorOptions,
  countNestedFixedGrids,
  getCustomCardRef,
  getWeatherStartItemMeta,
  isWeatherStartBlockDisabled,
  isWeatherStartItemDisabled,
  normalizeWeatherStartLayoutItems,
} from './weather-start-layout';
import type { AreaRegistryEntry, FloorRegistryEntry } from '../types/registries';

const area = (area_id: string, name: string, floor_id: string | null = null) =>
  ({ area_id, name, floor_id, icon: null }) as AreaRegistryEntry;
const areas = {
  kitchen: area('kitchen', 'Kitchen', 'eg'),
  bath: area('bath', 'Bath', 'og'),
  shed: area('shed', 'Shed'),
};
const floors = {
  og: { floor_id: 'og', name: 'Upper', level: 1, icon: null },
  eg: { floor_id: 'eg', name: 'Ground', level: 0, icon: 'mdi:home-floor-0' },
  attic: { floor_id: 'attic', name: 'Attic', level: 2, icon: null },
} as unknown as Record<string, FloorRegistryEntry>;

describe('weather-start layout helpers', () => {
  it('orders visible areas and drops hidden ones', () => {
    const options = computeWeatherStartAreaOptions(areas, ['shed'], ['bath']);
    expect(options.map((entry) => entry.area_id)).toEqual(['bath', 'kitchen']);
    expect(computeWeatherStartAreaOptions(undefined, [], [])).toEqual([]);
  });

  it('lists only used floors by level and adds an other-areas entry', () => {
    const options = computeWeatherStartFloorOptions(floors, Object.values(areas));
    expect(options.map((entry) => entry.floor_id)).toEqual(['eg', 'og', null]);
    expect(computeWeatherStartFloorOptions(floors, [areas.kitchen]).map((entry) => entry.floor_id)).toEqual(['eg']);
  });

  it('marks built-in blocks disabled from the config', () => {
    expect(isWeatherStartBlockDisabled({ show_clock_card: false }, 'clock')).toBe(true);
    expect(isWeatherStartBlockDisabled({}, 'clock')).toBe(false);
    expect(isWeatherStartBlockDisabled({}, 'favorites')).toBe(true);
    expect(isWeatherStartBlockDisabled({ favorite_entities: ['light.a'] }, 'favorites')).toBe(false);
    expect(isWeatherStartBlockDisabled({}, 'summaries')).toBe(false);
  });

  it('builds legacy items for areas, floors and custom content', () => {
    const areaOptions = computeWeatherStartAreaOptions(areas, [], []);
    const floorOptions = computeWeatherStartFloorOptions(floors, areaOptions);
    const flat = buildLegacyWeatherStartLayoutItems(
      { weather_start_order: ['clock', 'areas', 'custom_cards'], custom_cards: [{ yaml: 'type: tile' }] },
      areaOptions,
      floorOptions
    );
    expect(flat.map((item) => item.id)).toEqual([
      'clock',
      'area-bath',
      'area-kitchen',
      'area-shed',
      'custom-card-legacy-custom-card-0',
    ]);
    const byFloor = buildLegacyWeatherStartLayoutItems(
      { weather_start_order: ['areas'], group_by_floors: true },
      areaOptions,
      floorOptions
    );
    expect(byFloor.map((item) => item.id)).toEqual(['floor-eg', 'floor-og', 'floor-none']);
  });

  it('normalizes stored items against the live areas', () => {
    const areaOptions = computeWeatherStartAreaOptions(areas, ['shed'], []);
    const floorOptions = computeWeatherStartFloorOptions(floors, areaOptions);
    const result = normalizeWeatherStartLayoutItems(
      [
        { id: 'clock', type: 'clock' },
        { id: 'area-bath', type: 'area', area_id: 'bath' },
        { id: 'area-bath-again', type: 'area', area_id: 'bath' },
        { id: 'area-shed', type: 'area', area_id: 'shed' },
        { id: 'floor-attic', type: 'floor', floor_id: 'attic' },
      ],
      {},
      areaOptions,
      floorOptions
    );
    // Duplicate, hidden area and empty floor vanish; the missing kitchen is appended.
    expect(result.map((item) => item.id)).toEqual(['clock', 'area-bath', 'area-kitchen']);
  });

  it('labels and disables items', () => {
    const areaOptions = computeWeatherStartAreaOptions(areas, [], []);
    const floorOptions = computeWeatherStartFloorOptions(floors, areaOptions);
    const card = { id: 'c1', yaml: 'type: tile', editor_title: 'My card' };
    expect(getCustomCardRef(card, 3)).toBe('c1');
    expect(
      getWeatherStartItemMeta(
        { id: 'x', type: 'custom_card', custom_card_id: 'c1' },
        areaOptions,
        floorOptions,
        [card],
        []
      ).label
    ).toBe('My card');
    expect(
      getWeatherStartItemMeta({ id: 'f', type: 'floor', floor_id: 'eg' }, areaOptions, floorOptions, [], []).icon
    ).toBe('mdi:home-floor-0');
    expect(
      isWeatherStartItemDisabled({ id: 'x', type: 'custom_card', custom_card_id: 'c1' }, {}, areaOptions, [card], [])
    ).toBe(true);
    expect(
      isWeatherStartItemDisabled(
        { id: 'x', type: 'custom_card', custom_card_id: 'c1' },
        {},
        areaOptions,
        [{ ...card, parsed_config: { type: 'tile' } }],
        []
      )
    ).toBe(false);
    expect(isWeatherStartItemDisabled({ id: 'f', type: 'floor', floor_id: 'attic' }, {}, areaOptions, [], [])).toBe(
      true
    );
    expect(isWeatherStartItemDisabled({ id: 'clock', type: 'clock' }, { show_clock_card: false }, [], [], [])).toBe(
      true
    );
  });

  it('counts nested fixed-column grids below the top level', () => {
    expect(countNestedFixedGrids({ type: 'grid', columns: 2, cards: [{ type: 'grid', columns: 3 }] })).toBe(1);
    expect(countNestedFixedGrids([{ type: 'grid', cards: [{ type: 'grid', columns: 2 }] }])).toBe(1);
    expect(countNestedFixedGrids(null)).toBe(0);
  });
});
