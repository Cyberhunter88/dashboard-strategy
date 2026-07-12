import { describe, expect, it } from 'vitest';
import { createEntityRenderKey } from './entity-render-key';

describe('createEntityRenderKey', () => {
  it('stays stable for unchanged entities and structural metadata', () => {
    const fingerprints = new Map([
      ['light.kitchen', ['light.table']],
      ['light.table', []],
    ]);

    const first = createEntityRenderKey(['light.kitchen', 'light.table'], (id) => fingerprints.get(id));
    const second = createEntityRenderKey(['light.kitchen', 'light.table'], (id) => fingerprints.get(id));

    expect(second).toBe(first);
  });

  it('changes when a nested group membership changes', () => {
    const members = ['light.table'];
    const before = createEntityRenderKey(['light.kitchen'], () => members);
    members.push('light.counter');
    const after = createEntityRenderKey(['light.kitchen'], () => members);

    expect(after).not.toBe(before);
  });

  it('changes when a floor or device placement fingerprint changes', () => {
    let placement = 'ground-floor';
    const before = createEntityRenderKey(['cover.patio'], () => placement);
    placement = 'upper-floor';
    const after = createEntityRenderKey(['cover.patio'], () => placement);

    expect(after).not.toBe(before);
  });
});
