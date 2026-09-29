import { describe, expect, it } from 'vitest';
import { countOpenCoverEntities, isCoverRelevantForGroup, isIndeterminateCoverState } from './cover-state-utils';
import { makeHass } from '../../tests/fixtures/hass';

describe('cover state grouping', () => {
  it('keeps indeterminate covers visible in the open group', () => {
    expect(isIndeterminateCoverState('unknown')).toBe(true);
    expect(isCoverRelevantForGroup('unknown', undefined, 'open', false)).toBe(true);
    expect(isCoverRelevantForGroup('unavailable', undefined, 'open', false)).toBe(false);
  });

  it('keeps moving covers in a visible group at endpoint transitions', () => {
    expect(isCoverRelevantForGroup('opening', 0, 'partially_open', true)).toBe(true);
    expect(isCoverRelevantForGroup('closing', 100, 'partially_open', true)).toBe(true);
    expect(isCoverRelevantForGroup('closing', 0, 'closed', true)).toBe(true);
  });

  it('counts unknown covers as open, matching the covers view', () => {
    const hass = makeHass({
      entities: [
        { entity_id: 'cover.unknown', state: 'unknown' },
        { entity_id: 'cover.closed', state: 'closed' },
        { entity_id: 'cover.unavailable', state: 'unavailable' },
      ],
    });
    expect(countOpenCoverEntities(hass, new Set(['cover.unknown', 'cover.closed', 'cover.unavailable']), {})).toBe(1);
  });

  it('keeps unknown covers in the open group even with a partial position', () => {
    expect(isCoverRelevantForGroup('unknown', 50, 'open', true)).toBe(true);
    expect(isCoverRelevantForGroup('unknown', 50, 'partially_open', true)).toBe(false);
  });
});
