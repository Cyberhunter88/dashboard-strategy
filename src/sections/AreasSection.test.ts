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
  it('shows the area settings temperature even with a no_dboard label and never excludes it', () => {
    Object.assign(globalThis, { window: { location: { pathname: '/dashboard-test/home' } } });
    const living = {
      area_id: 'living',
      name: 'Living',
      temperature_entity_id: 'sensor.trv_temperature',
      humidity_entity_id: 'sensor.trv_humidity',
    };
    const hass = makeHass({
      areas: [living],
      entities: [
        { entity_id: 'sensor.trv_temperature', area_id: 'living', state: '21', labels: ['no_dboard'] },
        { entity_id: 'sensor.trv_humidity', area_id: 'living', state: '40', hidden_by: 'user' },
        { entity_id: 'sensor.other', area_id: 'living', state: '1', labels: ['no_dboard'] },
      ],
    });
    Registry.resetForTesting();
    Registry.initialize(hass, {});
    const card = buildAreaCard(hass.areas.living, hass);
    expect(card.sensor_classes).toEqual(['temperature']);
    expect(card.exclude_entities).toEqual(['sensor.trv_humidity', 'sensor.other']);
  });
});
