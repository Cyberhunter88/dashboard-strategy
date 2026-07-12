// ====================================================================
// Overview Section Builder
// ====================================================================
// Ported from dist/utils/simon42-section-builder.js (createOverviewSection)
// with full TypeScript types.
// Creates the "Übersicht" section with clock, alarm, search, summaries,
// and favorites.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig, CustomCard, CustomSection } from '../types/strategy';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { localize } from '../utils/localize';
import { createHeadingCard, renderParsedCustomCards } from '../utils/lovelace-utils';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import { buildCompleteCustomSection } from './CustomSections';
import { getViewVisibleUsers, unionVisibleUsers, userVisibilityConditions } from '../utils/view-visibility';

export interface OverviewSectionParams {
  someSensorId: string | null;
  showSearchCard: boolean;
  config: Simon42StrategyConfig;
  hass: HomeAssistant;
}

export function createSummaryCards(config: Simon42StrategyConfig, compact = false): LovelaceCardConfig[] {
  const showCoversSummary = config.show_covers_summary !== false;
  const showLightSummary = config.show_light_summary !== false;
  const showSecuritySummary = config.show_security_summary !== false;
  const showBatterySummary = config.show_battery_summary !== false;
  const showClimateSummary = config.show_climate_summary === true;

  const summaryCards: LovelaceCardConfig[] = [];
  const compactConfig = compact ? { compact: true } : {};

  if (showLightSummary) {
    summaryCards.push({
      type: 'custom:dashboard-strategy-summary-card',
      summary_type: 'lights',
      areas_options: config.areas_options || {},
      hide_unavailable_entities: config.hide_unavailable_entities,
      ...compactConfig,
    });
  }

  if (showCoversSummary) {
    summaryCards.push({
      type: 'custom:dashboard-strategy-summary-card',
      summary_type: 'covers',
      areas_options: config.areas_options || {},
      hide_unavailable_entities: config.hide_unavailable_entities,
      ...compactConfig,
    });
  }

  if (showSecuritySummary) {
    summaryCards.push({
      type: 'custom:dashboard-strategy-summary-card',
      summary_type: 'security',
      areas_options: config.areas_options || {},
      hide_unavailable_entities: config.hide_unavailable_entities,
      ...compactConfig,
    });
  }

  if (showBatterySummary) {
    summaryCards.push({
      type: 'custom:dashboard-strategy-summary-card',
      summary_type: 'batteries',
      areas_options: config.areas_options || {},
      hide_mobile_app_batteries: config.hide_mobile_app_batteries,
      hide_battery_notes_entities: config.hide_battery_notes_entities,
      battery_critical_threshold: config.battery_critical_threshold,
      unavailable_batteries_bucket: config.unavailable_batteries_bucket,
      hide_unavailable_entities: config.hide_unavailable_entities,
      ...compactConfig,
    });
  }

  if (showClimateSummary) {
    summaryCards.push({
      type: 'custom:dashboard-strategy-summary-card',
      summary_type: 'climate',
      areas_options: config.areas_options || {},
      hide_unavailable_entities: config.hide_unavailable_entities,
      ...compactConfig,
    });
  }

  for (const card of summaryCards) {
    const users = getViewVisibleUsers(config, String(card.summary_type));
    const visibility = userVisibilityConditions(users);
    if (visibility) card.visibility = visibility;
  }
  return summaryCards;
}

