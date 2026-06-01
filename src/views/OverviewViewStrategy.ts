// ====================================================================
// VIEW STRATEGY — OVERVIEW (main dashboard view)
// ====================================================================
// Extracted from the dashboard entry point so HA can resolve this view
// concurrently with other view strategies via Promise.all, enabling
// progressive rendering instead of blocking on Registry init.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig, SectionKey, WeatherStartKey, CustomCard, WeatherStartBlockConfig } from '../types/strategy';
import { DEFAULT_SECTIONS_ORDER, DEFAULT_WEATHER_START_ORDER } from '../types/strategy';
import type { LovelaceViewConfig, LovelaceSectionConfig, LovelaceBadgeConfig, LovelaceCardConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { collectPersons, findWeatherEntity, findDummySensor } from '../utils/entity-filter';
import { getVisibleAreas } from '../utils/name-utils';
import { createPersonBadges } from '../utils/badge-builder';
import { createOverviewSection, createCustomCardsSection, createCustomSectionsArray } from '../sections/OverviewSection';
import { createAreasSection } from '../sections/AreasSection';
import { createWeatherSection, createEnergySection } from '../sections/WeatherEnergySection';
import { createOverviewView } from '../utils/view-builder';
import { localize } from '../utils/localize';
import { timeStart, timeEnd, debugLog } from '../utils/debug';

/**
 * Normalizes a sections_order array: removes invalid/duplicate keys,
 * appends any missing keys at the end (forward compatibility).
 */
function normalizeSectionsOrder(order: SectionKey[]): SectionKey[] {
  const validKeys = new Set<SectionKey>(['overview', 'custom_cards', 'custom_sections', 'areas', 'weather', 'energy']);
  const seen = new Set<SectionKey>();
  const result: SectionKey[] = [];
  for (const key of order) {
    if (validKeys.has(key) && !seen.has(key)) {
      result.push(key);
      seen.add(key);
    }
  }
  for (const key of DEFAULT_SECTIONS_ORDER) {
    if (!seen.has(key)) result.push(key);
  }
  return result;
}

/**
 * Renders custom cards into an array of LovelaceCardConfigs (without section wrapper).
 * Used to append assigned custom cards to existing sections.
 */
function renderCustomCards(cards: CustomCard[]): LovelaceCardConfig[] {
  const result: LovelaceCardConfig[] = [];
  for (const card of cards) {
    if (!card.parsed_config) continue;
    if (Array.isArray(card.parsed_config)) {
      result.push(...card.parsed_config);
    } else {
      if (card.title) {
        result.push({ type: 'heading', heading: card.title, heading_style: 'subtitle' });
      }
      result.push(card.parsed_config as LovelaceCardConfig);
    }
  }
  return result;
}

function createLargeTimeCard(_sizePx: number): LovelaceCardConfig {
  // Native clock card — DOMPurify strips style in markdown cards in recent HA versions.
  return {
    type: 'clock',
    clock_style: 'digital',
    clock_size: 'large',
    show_seconds: false,
    no_background: false,
    face_style: 'markers',
    grid_options: {
      columns: 'full',
      rows: 2,
    },
  };
}

function createLargeDateCard(sizePx: number): LovelaceCardConfig {
  // custom:button-card injects CSS into its own shadow DOM, bypassing DOMPurify.
  // Uses HA CSS variables so the card background matches the native clock card style.
  return {
    type: 'custom:button-card',
    name: `[[[
  const d = new Date();
  return d.toLocaleDateString(navigator.language, { day: '2-digit', month: '2-digit', year: 'numeric' });
]]]`,
    show_icon: false,
    show_state: false,
    show_name: true,
    tap_action: { action: 'none' },
    hold_action: { action: 'none' },
    double_tap_action: { action: 'none' },
    grid_options: {
      columns: 'full',
      rows: 2,
    },
    styles: {
      card: [
        { background: 'var(--ha-card-background, var(--card-background-color, white))' },
        { 'border-radius': 'var(--ha-card-border-radius, 12px)' },
        { 'box-shadow': 'var(--ha-card-box-shadow, none)' },
        { border: 'var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent)' },
        { height: '100%' },
        { 'min-height': '80px' },
        { display: 'flex' },
        { 'align-items': 'center' },
        { 'justify-content': 'center' },
        { padding: '0' },
      ],
      grid: [
        { height: '100%' },
        { display: 'flex' },
        { 'align-items': 'center' },
        { 'justify-content': 'center' },
      ],
      name: [
        { 'font-size': `${sizePx}px` },
        { 'font-weight': '600' },
        { 'line-height': '1' },
        { color: 'var(--primary-text-color)' },
        { 'text-align': 'center' },
        { width: '100%' },
        { 'white-space': 'nowrap' },
      ],
    },
  };
}

function normalizeWeatherStartOrder(order: WeatherStartKey[]): WeatherStartKey[] {
  const validKeys = new Set<WeatherStartKey>([
    'clock', 'date', 'weather_current', 'weather_hourly', 'weather_daily',
    'areas', 'custom_cards', 'custom_sections',
  ]);
  const seen = new Set<WeatherStartKey>();
  const result: WeatherStartKey[] = [];
  for (const key of order) {
    if (validKeys.has(key) && !seen.has(key)) {
      result.push(key);
      seen.add(key);
    }
  }
  for (const key of DEFAULT_WEATHER_START_ORDER) {
    if (!seen.has(key)) result.push(key);
  }
  return result;
}

function withBlockOverride(
  key: WeatherStartKey,
  defaultSection: LovelaceSectionConfig | null,
  blocksConfig: Partial<Record<WeatherStartKey, WeatherStartBlockConfig>>
): LovelaceSectionConfig | null {
  const cfg = blocksConfig[key];
  if (cfg?.parsed_config && cfg.parsed_config.length > 0) {
    return { type: 'grid', cards: cfg.parsed_config as LovelaceCardConfig[] };
  }
  return defaultSection;
}

function createWeatherStartSections(
  weatherEntity: string | null,
  areasSections: LovelaceSectionConfig | LovelaceSectionConfig[],
  customCardsSection: LovelaceSectionConfig | null,
  customSections: LovelaceSectionConfig[],
  clockSize: number,
  dateSize: number,
  order: WeatherStartKey[],
  blocksConfig: Partial<Record<WeatherStartKey, WeatherStartBlockConfig>> = {}
): LovelaceSectionConfig[] {
  const normalizedOrder = normalizeWeatherStartOrder(order);

  const blockMap = new Map<WeatherStartKey, LovelaceSectionConfig | LovelaceSectionConfig[] | null>();

  blockMap.set('clock', withBlockOverride('clock', {
    type: 'grid',
    cards: [createLargeTimeCard(clockSize)],
  }, blocksConfig));

  blockMap.set('date', withBlockOverride('date', {
    type: 'grid',
    cards: [createLargeDateCard(dateSize)],
  }, blocksConfig));

  blockMap.set('weather_current', withBlockOverride('weather_current', weatherEntity ? {
    type: 'grid',
    cards: [
      {
        type: 'heading',
        heading: localize('sections.weather'),
        heading_style: 'title',
        icon: 'mdi:weather-partly-cloudy',
      },
      {
        type: 'weather-forecast',
        entity: weatherEntity,
        show_current: true,
        show_forecast: false,
        grid_options: { columns: 'full' },
      },
    ],
  } : null, blocksConfig));

  blockMap.set('weather_hourly', withBlockOverride('weather_hourly', weatherEntity ? {
    type: 'grid',
    cards: [
      {
        type: 'heading',
        heading: localize('sections.weather_today'),
        heading_style: 'title',
        icon: 'mdi:clock-outline',
      },
      {
        type: 'weather-forecast',
        entity: weatherEntity,
        forecast_type: 'hourly',
        show_current: false,
        show_forecast: true,
        grid_options: { columns: 'full' },
      },
    ],
  } : null, blocksConfig));

  blockMap.set('weather_daily', withBlockOverride('weather_daily', weatherEntity ? {
    type: 'grid',
    cards: [
      {
        type: 'heading',
        heading: localize('sections.weather_next_days'),
        heading_style: 'title',
        icon: 'mdi:calendar-outline',
      },
      {
        type: 'weather-forecast',
        entity: weatherEntity,
        forecast_type: 'daily',
        show_current: false,
        show_forecast: true,
        grid_options: { columns: 'full' },
      },
    ],
  } : null, blocksConfig));

  blockMap.set('custom_cards', customCardsSection);
  blockMap.set('custom_sections', customSections.length > 0 ? customSections : null);
  blockMap.set('areas', areasSections);

  const sections: LovelaceSectionConfig[] = [];
  for (const key of normalizedOrder) {
    const block = blockMap.get(key);
    if (!block) continue;
    if (Array.isArray(block)) {
      sections.push(...block);
    } else {
      sections.push(block);
    }
  }

  return sections;
}

class Simon42ViewOverviewStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    timeStart('overview-generate');
    const dashboardConfig: Simon42StrategyConfig = config.dashboardConfig || {};

    // Initialize Registry (idempotent — skips if already done by another view)
    Registry.initialize(hass, dashboardConfig);

    // Visible areas (filtered + sorted by config)
    const visibleAreas = getVisibleAreas(Registry.areas, dashboardConfig.areas_display, dashboardConfig.use_default_area_sort);

    // Collect data for overview
    const persons = collectPersons(hass, dashboardConfig);
    const weatherEntity = dashboardConfig.weather_entity || findWeatherEntity(hass);
    const someSensorId = findDummySensor(hass);

    // Person badges
    const personBadges = createPersonBadges(persons, hass);

    // Config flags
    const showWeather = dashboardConfig.show_weather !== false;
    const showEnergy = dashboardConfig.show_energy !== false;
    const showSearchCard = dashboardConfig.show_search_card === true;
    const groupByFloors = dashboardConfig.group_by_floors === true;

    // Group custom cards by target section
    const allCustomCards = dashboardConfig.custom_cards || [];
    const customCardsBySection = new Map<SectionKey, CustomCard[]>();
    for (const card of allCustomCards) {
      const target = card.target_section || 'custom_cards';
      const list = customCardsBySection.get(target) || [];
      list.push(card);
      customCardsBySection.set(target, list);
    }

    // Build sections
    const overviewSection = createOverviewSection({ someSensorId, showSearchCard, config: dashboardConfig, hass });
    const customCardsSection = createCustomCardsSection(
      customCardsBySection.get('custom_cards') || [],
      dashboardConfig.custom_cards_heading,
      dashboardConfig.custom_cards_icon
    );
    const areasSections = createAreasSection(visibleAreas, groupByFloors, hass);

    if (dashboardConfig.overview_layout === 'weather_start') {
      const overviewSections = createWeatherStartSections(
        weatherEntity ?? null,
        areasSections,
        createCustomCardsSection(
          customCardsBySection.get('custom_cards') || [],
          dashboardConfig.custom_cards_heading,
          dashboardConfig.custom_cards_icon
        ),
        createCustomSectionsArray(dashboardConfig.custom_sections || []),
        dashboardConfig.clock_size ?? 120,
        dashboardConfig.date_size ?? 72,
        dashboardConfig.weather_start_order ?? [...DEFAULT_WEATHER_START_ORDER],
        dashboardConfig.weather_start_blocks_config ?? {}
      );
      const totalCards = overviewSections.reduce((sum, s) => sum + (s.cards?.length || 0), 0);
      timeEnd('overview-generate');
      debugLog(`Weather start: ${overviewSections.length} sections, ${totalCards} cards, ${personBadges.length} badges`);

      const customBadges = (dashboardConfig.custom_badges || [])
        .filter((b) => b.parsed_config)
        .map((b) => b.parsed_config as LovelaceBadgeConfig);

      return createOverviewView(overviewSections, [...personBadges, ...customBadges]);
    }

    // Section map: key → section(s) or null
    const sectionMap = new Map<SectionKey, LovelaceSectionConfig | LovelaceSectionConfig[] | null>([
      ['overview', overviewSection],
      ['custom_cards', customCardsSection],
      ['custom_sections', createCustomSectionsArray(dashboardConfig.custom_sections || [])],
      ['areas', areasSections],
      ['weather', createWeatherSection(weatherEntity ?? null, showWeather)],
      ['energy', createEnergySection(showEnergy, dashboardConfig.energy_link_dashboard !== false)],
    ]);

    // Assemble in configured order, appending assigned custom cards to each section
    const sectionsOrder = normalizeSectionsOrder(dashboardConfig.sections_order ?? DEFAULT_SECTIONS_ORDER);
    const overviewSections: LovelaceSectionConfig[] = [];
    for (const key of sectionsOrder) {
      const result = sectionMap.get(key);
      if (!result) continue;
      if (Array.isArray(result)) {
        overviewSections.push(...result);
      } else {
        overviewSections.push(result);
      }
      // Append custom cards assigned to this section (skip 'custom_cards' — handled by createCustomCardsSection)
      if (key !== 'custom_cards') {
        const assigned = customCardsBySection.get(key);
        if (assigned && assigned.length > 0) {
          const extraCards = renderCustomCards(assigned);
          if (extraCards.length > 0) {
            // Append to the last section added (handles array sections like areas)
            const lastSection = overviewSections[overviewSections.length - 1];
            if (lastSection.cards) {
              lastSection.cards.push(...extraCards);
            }
          }
        }
      }
    }

    const totalCards = overviewSections.reduce((sum, s) => sum + (s.cards?.length || 0), 0);
    timeEnd('overview-generate');
    debugLog(`Overview: ${overviewSections.length} sections, ${totalCards} cards, ${personBadges.length} badges`);

    // Custom badges from YAML config
    const customBadges = (dashboardConfig.custom_badges || [])
      .filter((b) => b.parsed_config)
      .map((b) => b.parsed_config as LovelaceBadgeConfig);

    return createOverviewView(overviewSections, [...personBadges, ...customBadges]);
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-overview', Simon42ViewOverviewStrategy);
