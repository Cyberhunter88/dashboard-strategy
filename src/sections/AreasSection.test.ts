import { describe, expect, it } from 'vitest';

import { buildAreaCard, resolveAreaDisplayType } from './AreasSection';
import { Registry } from '../Registry';
import type { AreaRegistryEntry } from '../types/registries';
import { makeHass } from '../../tests/fixtures/hass';

function area(picture: string | null = null): AreaRegistryEntry {
  return { area_id: 'living_room', name: 'Living room', picture } as AreaRegistryEntry;
}

describe('area card display type', () => {
  it('keeps compact as the backwards-compatible default', () => {
    expect(resolveAreaDisplayType(area('/local/living.jpg'), {})).toBe('compact');
  });

  it('uses picture mode only when the area has a picture', () => {
    expect(resolveAreaDisplayType(area('/local/living.jpg'), { area_display_type: 'picture' })).toBe('picture');
    expect(resolveAreaDisplayType(area(), { area_display_type: 'picture' })).toBe('compact');
  });

  it('allows a per-area override in both directions', () => {
    expect(
      resolveAreaDisplayType(area('/local/living.jpg'), {
        areas_options: { living_room: { display_type: 'picture' } },
      })
    ).toBe('picture');
    expect(
      resolveAreaDisplayType(area('/local/living.jpg'), {
        area_display_type: 'picture',
        areas_options: { living_room: { display_type: 'compact' } },
      })
    ).toBe('compact');
  });
});

describe('area card sensors', () => {
  it('drops a no_dboard area temperature and never excludes a shown area sensor', () => {
    Object.assign(globalThis, { window: { location: { pathname: '/dashboard-test/home' } } });
    const living = {
      area_id: 'living',
      name: 'Living',
      temperature_entity_id: 'sensor.trv_temperature',
      humidity_entity_id: 'sensor.diag_humidity',
    };
    const hass = makeHass({
      areas: [living],
      entities: [
        { entity_id: 'sensor.trv_temperature', area_id: 'living', state: '21', labels: ['no_dboard'] },
        { entity_id: 'sensor.diag_humidity', area_id: 'living', state: '40', entity_category: 'diagnostic' },
      ],
    });
    Registry.resetForTesting();
    Registry.initialize(hass, {});
    const card = buildAreaCard(hass.areas.living, hass);
    expect(card.sensor_classes).toEqual(['humidity']);
    expect(card.exclude_entities).toEqual(['sensor.trv_temperature']);
  });
});

describe('area card sensor replacement', () => {
  it('hands the native card the replacement sensor when the assigned one is labeled', () => {
    Object.assign(globalThis, { window: { location: { pathname: '/dashboard-test/home' } } });
    const bath = { area_id: 'bath', name: 'Bath', temperature_entity_id: 'sensor.trv_temperature' };
    const hass = makeHass({
      areas: [bath],
      devices: [
        { id: 'dev_trv', area_id: 'bath', labels: ['no_dboard'] },
        { id: 'dev_thermometer', area_id: 'bath' },
      ],
      entities: [
        {
          entity_id: 'sensor.trv_temperature',
          device_id: 'dev_trv',
          state: '19',
          attributes: { device_class: 'temperature', unit_of_measurement: '°C' },
        },
        {
          entity_id: 'sensor.thermometer_temperature',
          device_id: 'dev_thermometer',
          state: '21',
          attributes: { device_class: 'temperature', unit_of_measurement: '°C' },
        },
      ],
    });
    Registry.resetForTesting();
    Registry.initialize(hass, {});
    const card = buildAreaCard(hass.areas.bath, hass);
    expect(card.sensor_classes).toEqual(['temperature']);
    expect(card.area_sensor_overrides).toEqual({ temperature_entity_id: 'sensor.thermometer_temperature' });
    expect(card.exclude_entities).toEqual(['sensor.trv_temperature']);
  });
});
