import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceViewConfig } from '../types/lovelace';
import { buildMissingAreaSection, buildRoomSection, pickStubArea, splitRoomSectionConfig } from './RoomSection';

describe('splitRoomSectionConfig', () => {
  it('separates section keys from pass-through dashboard options', () => {
    const split = splitRoomSectionConfig({
      type: 'custom:dashboard-strategy-room',
      area: 'kitchen',
      show_heading: false,
      show_locks_in_rooms: true,
    });
    expect(split).toEqual({ areaId: 'kitchen', showHeading: false, dashboardConfig: { show_locks_in_rooms: true } });
    expect(splitRoomSectionConfig({}).areaId).toBeUndefined();
    expect(splitRoomSectionConfig({}).showHeading).toBe(true);
  });
});

describe('pickStubArea', () => {
  it('picks the first area by name', () => {
    const areas = { b: { area_id: 'b', name: 'Bad' }, a: { area_id: 'a', name: 'Wohnzimmer' } };
    expect(pickStubArea({ areas } as unknown as HomeAssistant)).toBe('b');
    expect(pickStubArea({ areas: {} } as unknown as HomeAssistant)).toBeUndefined();
  });
});

describe('buildRoomSection', () => {
  const area = { area_id: 'kitchen', name: 'Kitchen', icon: 'mdi:stove' } as never;
  const view: LovelaceViewConfig = {
    badges: [
      { type: 'entity', entity: 'sensor.t', color: 'red', tap_action: { action: 'more-info' } },
      { type: 'alert', entity: 'binary_sensor.smoke', alert_color: 'red' },
    ],
    sections: [
      { type: 'grid', cards: [{ type: 'heading', heading: 'Lighting', heading_style: 'title' }, { type: 'tile' }] },
      { type: 'grid', cards: [{ type: 'heading', heading: 'Climate', heading_style: 'title' }] },
    ],
  };

  it('folds the room view into one grid section below a room title', () => {
    const section = buildRoomSection(view, area);
    expect(section.type).toBe('grid');
    expect(section.cards?.[0]).toEqual({
      type: 'heading',
      heading: 'Kitchen',
      heading_style: 'title',
      icon: 'mdi:stove',
      badges: [
        { type: 'entity', entity: 'sensor.t', color: 'red', tap_action: { action: 'more-info' } },
        { type: 'entity', entity: 'binary_sensor.smoke' },
      ],
    });
    expect(section.cards?.slice(1).map((c) => [c.type, c.heading_style])).toEqual([
      ['heading', 'subtitle'],
      ['tile', undefined],
      ['heading', 'subtitle'],
    ]);
  });

  it('keeps block titles when the room heading is disabled', () => {
    const section = buildRoomSection(view, area, false);
    expect(section.cards?.[0]).toMatchObject({ heading: 'Lighting', heading_style: 'title' });
    expect(section.cards).toHaveLength(3);
  });

  it('explains a missing area', () => {
    expect(buildMissingAreaSection(undefined).cards?.[0].type).toBe('markdown');
  });
});

describe('room section from the room view strategy', () => {
  type RoomGenerate = (config: unknown, hass: HomeAssistant) => Promise<LovelaceViewConfig>;
  let generate: RoomGenerate;

  beforeAll(async () => {
    const defined = new Map<string, { generate: RoomGenerate }>();
    Object.assign(globalThis, {
      HTMLElement: class {},
      customElements: {
        define: (name: string, ctor: { generate: RoomGenerate }) => defined.set(name, ctor),
        get: (name: string) => defined.get(name),
      },
    });
    await import('../views/RoomViewStrategy');
    generate = defined.get('ll-strategy-dashboard-strategy-view-room')!.generate;
  });

  beforeEach(() => Registry.resetForTesting());

  it('contains the room entities', async () => {
    const area = { area_id: 'office', name: 'Office' };
    const hass = makeHass({
      areas: [area],
      entities: [{ entity_id: 'light.office_desk', area_id: 'office', state: 'on' }],
    });
    Registry.initialize(hass, {});
    const view = await generate({ area, dashboardConfig: {} }, hass);
    const section = buildRoomSection(view, area as never);
    expect(section.cards?.[0]).toMatchObject({ type: 'heading', heading: 'Office' });
    expect(JSON.stringify(section.cards)).toContain('light.office_desk');
  });
});
