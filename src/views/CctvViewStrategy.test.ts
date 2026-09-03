import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry, DeviceRegistryEntry } from '../types/registries';

let buildCctvActivitySection: typeof import('./CctvViewStrategy').buildCctvActivitySection;
let collectCameraActivityEntityIds: typeof import('./CctvViewStrategy').collectCameraActivityEntityIds;

beforeAll(async () => {
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: () => undefined },
  });
  ({ buildCctvActivitySection, collectCameraActivityEntityIds } = await import('./CctvViewStrategy'));
});

beforeEach(() => Registry.resetForTesting());

function hass(withLogbook: boolean, withActivity: boolean): HomeAssistant {
  const states: Record<string, { entity_id: string; state: string; attributes: Record<string, unknown> }> = {
    'camera.front': { entity_id: 'camera.front', state: 'idle', attributes: {} },
  };
  const entities: Record<string, EntityRegistryEntry> = {
    'camera.front': { entity_id: 'camera.front', device_id: 'camera-device', labels: [], hidden: false },
  };
  if (withActivity) {
    states['binary_sensor.front_person'] = {
      entity_id: 'binary_sensor.front_person',
      state: 'on',
      attributes: { device_class: 'occupancy' },
    };
    entities['binary_sensor.front_person'] = {
      entity_id: 'binary_sensor.front_person',
      device_id: 'camera-device',
      labels: [],
      hidden: false,
    };
  }

  const devices = {
    'camera-device': {
      id: 'camera-device',
      config_entries: [],
      connections: [],
      identifiers: [],
      manufacturer: 'Test',
      model: 'Camera',
      model_id: null,
      name: 'Front camera',
      name_by_user: null,
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
    } as DeviceRegistryEntry,
  };

  const instance = {
    states,
    entities,
    devices,
    areas: {},
    floors: {},
    config: { components: withLogbook ? ['logbook'] : [], version: '2026.9.0' },
    locale: { language: 'en' },
  } as unknown as HomeAssistant;
  Registry.initialize(instance, {});
  return instance;
}

describe('CCTV activity', () => {
  const blocks = [{ cameraId: 'camera.front', deviceId: 'camera-device', isReolink: false }];

  it('requires both logbook and a matching camera activity entity', () => {
    expect(buildCctvActivitySection(hass(false, true), { cctv_show_activity: true }, blocks)).toBeNull();
    expect(buildCctvActivitySection(hass(true, false), { cctv_show_activity: true }, blocks)).toBeNull();
  });

  it('scopes the activity log to sensors belonging to the camera device', () => {
    const instance = hass(true, true);
    expect(collectCameraActivityEntityIds(instance, blocks)).toEqual(['binary_sensor.front_person']);
    const section = buildCctvActivitySection(instance, { cctv_show_activity: true }, blocks);
    const logbook = section?.cards?.find((card) => card.type === 'logbook');
    expect(logbook?.target).toEqual({ entity_id: ['binary_sensor.front_person'] });
  });
});
