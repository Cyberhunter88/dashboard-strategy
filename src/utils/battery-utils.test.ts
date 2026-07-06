import { describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import { getBatteryStatus } from './battery-utils';

function createHass(states: HomeAssistant['states']): HomeAssistant {
  return {
    states,
    entities: {},
    devices: {},
    areas: {},
    floors: {},
  } as HomeAssistant;
}

describe('getBatteryStatus', () => {
  it('defaults unavailable batteries to the good bucket', () => {
    const hass = createHass({
      'sensor.window_battery': {
        entity_id: 'sensor.window_battery',
        state: 'unavailable',
        attributes: { device_class: 'battery', unit_of_measurement: '%' },
      } as any,
    });

    expect(getBatteryStatus(hass, 'sensor.window_battery', {})).toBe('good');
  });

  it('can bucket unavailable batteries as critical', () => {
    const hass = createHass({
      'sensor.window_battery': {
        entity_id: 'sensor.window_battery',
        state: 'unavailable',
        attributes: { device_class: 'battery', unit_of_measurement: '%' },
      } as any,
    });

    expect(
      getBatteryStatus(hass, 'sensor.window_battery', {
        unavailable_batteries_bucket: 'critical',
      })
    ).toBe('critical');
  });

  it('applies the same bucket rule to non-numeric states', () => {
    const hass = createHass({
      'sensor.window_battery': {
        entity_id: 'sensor.window_battery',
        state: 'n/a',
        attributes: { device_class: 'battery', unit_of_measurement: '%' },
      } as any,
    });

    expect(getBatteryStatus(hass, 'sensor.window_battery', {})).toBe('good');
    expect(
      getBatteryStatus(hass, 'sensor.window_battery', {
        unavailable_batteries_bucket: 'critical',
      })
    ).toBe('critical');
  });

  it('keeps binary battery sensors critical only when on', () => {
    const hass = createHass({
      'binary_sensor.remote_battery_low': {
        entity_id: 'binary_sensor.remote_battery_low',
        state: 'on',
        attributes: { device_class: 'battery' },
      } as any,
      'binary_sensor.remote_battery_ok': {
        entity_id: 'binary_sensor.remote_battery_ok',
        state: 'off',
        attributes: { device_class: 'battery' },
      } as any,
    });

    expect(getBatteryStatus(hass, 'binary_sensor.remote_battery_low', {})).toBe('critical');
    expect(getBatteryStatus(hass, 'binary_sensor.remote_battery_ok', {})).toBe('good');
  });
});
