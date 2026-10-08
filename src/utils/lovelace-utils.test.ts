import { describe, expect, it } from 'vitest';
import { hideFirstHeadingCard, parsedConfigToSections, withSectionVisibility } from './lovelace-utils';

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

describe('parsedConfigToSections ownership', () => {
  it.each(['array', 'grid', 'sections', 'card'])('keeps %s input untouched when composing sections', async (shape) => {
    const { deepFreeze } = await import('../../tests/fixtures/weather-stacking');
    const cards = [{ type: 'tile', entity: 'sensor.fixture' }];
    const section = {
      type: 'grid',
      cards,
      visibility: [{ condition: 'state', entity: 'input_boolean.fixture', state: 'on' }],
    };
    const input =
      shape === 'array'
        ? cards
        : shape === 'grid'
          ? section
          : shape === 'sections'
            ? { sections: [section] }
            : cards[0];
    const original = JSON.stringify(input);
    deepFreeze(input);
    const first = parsedConfigToSections(input);
    const second = parsedConfigToSections(input);
    expect(first).toEqual(second);
    expect(first[0]).not.toBe(second[0]);
    expect(first[0].cards).not.toBe(second[0].cards);
    first[0].cards!.push({ type: 'markdown', content: 'Extra' });
    expect(second[0].cards).toHaveLength(1);
    expect(JSON.stringify(input)).toBe(original);
    if (shape === 'grid' || shape === 'sections') expect(second[0].visibility).toEqual(section.visibility);
  });
});
