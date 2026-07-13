import { describe, expect, it } from 'vitest';

import { applyDesign } from '../../src/utils/design';

describe('applyDesign', () => {
  it('returns the same view when no design is configured', () => {
    const view = { path: 'home', sections: [] };
    expect(applyDesign(view, {})).toBe(view);
  });

  it('applies theme and background independently', () => {
    const background = { image: '/local/bg.jpg', opacity: 40, attachment: 'fixed' as const };
    expect(applyDesign({ path: 'home' }, { theme: 'dark', background }))
      .toEqual({ path: 'home', theme: 'dark', background });
  });

  it('preserves view-level design', () => {
    const own = { image: '/local/own.jpg' };
    expect(applyDesign({ path: 'custom', theme: 'own', background: own }, {
      theme: 'global', background: { image: '/local/global.jpg' },
    })).toEqual({ path: 'custom', theme: 'own', background: own });
  });

  it('ignores backgrounds without an image', () => {
    const view = { path: 'home' };
    expect(applyDesign(view, { background: { opacity: 40 } })).toBe(view);
  });
});