export function appendSummaryCards(cards: LovelaceCardConfig[], config: Simon42StrategyConfig, compact = false): void {
  const summaryCards = createSummaryCards(config, compact);
  if (summaryCards.length === 0) return;
  const hidden = new Set(config.hidden_section_headings || []);
  const summaryRules = summaryCards.map((card) => getViewVisibleUsers(config, String(card.summary_type)));
  const parentVisibility = userVisibilityConditions(unionVisibleUsers(summaryRules));

  if (!hidden.has('summaries')) {
    cards.push({
      type: 'heading',
      heading: localize('sections.summaries'),
      ...(parentVisibility ? { visibility: parentVisibility } : {}),
      ...(compact ? { heading_style: 'subtitle' } : {}),
    });
  }

  const summariesColumns = config.summaries_columns || 2;
  if (summariesColumns === 4) {
    cards.push({
      type: 'horizontal-stack',
      cards: summaryCards,
      ...(parentVisibility ? { visibility: parentVisibility } : {}),
      ...(compact ? { grid_options: { columns: 'full', rows: 1 } } : {}),
    });
    return;
  }

  for (let i = 0; i < summaryCards.length; i += 2) {
    cards.push({
      type: 'horizontal-stack',
      cards: summaryCards.slice(i, i + 2),
      ...(() => {
        const visibility = userVisibilityConditions(unionVisibleUsers(summaryRules.slice(i, i + 2)));
        return visibility ? { visibility } : {};
      })(),
      ...(compact ? { grid_options: { columns: 'full', rows: 1 } } : {}),
    });
  }
}

export function createSummariesSection(config: Simon42StrategyConfig, compact = false): LovelaceSectionConfig | null {
  const cards: LovelaceCardConfig[] = [];
  appendSummaryCards(cards, config, compact);
  return cards.length > 0 ? { type: 'grid', cards } : null;
}

export function createWeatherStartSummariesSection(
  config: Simon42StrategyConfig,
  size: 'mini' | 'normal' = 'mini'
): LovelaceSectionConfig | null {
  return createSummariesSection(config, size === 'mini');
}

export function createFavoritesSection(
  hass: HomeAssistant,
  config: Simon42StrategyConfig
): LovelaceSectionConfig | null {
  const favoriteEntities = (config.favorite_entities || []).filter((entityId) => hass.states[entityId] !== undefined);
  if (favoriteEntities.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!(config.hidden_section_headings || []).includes('favorites')) {
    cards.push({ type: 'heading', heading: localize('sections.favorites'), heading_style: 'title', icon: 'mdi:star' });
  }

  const stateContent: string[] = [];
  if (config.favorites_show_state === true) stateContent.push('state');
  if (config.favorites_hide_last_changed !== true) stateContent.push('last_changed');
  for (const entityId of favoriteEntities) {
    cards.push(
      buildAdaptiveTileCardConfig(hass, entityId, {
        show_entity_picture: true,
        vertical: false,
        ...(stateContent.length > 0 ? { state_content: stateContent } : {}),
      })
    );
  }
  return { type: 'grid', cards };
}

export function createAlarmSection(hass: HomeAssistant, config: Simon42StrategyConfig): LovelaceSectionConfig | null {
  if (!config.alarm_entity || !hass.states[config.alarm_entity]) return null;
  return {
    type: 'grid',
    cards: [
      { type: 'heading', heading: localize('sections.security'), heading_style: 'title', icon: 'mdi:shield-home' },
      buildAdaptiveTileCardConfig(hass, config.alarm_entity, { vertical: false, grid_options: { columns: 'full' } }),
    ],
  };
}

export function createSearchSection(enabled: boolean): LovelaceSectionConfig | null {
  if (!enabled) return null;
  return {
    type: 'grid',
    cards: [
      { type: 'heading', heading: localize('sections.search'), heading_style: 'title', icon: 'mdi:magnify' },
      { type: 'custom:search-card', grid_options: { columns: 'full' } },
    ],
  };
}

/**
 * Creates the overview section with summaries, clock, optional alarm,
 * optional search card, and favorites.
 */
