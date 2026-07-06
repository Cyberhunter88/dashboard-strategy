import { describe, expect, it } from 'vitest';

import { createOverviewView, createSectionsView } from './view-builder';

describe('view builder', () => {
  it('keeps dense section placement disabled by default', () => {
    const view = createSectionsView([{ type: 'grid', cards: [] }]);

    expect(view.dense_section_placement).toBeUndefined();
  });

  it('applies dense section placement when explicitly enabled', () => {
    const view = createSectionsView(
      [{ type: 'grid', cards: [] }],
      { dense_section_placement: true }
    );

    expect(view.dense_section_placement).toBe(true);
  });

  it('passes dense section placement through the overview builder', () => {
    const view = createOverviewView(
      [{ type: 'grid', cards: [] }],
      [],
      { dense_section_placement: true }
    );

    expect(view.type).toBe('sections');
    expect(view.dense_section_placement).toBe(true);
  });
});
