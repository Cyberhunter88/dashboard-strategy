import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { CustomCard } from '../types/strategy';
import { renderParsedCustomCards } from './lovelace-utils';

export interface CustomCardAnchorOptions {
  title: string;
  icon: string;
  showHeading: boolean;
}

export function attachCustomCardsToSection(
  section: LovelaceSectionConfig | null,
  customCards: CustomCard[],
  anchor?: CustomCardAnchorOptions
): LovelaceSectionConfig | null {
  const rendered = renderParsedCustomCards(customCards, 'subtitle');
  if (section) {
    if (rendered.length > 0) {
      section.cards ??= [];
      section.cards.push(...rendered);
    }
    return section;
  }
  if (!anchor || rendered.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (anchor.showHeading) {
    cards.push({ type: 'heading', heading: anchor.title, heading_style: 'title', icon: anchor.icon });
  }
  cards.push(...rendered);
  return { type: 'grid', cards };
}
