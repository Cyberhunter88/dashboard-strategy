import { describe, expect, it } from 'vitest';
import { moveVisibleStack, presentStackKeys } from './RoomStackOrderPanel';
import type { StackKey } from '../../types/strategy';

describe('room stack keyboard ordering', () => {
  const order: StackKey[] = ['lights', 'energy', 'covers', 'cameras'];
  const visible = new Set<StackKey>(['lights', 'covers', 'cameras']);

  it('moves among visible stacks without moving an inactive stack', () => {
    expect(moveVisibleStack(order, visible, 'covers', -1)).toEqual(['covers', 'energy', 'lights', 'cameras']);
    expect(moveVisibleStack(order, visible, 'covers', 1)).toEqual(['lights', 'energy', 'cameras', 'covers']);
    expect(order).toEqual(['lights', 'energy', 'covers', 'cameras']);
  });

  it('does not change the order at either edge or for an inactive stack', () => {
    expect(moveVisibleStack(order, visible, 'lights', -1)).toBe(order);
    expect(moveVisibleStack(order, visible, 'cameras', 1)).toBe(order);
    expect(moveVisibleStack(order, visible, 'energy', 1)).toBe(order);
  });
});

describe('presentStackKeys', () => {
  it('offers the misc stack for humidifiers, valves and water heaters', () => {
    for (const key of ['humidifier', 'valve', 'water_heater']) {
      expect(presentStackKeys({ [key]: ['x.y'] }, {}).has('misc')).toBe(true);
    }
  });

  it('offers helper and sensor stacks only when their room option is enabled', () => {
    const grouped = { helpers: ['input_boolean.a'], binary_sensors: ['binary_sensor.b'] };
    expect(presentStackKeys(grouped, {}).has('helpers')).toBe(false);
    expect(presentStackKeys(grouped, {}).has('sensors')).toBe(false);
    const enabled = presentStackKeys(grouped, {
      show_helpers_section_in_rooms: true,
      show_sensors_section_in_rooms: true,
    });
    expect(enabled.has('helpers')).toBe(true);
    expect(enabled.has('sensors')).toBe(true);
  });
});
