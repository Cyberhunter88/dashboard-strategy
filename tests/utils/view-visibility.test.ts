import { describe, expect, it } from 'vitest';

import { applyViewVisibility, unionVisibleUsers, userVisibilityConditions } from '../../src/utils/view-visibility';

describe('view visibility', () => {
  it('keeps unrestricted views unchanged', () => {
    expect(applyViewVisibility({ path: 'lights' }, {})).toEqual({ path: 'lights' });
  });

  it('maps allow-lists and explicit empty rules to native view visibility', () => {
    expect(applyViewVisibility({ path: 'lights' }, { view_visible_users: { lights: ['user-1'] } }).visible)
      .toEqual([{ user: 'user-1' }]);
    expect(applyViewVisibility({ path: 'lights' }, { view_visible_users: { lights: [] } }).visible).toBe(false);
  });

  it('unions restricted children but leaves a parent unrestricted when any child is unrestricted', () => {
    expect(unionVisibleUsers([['a'], ['b', 'a']])).toEqual(['a', 'b']);
    expect(unionVisibleUsers([['a'], undefined])).toBeUndefined();
    expect(userVisibilityConditions([])).toEqual([{ condition: 'user', users: [] }]);
  });
});
