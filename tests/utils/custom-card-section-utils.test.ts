import { describe, expect, it } from 'vitest';
import { attachCustomCardsToSection } from '../../src/utils/custom-card-section-utils';

describe('attachCustomCardsToSection', () => {
  const customCards = [{ parsed_config: { type: 'markdown', content: 'custom' } }];

  it('keeps assigned custom cards when their generated section auto-hides', () => {
    const section = attachCustomCardsToSection(null, customCards, {
      title: 'Plants',
      icon: 'mdi:flower-tulip',
      showHeading: true,
    });

    expect(section?.cards).toEqual([
      { type: 'heading', heading: 'Plants', heading_style: 'title', icon: 'mdi:flower-tulip' },
      { type: 'markdown', content: 'custom' },
    ]);
  });

  it('does not create an anchor when the section is deliberately disabled', () => {
    expect(attachCustomCardsToSection(null, customCards)).toBeNull();
  });

  it('attaches cards to a section without an existing cards array', () => {
    const section = attachCustomCardsToSection({ type: 'grid' }, customCards);
    expect(section?.cards).toEqual([{ type: 'markdown', content: 'custom' }]);
  });
});
