import { describe, expect, it } from 'vitest';
import {
  applyBadgeGroupOptions,
  isBadgeCandidate,
  isEnergyBlockSensor,
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
      expect(isBadgeCandidate('sensor', deviceClass, undefined, `sensor.${deviceClass}`)).toBe(false);
    }
    expect(isBadgeCandidate('binary_sensor', 'gas', undefined, 'binary_sensor.gas')).toBe(true);
  });
});
