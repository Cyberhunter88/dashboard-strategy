// ====================================================================
// Custom headings for built-in weather start blocks
// ====================================================================
// A weather start layout item can carry a `title`. For blocks that render
// their own heading (weather, forecast, alarm) the title replaces that
// heading; without a title nothing changes.
// ====================================================================

import type { LovelaceSectionConfig } from '../types/lovelace';

const CUSTOM_HEADING_TYPES = new Set([
  'weather_current',
  'weather_hourly',
  'weather_daily',
  'weather_details',
  'alarm',
]);

/** True for layout item types whose built-in heading can be renamed. */
export function supportsCustomHeading(itemType: string): boolean {
  return CUSTOM_HEADING_TYPES.has(itemType);
}

/**
 * Returns the section with its first heading card renamed to `title`.
 * Sections without a heading card, empty titles, and null sections stay unchanged.
 */
export function withCustomHeading(
  section: LovelaceSectionConfig | null,
  title: string | undefined
): LovelaceSectionConfig | null {
  const heading = title?.trim();
  if (!section || !heading || !Array.isArray(section.cards)) return section;

  const index = section.cards.findIndex((card) => card?.type === 'heading');
  if (index < 0) return section;

  const cards = [...section.cards];
  cards[index] = { ...cards[index], heading };
  return { ...section, cards };
}
