import { describe, expect, it } from 'vitest';
import { hideFirstHeadingCard, withSectionVisibility } from './lovelace-utils';

describe('hideFirstHeadingCard', () => {
  it('removes the first heading card from a section', () => {
    const section = {
      type: 'grid',
      cards: [
        { type: 'heading', heading: 'Overview' },
        { type: 'tile', entity: 'light.kitchen' },
      ],
    };

    expect(hideFirstHeadingCard(section as any)).toEqual({
      type: 'grid',
      cards: [{ type: 'tile', entity: 'light.kitchen' }],
    });
  });

  it('keeps sections without a leading heading unchanged', () => {
    const section = {
      type: 'grid',
      cards: [{ type: 'tile', entity: 'light.kitchen' }],
    };

    expect(hideFirstHeadingCard(section as any)).toEqual(section);
  });
});

describe('withSectionVisibility', () => {
  it('adds a state visibility rule when both entity and state are present', () => {
    const section = { type: 'grid', cards: [] };

    expect(
      withSectionVisibility(section as any, {
        entity: 'input_boolean.guest_mode',
        state: 'on',
      })
    ).toEqual({
      type: 'grid',
      cards: [],
      visibility: [
        {
          condition: 'state',
          entity: 'input_boolean.guest_mode',
          state: 'on',
        },
      ],
    });
  });

  it('leaves the section untouched when the rule is incomplete', () => {
    const section = { type: 'grid', cards: [] };

    expect(withSectionVisibility(section as any, { entity: 'input_boolean.guest_mode' })).toEqual(section);
    expect(withSectionVisibility(section as any, { state: 'on' })).toEqual(section);
  });
});
