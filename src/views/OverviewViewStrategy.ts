// ====================================================================
// VIEW STRATEGY — OVERVIEW (main dashboard view)
// ====================================================================
// Extracted from the dashboard entry point so HA can resolve this view
// concurrently with other view strategies via Promise.all, enabling
// progressive rendering instead of blocking on Registry init.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig, SectionKey, CustomCard } from '../types/strategy';
import { DEFAULT_SECTIONS_ORDER } from '../types/strategy';
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
  // Use HA's native clock card — markdown+style is sanitized away by DOMPurify in recent HA versions.
  return {
    type: 'clock',
    clock_size: 'large',
    show_seconds: false,
    grid_options: {
      columns: 'full',
    },
  };
}

function createLargeDateCard(_sizePx: number): LovelaceCardConfig {
  // Use align attribute instead of inline style — DOMPurify strips style but allows align.
  return {
    type: 'markdown',
    content: `<h2 align="center">{{ now().strftime("%d.%m.%Y") }}</h2>`,
    grid_options: {
      columns: 'full',
    },
  };
}

function createWeatherStartSections(
  weatherEntity: string | null,
  areasSections: LovelaceSectionConfig | LovelaceSectionConfig[],
  customCardsSection: LovelaceSectionConfig | null,
  customSections: LovelaceSectionConfig[],
  clockSize: number,
  dateSize: number
): LovelaceSectionConfig[] {
  const overviewCards: LovelaceCardConfig[] = [
    {
      type: 'heading',
      heading: localize('sections.overview'),
      heading_style: 'title',
      icon: 'mdi:view-dashboard-outline',
    },
    createLargeTimeCard(clockSize),
    createLargeDateCard(dateSize),
  ];

  if (weatherEntity) {
    overviewCards.push({
      type: 'weather-forecast',
      entity: weatherEntity,
      show_current: true,
      show_forecast: false,
      grid_options: {
        columns: 'full',
      },
    });
  }

  if (weatherEntity) {
    overviewCards.push(
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
      }
    );
  }

  const sections: LovelaceSectionConfig[] = [
    {
      type: 'grid',
      cards: overviewCards,
    },
  ];

  if (customCardsSection) {
    sections.push(customCardsSection);
  }
  sections.push(...customSections);
  sections.push(...(Array.isArray(areasSections) ? areasSections : [areasSections]));

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
        dashboardConfig.date_size ?? 72
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
