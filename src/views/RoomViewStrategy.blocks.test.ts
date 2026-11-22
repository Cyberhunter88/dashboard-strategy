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

describe('room motion badges', () => {
  const hall = { area_id: 'hallway', name: 'Hallway' };
  const hallHass = makeHass({
    areas: [hall],
    devices: [
      { id: 'dev_ground', area_id: 'hallway' },
      { id: 'dev_upper', area_id: 'hallway' },
      { id: 'dev_cam', area_id: 'hallway' },
    ],
    entities: [
      { entity_id: 'binary_sensor.hall_ground', device_id: 'dev_ground', attributes: { device_class: 'motion' } },
      { entity_id: 'binary_sensor.hall_upper', device_id: 'dev_upper', attributes: { device_class: 'motion' } },
      { entity_id: 'binary_sensor.cam_motion', device_id: 'dev_cam', attributes: { device_class: 'motion' } },
      { entity_id: 'binary_sensor.cam_person', device_id: 'dev_cam', attributes: { device_class: 'motion' } },
    ],
  });

  it('shows one motion badge per device', async () => {
    const dashboardConfig = {};
    Registry.initialize(hallHass, dashboardConfig);
    const view = await generate({ area: hall, dashboardConfig }, hallHass);
    expect((view.badges ?? []).map((b) => (typeof b === 'string' ? b : b.entity))).toEqual([
      'binary_sensor.hall_ground',
      'binary_sensor.hall_upper',
      'binary_sensor.cam_motion',
    ]);
  });
});

describe('room temperature and battery badges', () => {
  const living = {
    area_id: 'living',
    name: 'Living',
    temperature_entity_id: 'sensor.trv_temperature',
    humidity_entity_id: 'sensor.diag_humidity',
  };
  const livingHass = makeHass({
    areas: [living],
    entities: [
      {
        entity_id: 'sensor.trv_temperature',
        area_id: 'living',
        state: '21.5',
        labels: ['no_dboard'],
        attributes: { device_class: 'temperature', unit_of_measurement: '°C' },
      },
      {
        entity_id: 'sensor.diag_humidity',
        area_id: 'living',
        state: '45',
        entity_category: 'diagnostic',
        attributes: { device_class: 'humidity', unit_of_measurement: '%' },
      },
      {
        entity_id: 'sensor.remote_battery',
        area_id: 'living',
        state: '25',
        attributes: { device_class: 'battery', unit_of_measurement: '%' },
      },
      {
        entity_id: 'binary_sensor.labeled_motion',
        area_id: 'living',
        state: 'off',
        labels: ['no_dboard'],
        attributes: { device_class: 'motion' },
      },
    ],
  });
  const badgeIds = (view: LovelaceViewConfig) => (view.badges ?? []).map((b) => (typeof b === 'string' ? b : b.entity));

  it('drops a no_dboard area temperature but keeps a diagnostic area humidity', async () => {
    const dashboardConfig = {};
    Registry.initialize(livingHass, dashboardConfig);
    const view = await generate({ area: living, dashboardConfig }, livingHass);
    expect(badgeIds(view)).toEqual(['sensor.diag_humidity']);
  });

  it('applies the configured critical battery threshold to room badges', async () => {
    const dashboardConfig = { battery_critical_threshold: 30 };
    Registry.initialize(livingHass, dashboardConfig);
    const view = await generate({ area: living, dashboardConfig }, livingHass);
    expect(badgeIds(view)).toEqual(['sensor.diag_humidity', 'sensor.remote_battery']);
  });
});
