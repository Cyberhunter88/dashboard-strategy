import { describe, expect, it } from 'vitest';
import {
  applyBadgeGroupOptions,
  classifyBadgeSensor,
  getAreaPrimarySensorIssue,
  isCriticalBatteryBadge,
  isEnergyBlockSensor,
  resolveAreaPrimarySensor,
  selectBadgeEntitiesOfType,
} from './badge-utils';
import { makeHass } from '../../tests/fixtures/hass';

describe('badge regressions', () => {
  it('keeps one automatic sensor per type until manually curated', () => {
    const ids = ['sensor.lux_1', 'sensor.lux_2', 'sensor.lux_3'];
    expect(selectBadgeEntitiesOfType(ids, new Set())).toEqual(['sensor.lux_1']);
    expect(selectBadgeEntitiesOfType(ids, new Set(['sensor.lux_3']))).toEqual(['sensor.lux_1', 'sensor.lux_2']);
  });

  it('keeps one automatic badge per device when a device key is given', () => {
    const devices: Record<string, string | undefined> = {
      'binary_sensor.hall_ground': 'dev_ground',
      'binary_sensor.hall_upper': 'dev_upper',
      'binary_sensor.cam_motion': 'dev_cam',
      'binary_sensor.cam_person': 'dev_cam',
      'binary_sensor.template_motion': undefined,
    };
    const ids = Object.keys(devices);
    const key = (id: string) => devices[id];
    expect(selectBadgeEntitiesOfType(ids, new Set(), key)).toEqual([
      'binary_sensor.hall_ground',
      'binary_sensor.hall_upper',
      'binary_sensor.cam_motion',
      'binary_sensor.template_motion',
    ]);
    expect(selectBadgeEntitiesOfType(ids, new Set(['binary_sensor.cam_motion']), key)).toEqual([
      'binary_sensor.hall_ground',
      'binary_sensor.hall_upper',
      'binary_sensor.cam_person',
      'binary_sensor.template_motion',
    ]);
  });

  it('applies hidden and additional badges without mutating candidates', () => {
    const hass = makeHass({
      entities: [{ entity_id: 'sensor.co2', state: '500', attributes: { device_class: 'carbon_dioxide' } }],
    });
    const input = [{ entity: 'sensor.lux', color: 'amber' }];
    expect(applyBadgeGroupOptions(input, { hidden: ['sensor.lux'], additional: ['sensor.co2'] }, hass)).toEqual([
      { entity: 'sensor.co2', color: 'green' },
    ]);
    expect(input).toHaveLength(1);
  });

  it('routes energy classes away from automatic badges', () => {
    for (const deviceClass of ['power', 'energy', 'water', 'gas']) {
      expect(isEnergyBlockSensor('sensor', deviceClass)).toBe(true);
      expect(classifyBadgeSensor('sensor', deviceClass, undefined, `sensor.${deviceClass}`)).toBeNull();
    }
    expect(classifyBadgeSensor('binary_sensor', 'gas', undefined, 'binary_sensor.gas')).toBe('gas');
  });

  it('classifies sensors into one shared set of badge buckets', () => {
    expect(classifyBadgeSensor('sensor', 'temperature', '°C', 'sensor.t')).toBeNull();
    expect(classifyBadgeSensor('sensor', 'humidity', '%', 'sensor.h')).toBeNull();
    expect(classifyBadgeSensor('sensor', undefined, 'g/m³', 'sensor.abs')).toBe('absolute_humidity');
    expect(classifyBadgeSensor('sensor', 'battery', '%', 'sensor.b')).toBe('battery');
    expect(classifyBadgeSensor('sensor', 'energy', 'kWh', 'sensor.battery_energy')).toBeNull();
    expect(classifyBadgeSensor('sensor', 'carbon_dioxide', 'ppm', 'sensor.x')).toBe('co2');
    expect(classifyBadgeSensor('sensor', undefined, 'lx', 'sensor.lux')).toBe('illuminance');
    expect(classifyBadgeSensor('binary_sensor', 'presence', undefined, 'binary_sensor.p')).toBe('occupancy');
    expect(classifyBadgeSensor('binary_sensor', 'moisture', undefined, 'binary_sensor.leak')).toBeNull();
    expect(classifyBadgeSensor('light', undefined, undefined, 'light.lux')).toBeNull();
  });

  it('uses the configured critical battery threshold', () => {
    expect(isCriticalBatteryBadge('19')).toBe(true);
    expect(isCriticalBatteryBadge('20')).toBe(false);
    expect(isCriticalBatteryBadge('25', 30)).toBe(true);
    expect(isCriticalBatteryBadge('unavailable', 30)).toBe(false);
  });

  it('keeps no_dboard strict for area settings sensors but lets them win over softer exclusions', () => {
    const hass = makeHass({
      entities: [
        { entity_id: 'sensor.labeled_temp', state: '21', labels: ['no_dboard'] },
        { entity_id: 'sensor.upstream_label', state: '21', labels: ['no-dboard'] },
        { entity_id: 'sensor.diag_hum', state: '40', entity_category: 'diagnostic' },
        { entity_id: 'sensor.hidden_temp', state: '20', hidden_by: 'user' },
      ],
    });
    const area = { temperature_entity_id: 'sensor.labeled_temp', humidity_entity_id: 'sensor.diag_hum' };
    expect(resolveAreaPrimarySensor(area, 'temperature', hass)).toBeNull();
    expect(resolveAreaPrimarySensor(area, 'humidity', hass)).toBe('sensor.diag_hum');
    expect(resolveAreaPrimarySensor({ temperature_entity_id: 'sensor.hidden_temp' }, 'temperature', hass)).toBeNull();
    expect(resolveAreaPrimarySensor({ temperature_entity_id: null }, 'temperature', hass)).toBeNull();
    expect(getAreaPrimarySensorIssue(hass, 'sensor.labeled_temp')).toBe('label');
    expect(getAreaPrimarySensorIssue(hass, 'sensor.upstream_label')).toBe('label');
    expect(getAreaPrimarySensorIssue(hass, 'sensor.hidden_temp')).toBe('hidden');
    expect(getAreaPrimarySensorIssue(hass, 'sensor.gone')).toBe('missing');
  });
});
