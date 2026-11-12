import { describe, expect, it } from 'vitest';
import type { LovelaceViewConfig } from '../types/lovelace';
import type { HomeAssistant } from '../types/homeassistant';
import {
  isEntityCurrentlyAvailable,
  isUnavailableState,
  shouldHideUnavailableEntities,
  withUnavailableEntitiesHidden,
} from './availability-utils';

describe('availability helpers', () => {
  it('recognizes only Home Assistant unavailable states', () => {
    expect(isUnavailableState('unavailable')).toBe(true);
    expect(isUnavailableState('unknown')).toBe(true);
    expect(isUnavailableState('off')).toBe(false);
    expect(isUnavailableState(undefined)).toBe(false);
  });

  it('requires the availability option to be explicitly enabled', () => {
    expect(shouldHideUnavailableEntities({ hide_unavailable_entities: true })).toBe(true);
    expect(shouldHideUnavailableEntities({ hide_unavailable_entities: false })).toBe(false);
    expect(shouldHideUnavailableEntities()).toBe(false);
  });

  it('treats unknown as normal for domains without a resting state', () => {
    expect(isUnavailableState('unknown', 'button.restart')).toBe(false);
    expect(isUnavailableState('unavailable', 'button.restart')).toBe(true);
    expect(isUnavailableState('unknown', 'scene.evening')).toBe(false);
    expect(isUnavailableState('unknown', 'siren.hall')).toBe(false);
    expect(isUnavailableState('unknown', 'sensor.temperature')).toBe(true);
  });

  it('keeps never-pressed buttons visible while hiding offline ones', () => {
    const hass = {
      states: {
        'button.restart': { state: 'unknown' },
        'button.offline': { state: 'unavailable' },
        'sensor.value': { state: 'unknown' },
      },
    } as unknown as HomeAssistant;
    const config = { hide_unavailable_entities: true };
    expect(isEntityCurrentlyAvailable(hass, 'button.restart', config)).toBe(true);
    expect(isEntityCurrentlyAvailable(hass, 'button.offline', config)).toBe(false);
    expect(isEntityCurrentlyAvailable(hass, 'sensor.value', config)).toBe(false);
  });

  it('only adds the unavailable condition to button cards', () => {
    const view = {
      cards: [
        { type: 'tile', entity: 'button.restart' },
        { type: 'tile', entity: 'sensor.value' },
      ],
    } as LovelaceViewConfig;
    const result = withUnavailableEntitiesHidden(view, { hide_unavailable_entities: true });
    expect(result.cards?.[0].visibility).toEqual([
      { condition: 'state', entity: 'button.restart', state_not: 'unavailable' },
    ]);
    expect(result.cards?.[1].visibility).toEqual([
      { condition: 'state', entity: 'sensor.value', state_not: 'unavailable' },
      { condition: 'state', entity: 'sensor.value', state_not: 'unknown' },
    ]);
  });
});
