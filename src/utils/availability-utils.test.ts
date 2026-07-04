import { describe, expect, it } from 'vitest';
import { isUnavailableState, shouldHideUnavailableEntities } from './availability-utils';

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
});
