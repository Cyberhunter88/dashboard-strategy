import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceViewConfig } from '../types/lovelace';

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
  await import('./RoomViewStrategy');
  generate = defined.get('ll-strategy-dashboard-strategy-view-room')!.generate;
});

beforeEach(() => Registry.resetForTesting());

const area = { area_id: 'kitchen', name: 'Kitchen' };
const hass = makeHass({
  areas: [area],
  entities: [
    { entity_id: 'input_boolean.guest_mode', area_id: 'kitchen' },
    { entity_id: 'timer.oven', area_id: 'kitchen' },
    { entity_id: 'binary_sensor.kitchen_motion', area_id: 'kitchen', attributes: { device_class: 'motion' } },
    { entity_id: 'binary_sensor.kitchen_leak', area_id: 'kitchen', attributes: { device_class: 'moisture' } },
  ],
});

function headings(view: LovelaceViewConfig): string[] {
  return (view.sections ?? []).flatMap((section) =>
    (section.cards ?? []).filter((card) => card.type === 'heading').map((card) => card.heading as string)
  );
}

function entitiesUnder(view: LovelaceViewConfig, heading: string): string[] {
  const section = (view.sections ?? []).find((s) =>
    s.cards?.some((c) => c.type === 'heading' && c.heading === heading)
  );
  return (section?.cards ?? []).filter((card) => card.type === 'tile').map((card) => card.entity as string);
}

describe('room helpers and sensors blocks', () => {
  it('stays unchanged without the opt-in options', async () => {
    const dashboardConfig = {};
    Registry.initialize(hass, dashboardConfig);
    const view = await generate({ area, dashboardConfig }, hass);
    expect(headings(view)).not.toContain('Helpers & controls');
    expect(headings(view)).not.toContain('Detectors & sensors');
  });

  it('renders both blocks when enabled and respects hidden group entities', async () => {
    const dashboardConfig = {
      show_helpers_section_in_rooms: true,
      show_sensors_section_in_rooms: true,
      areas_options: { kitchen: { groups_options: { helpers: { hidden: ['timer.oven'] } } } },
    };
    Registry.initialize(hass, dashboardConfig);
    const view = await generate({ area, dashboardConfig }, hass);
    expect(entitiesUnder(view, 'Helpers & controls')).toEqual(['input_boolean.guest_mode']);
    expect(entitiesUnder(view, 'Detectors & sensors').sort()).toEqual([
      'binary_sensor.kitchen_leak',
      'binary_sensor.kitchen_motion',
    ]);
  });
});
