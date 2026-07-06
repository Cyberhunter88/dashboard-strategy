// ====================================================================
// Lovelace config helpers
// ====================================================================

import type { LovelaceCardConfig, LovelaceCondition, LovelaceSectionConfig } from '../types/lovelace';

interface HeadingCardOptions {
  heading_style?: LovelaceCardConfig['heading_style'];
  icon?: string;
}

export interface ParsedCustomCardLike {
  title?: string;
  parsed_config?: Record<string, any> | Record<string, any>[] | null;
  _yaml_error?: string;
}

export function createHeadingCard(
  heading: string,
  options: HeadingCardOptions = {}
): LovelaceCardConfig {
  return {
    type: 'heading',
    heading,
    ...options,
  };
}

export function createGridSection(cards: LovelaceCardConfig[]): LovelaceSectionConfig | null {
  return cards.length > 0 ? { type: 'grid', cards } : null;
}

export function parsedConfigToCards(
  parsed: Record<string, any> | Record<string, any>[] | null | undefined
): LovelaceCardConfig[] {
  if (!parsed) return [];
  return Array.isArray(parsed) ? (parsed as LovelaceCardConfig[]) : [parsed as LovelaceCardConfig];
}

export function renderParsedCustomCards(
  cards: ParsedCustomCardLike[],
  headingStyle?: LovelaceCardConfig['heading_style']
): LovelaceCardConfig[] {
  const result: LovelaceCardConfig[] = [];

  for (const card of cards) {
    if (!card.parsed_config || card._yaml_error) continue;
    const parsedCards = parsedConfigToCards(card.parsed_config);
    if (parsedCards.length === 0) continue;

    if (card.title) {
      result.push(createHeadingCard(card.title, headingStyle ? { heading_style: headingStyle } : {}));
    }
    result.push(...parsedCards);
  }

  return result;
}

export function renderParsedCustomCardAsSection(
  card: ParsedCustomCardLike | undefined,
  headingStyle?: LovelaceCardConfig['heading_style']
): LovelaceSectionConfig | null {
  if (!card) return null;
  return createGridSection(renderParsedCustomCards([card], headingStyle));
}

export function parsedConfigToSections(
  parsed: Record<string, any> | Record<string, any>[] | null | undefined
): LovelaceSectionConfig[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    return [{ type: 'grid', cards: parsed as LovelaceCardConfig[] }];
  }
  if (Array.isArray(parsed.sections)) {
    return parsed.sections as LovelaceSectionConfig[];
  }
  if (Array.isArray(parsed.cards)) {
    return [parsed as LovelaceSectionConfig];
  }
  return [{ type: 'grid', cards: [parsed as LovelaceCardConfig] }];
}

export function hideFirstHeadingCard(section: LovelaceSectionConfig): LovelaceSectionConfig {
  if (!Array.isArray(section.cards) || section.cards.length === 0) return section;
  const [firstCard, ...rest] = section.cards;
  if (firstCard?.type !== 'heading') return section;
  return {
    ...section,
    cards: rest,
  };
}

export function withSectionVisibility(
  section: LovelaceSectionConfig,
  rule?: { entity?: string; state?: string }
): LovelaceSectionConfig {
  const entity = rule?.entity?.trim();
  const state = rule?.state?.trim();
  if (!entity || !state) return section;

  const visibility: LovelaceCondition = {
    condition: 'state',
    entity,
    state,
  };

  return {
    ...section,
    visibility: [...(section.visibility || []), visibility],
  };
}
