import { describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import { isRoomViewVisible } from './room-visibility';

const hass = { states: { 'input_boolean.guests': { state: 'on' } } } as unknown as HomeAssistant;

describe('room visibility', () => {
  it('keeps rooms without complete rules visible', () => {
    expect(isRoomViewVisible({}, hass, 'guest')).toBe(true);
    expect(isRoomViewVisible({ room_visibility: { guest: { entity: '', state: '' } } }, hass, 'guest')).toBe(true);
  });

  it('matches the configured entity state and hides missing entities', () => {
    const config = { room_visibility: { guest: { entity: 'input_boolean.guests', state: 'on' } } };
    expect(isRoomViewVisible(config, hass, 'guest')).toBe(true);
    expect(isRoomViewVisible(config, { states: {} } as HomeAssistant, 'guest')).toBe(false);
  });
});
