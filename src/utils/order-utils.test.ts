import { describe, expect, it } from 'vitest';
import { mergeConfiguredOrder } from './order-utils';

describe('mergeConfiguredOrder', () => {
  it('removes unknown and duplicate keys and appends new defaults', () => {
    const defaults = ['overview', 'areas', 'weather'] as const;

    expect(
      mergeConfiguredOrder(['weather', 'removed', 'weather', 'overview'], defaults)
    ).toEqual(['weather', 'overview', 'areas']);
  });

  it('returns a copy of defaults when no stored order exists', () => {
    const defaults = ['overview', 'areas'] as const;
    const result = mergeConfiguredOrder(undefined, defaults);

    expect(result).toEqual(defaults);
    expect(result).not.toBe(defaults);
  });
});