export function createOverviewSection(data: OverviewSectionParams): LovelaceSectionConfig | null {
  const { showSearchCard, config, hass } = data;
  const showClockCard = config.show_clock_card !== false;
  const hidden = new Set(config.hidden_section_headings || []);

  // Check if alarm entity is configured
  const alarmEntity = config.alarm_entity;

  const cards: LovelaceCardConfig[] = [];

  // Only show "Übersicht" heading if clock or alarm is visible
  if ((showClockCard || alarmEntity) && !hidden.has('overview')) {
    cards.push({
      type: 'heading',
      heading: localize('sections.overview'),
      heading_style: 'title',
      icon: 'mdi:overscan',
    });
  }

  if (showClockCard) {
    if (alarmEntity) {
      // Clock and alarm panel side-by-side
      cards.push({
        type: 'clock',
        clock_size: 'small',
        show_seconds: false,
      });
      cards.push(buildAdaptiveTileCardConfig(hass, alarmEntity, { vertical: false }));
    } else {
      // Clock only, full width
      cards.push({
        type: 'clock',
        clock_size: 'small',
        show_seconds: false,
        grid_options: {
          columns: 'full',
        },
      });
    }
  } else if (alarmEntity) {
    // No clock, but alarm panel full width
    cards.push(
      buildAdaptiveTileCardConfig(hass, alarmEntity, {
        vertical: false,
        grid_options: {
          columns: 'full',
        },
      })
    );
  }

  // Add search card if enabled
  if (showSearchCard) {
    cards.push({
      type: 'custom:search-card',
      grid_options: {
        columns: 'full',
      },
    });
  }

  appendSummaryCards(cards, config);

  // Favorites section
  const favoriteEntities = (config.favorite_entities || []).filter((entityId) => hass.states[entityId] !== undefined);

  if (favoriteEntities.length > 0) {
    if (!hidden.has('favorites')) {
      cards.push({
        type: 'heading',
        heading: localize('sections.favorites'),
      });
    }

    const showState = config.favorites_show_state === true;
    const hideLastChanged = config.favorites_hide_last_changed === true;
    const stateContent: string[] = [];
    if (showState) stateContent.push('state');
    if (!hideLastChanged) stateContent.push('last_changed');

    for (const entityId of favoriteEntities) {
      cards.push(
        buildAdaptiveTileCardConfig(hass, entityId, {
          show_entity_picture: true,
          vertical: false,
          ...(stateContent.length > 0 ? { state_content: stateContent } : {}),
        })
      );
    }
  }

  // If nothing is visible, skip the entire section
  if (cards.length === 0) {
    return null;
  }

  return {
    type: 'grid',
    cards,
  };
}

/**
 * Creates a section for user-defined custom cards (from YAML config).
 * Returns null if no valid custom cards are configured.
 */
export function createCustomCardsSection(
  customCards: CustomCard[],
  heading?: string,
  icon?: string,
  hideHeading = false
): LovelaceSectionConfig | null {
  const validCards = customCards.filter((c) => c.parsed_config);
  if (validCards.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push(createHeadingCard(heading || localize('sections.custom_cards'), { icon: icon || 'mdi:cards' }));
  }

  cards.push(...renderParsedCustomCards(validCards));

  return { type: 'grid', cards };
}

/**
 * Creates an array of sections for user-defined custom sections (from YAML config).
 * Each CustomSection becomes its own grid section with a heading card + its cards.
 * Returns an empty array if no valid custom sections are configured.
 */
export function createCustomSectionsArray(
  customSections: CustomSection[],
  hideHeadings = false
): LovelaceSectionConfig[] {
  const result: LovelaceSectionConfig[] = [];

  for (const section of customSections) {
    if (section.parsed_config !== undefined) {
      const complete = buildCompleteCustomSection(section.parsed_config);
      if (complete) result.push(complete);
      continue;
    }
    const cards: LovelaceCardConfig[] = [];

    if (!hideHeadings) {
      cards.push({
        type: 'heading',
        heading: section.title || localize('sections.custom_sections'),
        ...(section.icon ? { icon: section.icon } : {}),
      });
    }

    cards.push(...renderParsedCustomCards(section.cards || [], 'subtitle'));

    if (cards.length > 1) {
      result.push({ type: 'grid', cards });
    }
  }

  return result;
}
