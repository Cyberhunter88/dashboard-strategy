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

describe('strict no_dboard with room sensor replacement', () => {
  const bath = {
    area_id: 'bath',
    name: 'Bath',
    temperature_entity_id: 'sensor.trv_temperature',
    humidity_entity_id: 'sensor.trv_humidity',
  };
  const temp = (entity_id: string, device_id: string | null, state = '20.5') => ({
    entity_id,
    device_id,
    area_id: device_id ? undefined : 'bath',
    state,
    attributes: { device_class: 'temperature', unit_of_measurement: '°C' },
  });
  const bathHass = makeHass({
    areas: [bath, { area_id: 'server', name: 'Server' }],
    devices: [
      { id: 'dev_trv', area_id: 'bath', labels: ['no_dboard'] },
      { id: 'dev_wall_trv', area_id: 'bath' },
      { id: 'dev_thermometer', area_id: 'bath' },
      { id: 'dev_disk', area_id: 'server' },
    ],
    entities: [
      temp('sensor.trv_temperature', 'dev_trv'),
      {
        entity_id: 'sensor.trv_humidity',
        device_id: 'dev_trv',
        state: '40',
        attributes: { device_class: 'humidity', unit_of_measurement: '%' },
      },
      { entity_id: 'climate.trv', device_id: 'dev_trv', state: 'heat' },
      { entity_id: 'climate.wall_trv', device_id: 'dev_wall_trv', state: 'heat' },
      temp('sensor.a_wall_trv_temperature', 'dev_wall_trv'),
      temp('sensor.a_smoothed_temperature', null),
      temp('sensor.z_thermometer_temperature', 'dev_thermometer'),
      {
        entity_id: 'sensor.temperature_change',
        area_id: 'bath',
        state: '0.1',
        attributes: { unit_of_measurement: 'K/min' },
      },
      temp('sensor.disk_temperature', 'dev_disk', '43'),
    ],
  });
  const badgeIds = (view: LovelaceViewConfig) => (view.badges ?? []).map((b) => (typeof b === 'string' ? b : b.entity));

  it('hides every entity of a no_dboard device', () => {
    Registry.initialize(bathHass, {});
    const visible = Registry.getVisibleEntitiesForArea('bath').map((entity) => entity.entity_id);
    expect(visible).not.toContain('sensor.trv_temperature');
    expect(visible).not.toContain('climate.trv');
    expect(visible).toContain('climate.wall_trv');
  });

  it('replaces a labeled area sensor with the best visible room sensor', async () => {
    const dashboardConfig = {};
    Registry.initialize(bathHass, dashboardConfig);
    const view = await generate({ area: bath, dashboardConfig }, bathHass);
    // Room thermometer beats a thermostat sensor and a device-less helper;
    // there is no visible humidity replacement, so no humidity badge.
    expect(badgeIds(view)).toEqual(['sensor.z_thermometer_temperature']);
  });

  it('prefers a thermostat sensor over a helper and never guesses for unassigned rooms', async () => {
    const withoutThermometer = makeHass({
      areas: [bath, { area_id: 'server', name: 'Server' }],
      devices: [
        { id: 'dev_trv', area_id: 'bath', labels: ['no_dboard'] },
        { id: 'dev_wall_trv', area_id: 'bath' },
        { id: 'dev_disk', area_id: 'server' },
      ],
      entities: [
        temp('sensor.trv_temperature', 'dev_trv'),
        { entity_id: 'climate.wall_trv', device_id: 'dev_wall_trv', state: 'heat' },
        temp('sensor.a_smoothed_temperature', null),
        temp('sensor.z_wall_trv_temperature', 'dev_wall_trv'),
        temp('sensor.disk_temperature', 'dev_disk', '43'),
      ],
    });
    const dashboardConfig = {};
    Registry.initialize(withoutThermometer, dashboardConfig);
    const view = await generate({ area: bath, dashboardConfig }, withoutThermometer);
    expect(badgeIds(view)).toEqual(['sensor.z_wall_trv_temperature']);

    const server = await generate({ area: withoutThermometer.areas.server, dashboardConfig }, withoutThermometer);
    expect(badgeIds(server)).toEqual([]);
  });
});

describe('room smoke detector alert badge', () => {
  const attic = { area_id: 'attic', name: 'Attic' };
  const smokeHass = (version?: string): HomeAssistant => {
    const base = makeHass({
      areas: [attic],
      entities: [
        {
          entity_id: 'binary_sensor.attic_smoke',
          area_id: 'attic',
          state: 'off',
          attributes: { device_class: 'smoke' },
        },
      ],
    });
    return { ...base, config: { ...base.config, ...(version ? { version } : {}) } } as HomeAssistant;
  };
  const smokeBadge = (view: LovelaceViewConfig) =>
    (view.badges ?? []).find((b) => typeof b === 'object' && b.entity === 'binary_sensor.attic_smoke') as
      Record<string, unknown> | undefined;

  it('uses the native alert badge from Home Assistant 2026.11 on', async () => {
    const hass = smokeHass('2026.11.3');
    Registry.initialize(hass, {});
    const view = await generate({ area: attic, dashboardConfig: {} }, hass);
    expect(smokeBadge(view)).toMatchObject({ type: 'alert', alert_color: 'red', pulse: true });
  });

  it('keeps the entity badge on older Home Assistant', async () => {
    const hass = smokeHass('2026.10.4');
    Registry.initialize(hass, {});
    const view = await generate({ area: attic, dashboardConfig: {} }, hass);
    expect(smokeBadge(view)).toMatchObject({ type: 'entity', color: 'red' });
  });
});

describe('room go2rtc camera streams', () => {
  function webrtcCards(view: LovelaceViewConfig) {
    return (view.sections ?? []).flatMap((section) =>
      (section.cards ?? []).filter((card) => card.type === 'custom:webrtc-camera')
    );
  }

  it('renders entity-less streams in the camera block with WebRTC defaults', async () => {
    const dashboardConfig = {
      areas_options: {
        kitchen: { camera_streams: ['kitchen_cam', { url: 'kitchen_wide', name: 'Wide', mode: 'mse' }, { name: 'x' }] },
      },
    };
    Registry.initialize(hass, dashboardConfig);
    const view = await generate({ area, dashboardConfig }, hass);
    expect(headings(view)).toContain('Cameras');
    expect(webrtcCards(view)).toEqual([
      expect.objectContaining({ url: 'kitchen_cam', title: 'kitchen_cam', mode: 'webrtc,mse', background: false }),
      expect.objectContaining({ url: 'kitchen_wide', title: 'Wide', mode: 'mse' }),
    ]);
    expect(webrtcCards(view)[1]).not.toHaveProperty('name');
  });

  it('respects show_cameras_in_rooms: false', async () => {
    const dashboardConfig = { show_cameras_in_rooms: false, areas_options: { kitchen: { camera_streams: ['cam'] } } };
    Registry.initialize(hass, dashboardConfig);
    const view = await generate({ area, dashboardConfig }, hass);
    expect(webrtcCards(view)).toEqual([]);
  });
});
