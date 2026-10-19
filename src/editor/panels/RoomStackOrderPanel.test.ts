import { describe, expect, it } from 'vitest';
import { moveVisibleStack } from './RoomStackOrderPanel';
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
