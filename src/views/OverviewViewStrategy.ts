// ====================================================================
// VIEW STRATEGY — OVERVIEW (main dashboard view)
// ====================================================================
// Extracted from the dashboard entry point so HA can resolve this view
// concurrently with other view strategies via Promise.all, enabling
// progressive rendering instead of blocking on Registry init.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type {
  Simon42StrategyConfig,
  SectionKey,
  WeatherStartKey,
  CustomCard,
  WeatherStartBlockConfig,
  WeatherStartLayoutItem,
  CustomSection,
} from '../types/strategy';
import { DEFAULT_SECTIONS_ORDER, DEFAULT_WEATHER_START_ORDER } from '../types/strategy';
import type { LovelaceViewConfig, LovelaceSectionConfig, LovelaceBadgeConfig, LovelaceCardConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { collectPersons, findWeatherEntity, findDummySensor } from '../utils/entity-filter';
import { getVisibleAreas, normalizeAreasDisplay } from '../utils/name-utils';
import { createPersonBadges } from '../utils/badge-builder';
import { createOverviewSection, createCustomCardsSection, createCustomSectionsArray, createWeatherStartSummariesSection } from '../sections/OverviewSection';
import { buildAreaCard, createAreaCardBuildContext, createAreasSection } from '../sections/AreasSection';
import { createWeatherSection, createEnergySection } from '../sections/WeatherEnergySection';
import { createPlantsSection } from '../sections/PlantsSection';
import { createAgendaSection } from '../sections/AgendaSection';
import { createTodosSection } from '../sections/TodosSection';
import { createPersonsSection } from '../sections/PersonsSection';
import { createVacuumsSection } from '../sections/VacuumsSection';
import { createMaintenanceSection } from '../sections/MaintenanceSection';
import { createOverviewView } from '../utils/view-builder';
import { localize } from '../utils/localize';
import { timeStart, timeEnd, debugLog } from '../utils/debug';
import { mergeConfiguredOrder } from '../utils/order-utils';
import {
  parsedConfigToSections,
  renderParsedCustomCardAsSection,
  renderParsedCustomCards,
  withSectionVisibility,
} from '../utils/lovelace-utils';

function createLargeTimeCard(): LovelaceCardConfig {
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

function createLargeDateCard(): LovelaceCardConfig {
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
      rows: 1,
    },
    styles: {
      card: [
        { background: 'var(--ha-card-background, var(--card-background-color, white))' },
        { 'border-radius': 'var(--ha-card-border-radius, 12px)' },
        { 'box-shadow': 'var(--ha-card-box-shadow, none)' },
        { border: 'var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent)' },
        { height: '100%' },
        { 'min-height': '56px' },
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
        { 'font-size': '32px' },
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

const WEATHER_START_INFO_BLOCKS = new Set<WeatherStartKey>([
  'clock',
  'date',
  'summaries',
  'weather_current',
  'weather_hourly',
  'weather_daily',
]);

function shouldStackWeatherStartBlock(key: WeatherStartKey, previousKey: WeatherStartKey | null): boolean {
  return previousKey !== null
    && WEATHER_START_INFO_BLOCKS.has(previousKey)
    && WEATHER_START_INFO_BLOCKS.has(key);
}

function appendWeatherStartBlock(
  sections: LovelaceSectionConfig[],
  block: LovelaceSectionConfig | LovelaceSectionConfig[],
  stackWithPrevious: boolean
): void {
  if (Array.isArray(block)) {
    sections.push(...block);
    return;
  }

  const lastSection = sections[sections.length - 1];
  if (stackWithPrevious && lastSection?.cards && block.cards) {
    lastSection.cards.push(...block.cards);
    return;
  }

  sections.push(block);
}

function renderCustomSection(section: CustomSection | undefined): LovelaceSectionConfig | null {
  if (!section) return null;
  const rendered = createCustomSectionsArray([section]);
  return rendered[0] ?? null;
}

function findCustomCard(config: Simon42StrategyConfig, item: WeatherStartLayoutItem): CustomCard | undefined {
  const cards = config.custom_cards || [];
  return cards.find((card) => card.id === item.custom_card_id)
    || cards[Number(item.custom_card_id?.replace(/^legacy-custom-card-/, ''))];
}

function findCustomSection(config: Simon42StrategyConfig, item: WeatherStartLayoutItem): CustomSection | undefined {
  const sections = config.custom_sections || [];
  return sections.find((section) => section.id === item.custom_section_id)
    || sections[Number(item.custom_section_id?.replace(/^legacy-custom-section-/, ''))];
}

function normalizeWeatherStartLayoutItemsForRender(
  items: WeatherStartLayoutItem[],
  visibleAreas: ReturnType<typeof getVisibleAreas>,
  dashboardConfig: Simon42StrategyConfig,
  hass: HomeAssistant
): WeatherStartLayoutItem[] {
  const visibleAreaIds = new Set(visibleAreas.map((area) => area.area_id));
  const representedAreaIds = new Set<string>();
  const result: WeatherStartLayoutItem[] = [];

  const addAreaItem = (areaId: string, item?: WeatherStartLayoutItem): void => {
    if (!visibleAreaIds.has(areaId) || representedAreaIds.has(areaId)) return;
    representedAreaIds.add(areaId);
    result.push({
      ...(item || {}),
      id: item?.id || `area-${areaId}`,
      type: 'area',
      area_id: areaId,
    });
  };

  const addFloorItem = (item: WeatherStartLayoutItem): void => {
    const floorAreas = visibleAreas.filter((area) => item.floor_id ? area.floor_id === item.floor_id : !area.floor_id);
    if (floorAreas.length === 0) return;
    for (const area of floorAreas) representedAreaIds.add(area.area_id);
    result.push({ ...item });
  };

  for (const item of items) {
    if (item.type === 'area') {
      if (item.area_id) addAreaItem(item.area_id, item);
      continue;
    }

    if (item.type === 'floor') {
      addFloorItem(item);
      continue;
    }

    if (item.type === 'areas') {
      if (dashboardConfig.group_by_floors === true) {
        const floorIds = new Set<string>();
        let hasFloorlessAreas = false;
        for (const area of visibleAreas) {
          if (area.floor_id) floorIds.add(area.floor_id);
          else hasFloorlessAreas = true;
        }
        for (const floorId of Object.keys(hass.floors || {})) {
          if (floorIds.has(floorId)) addFloorItem({ id: `floor-${floorId}`, type: 'floor', floor_id: floorId });
        }
        if (hasFloorlessAreas) addFloorItem({ id: 'floor-none', type: 'floor', floor_id: null });
      } else {
        for (const area of visibleAreas) addAreaItem(area.area_id);
      }
      continue;
    }

    result.push({ ...item });
  }

  for (const area of visibleAreas) {
    addAreaItem(area.area_id);
  }

  return result;
}

function createWeatherStartSectionsFromItems(
  items: WeatherStartLayoutItem[],
  weatherEntity: string | null,
  visibleAreas: ReturnType<typeof getVisibleAreas>,
  dashboardConfig: Simon42StrategyConfig,
  hass: HomeAssistant
): LovelaceSectionConfig[] {
  const areasById = new Map(visibleAreas.map((area) => [area.area_id, area]));
  const normalizedItems = normalizeWeatherStartLayoutItemsForRender(items, visibleAreas, dashboardConfig, hass);
  const sections: LovelaceSectionConfig[] = [];
  const areaCardContext = createAreaCardBuildContext();

  const appendSection = (section: LovelaceSectionConfig | null, stackWithPrevious: boolean | undefined): void => {
    if (!section) return;
    const lastSection = sections[sections.length - 1];
    if (stackWithPrevious && lastSection?.cards && section.cards) {
      lastSection.cards.push(...section.cards);
      return;
    }
    sections.push(section);
  };

  for (const item of normalizedItems) {
    if (item._yaml_error) continue;
    if (item.parsed_config) {
      for (const section of parsedConfigToSections(item.parsed_config)) {
        appendSection(section, item.stack_with_previous);
      }
      continue;
    }

    let section: LovelaceSectionConfig | null = null;
    switch (item.type) {
      case 'clock':
        section = { type: 'grid', cards: [createLargeTimeCard()] };
        break;
      case 'date':
        section = { type: 'grid', cards: [createLargeDateCard()] };
        break;
      case 'summaries':
        section = createWeatherStartSummariesSection(dashboardConfig, item.summary_size || 'mini');
        break;
      case 'weather_current':
        section = weatherEntity ? {
          type: 'grid',
          cards: [
            { type: 'heading', heading: localize('sections.weather'), heading_style: 'title', icon: 'mdi:weather-partly-cloudy' },
            { type: 'weather-forecast', entity: weatherEntity, show_current: true, show_forecast: false, grid_options: { columns: 'full' } },
          ],
        } : null;
        break;
      case 'weather_hourly':
        section = weatherEntity ? {
          type: 'grid',
          cards: [
            { type: 'heading', heading: localize('sections.weather_today'), heading_style: 'title', icon: 'mdi:clock-outline' },
            { type: 'weather-forecast', entity: weatherEntity, forecast_type: 'hourly', show_current: false, show_forecast: true, grid_options: { columns: 'full' } },
          ],
        } : null;
        break;
      case 'weather_daily':
        section = weatherEntity ? {
          type: 'grid',
          cards: [
            { type: 'heading', heading: localize('sections.weather_next_days'), heading_style: 'title', icon: 'mdi:calendar-outline' },
            { type: 'weather-forecast', entity: weatherEntity, forecast_type: 'daily', show_current: false, show_forecast: true, grid_options: { columns: 'full' } },
          ],
        } : null;
        break;
      case 'area': {
        const area = item.area_id ? areasById.get(item.area_id) : undefined;
        section = area ? { type: 'grid', cards: [buildAreaCard(area, hass, areaCardContext)] } : null;
        break;
      }
      case 'floor': {
        const floorAreas = visibleAreas.filter((area) => (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id));
        if (floorAreas.length > 0) {
          const floor = item.floor_id ? hass.floors?.[item.floor_id] : undefined;
          section = {
            type: 'grid',
            cards: [
              {
                type: 'heading',
                heading_style: 'title',
                heading: item.title || floor?.name || localize('sections.areas_other'),
                icon: floor?.icon || 'mdi:floor-plan',
              },
              ...floorAreas.map((area) => buildAreaCard(area, hass, areaCardContext)),
            ],
          };
        }
        break;
      }
      case 'custom_card':
        section = renderParsedCustomCardAsSection(findCustomCard(dashboardConfig, item), 'subtitle');
        break;
      case 'custom_section':
        section = renderCustomSection(findCustomSection(dashboardConfig, item));
        break;
      default:
        section = null;
    }

    appendSection(section, item.stack_with_previous);
  }

  return sections;
}

function createWeatherStartSections(
  weatherEntity: string | null,
  areasSections: LovelaceSectionConfig | LovelaceSectionConfig[],
  customCardsSection: LovelaceSectionConfig | null,
  customSections: LovelaceSectionConfig[],
  dashboardConfig: Simon42StrategyConfig,
  order: WeatherStartKey[],
  blocksConfig: Partial<Record<WeatherStartKey, WeatherStartBlockConfig>> = {}
): LovelaceSectionConfig[] {
  const normalizedOrder = mergeConfiguredOrder(order, DEFAULT_WEATHER_START_ORDER);

  const blockMap = new Map<WeatherStartKey, LovelaceSectionConfig | LovelaceSectionConfig[] | null>();

  blockMap.set('clock', withBlockOverride('clock', {
    type: 'grid',
    cards: [createLargeTimeCard()],
  }, blocksConfig));

  blockMap.set('date', withBlockOverride('date', {
    type: 'grid',
    cards: [createLargeDateCard()],
  }, blocksConfig));

  blockMap.set('summaries', withBlockOverride('summaries',
    createWeatherStartSummariesSection(dashboardConfig),
    blocksConfig
  ));

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
  let previousKey: WeatherStartKey | null = null;
  for (const key of normalizedOrder) {
    const block = blockMap.get(key);
    if (!block) continue;
    appendWeatherStartBlock(sections, block, shouldStackWeatherStartBlock(key, previousKey));
    previousKey = key;
  }

  return sections;
}

class Simon42ViewOverviewStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    timeStart('overview-generate');
    const dashboardConfig: Simon42StrategyConfig = config.dashboardConfig || {};

    // Initialize Registry (idempotent — skips if already done by another view)
    if (!Registry.isCurrent(hass, dashboardConfig)) {
      Registry.initialize(hass, dashboardConfig);
    }

    // Visible areas (filtered + sorted by config)
    const normalizedAreasDisplay = normalizeAreasDisplay(Registry.areas, dashboardConfig.areas_display);
    const visibleAreas = getVisibleAreas(Registry.areas, normalizedAreasDisplay, dashboardConfig.use_default_area_sort);

    // Collect data for overview
    const persons = collectPersons(hass, dashboardConfig);
    const weatherEntity = dashboardConfig.weather_entity || findWeatherEntity(hass);
    const someSensorId = findDummySensor(hass);

    // Person badges
    const personBadges = dashboardConfig.show_person_badges !== false
      ? createPersonBadges(persons, hass, dashboardConfig.person_badge_layout || 'with_state')
      : [];
    const hiddenHeadings = new Set(dashboardConfig.hidden_section_headings || []);

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
      dashboardConfig.custom_cards_icon,
      hiddenHeadings.has('custom_cards')
    );
    const areasSections = createAreasSection(
      visibleAreas,
      groupByFloors,
      hass,
      hiddenHeadings.has('areas'),
      hiddenHeadings.has('areas_other')
    );

    const customBadges = (dashboardConfig.custom_badges || [])
      .filter((b) => b.parsed_config)
      .map((b) => b.parsed_config as LovelaceBadgeConfig);
    const powerBadges: LovelaceBadgeConfig[] = [];
    const powerEntity = dashboardConfig.power_badge_entity;
    if (powerEntity && hass.states[powerEntity]) {
      powerBadges.push({
        type: 'entity',
        entity: powerEntity,
        show_name: false,
        color: 'orange',
      });
    }

    const alertBadges: LovelaceBadgeConfig[] = [];
    if (dashboardConfig.show_unavailable_alert_badge === true) {
      let count = 0;
      for (const [entityId, state] of Object.entries(hass.states)) {
        if (state.state !== 'unavailable') continue;
        if (Registry.isExcludedByLabel(entityId)) continue;
        if (Registry.isHiddenByConfig(entityId)) continue;
        const entry = Registry.getEntity(entityId);
        if (entry?.hidden) continue;
        count++;
      }
      if (count > 0 && someSensorId) {
        alertBadges.push({
          type: 'entity',
          entity: someSensorId,
          name: String(count),
          icon: 'mdi:alert-circle-outline',
          color: 'red',
          show_state: false,
        });
      }
    }

    const nowPlayingBadges: LovelaceBadgeConfig[] = [];
    if (dashboardConfig.show_now_playing_badge === true) {
      const playing = Registry.getVisibleEntityIdsForDomain('media_player').find(
        (id) => hass.states[id]?.state === 'playing'
      );
      if (playing) {
        nowPlayingBadges.push({
          type: 'entity',
          entity: playing,
          icon: 'mdi:play-circle',
          color: 'green',
          show_state: false,
          tap_action: { action: 'more-info' },
        });
      }
    }

    const sunBadges: LovelaceBadgeConfig[] = [];
    if (dashboardConfig.show_sun_badge === true && hass.states['sun.sun']) {
      const isAbove = hass.states['sun.sun'].state === 'above_horizon';
      sunBadges.push({
        type: 'entity',
        entity: 'sun.sun',
        name: '',
        icon: isAbove ? 'mdi:weather-sunset-down' : 'mdi:weather-sunset-up',
        color: isAbove ? 'amber' : 'indigo',
        tap_action: { action: 'more-info' },
      });
    }

    const updatesBadges: LovelaceBadgeConfig[] = [];
    if (dashboardConfig.show_updates_badge === true) {
      let count = 0;
      let firstId: string | undefined;
      for (const id of Registry.getVisibleEntityIdsForDomain('update')) {
        if (hass.states[id]?.state === 'on') {
          count++;
          if (!firstId) firstId = id;
        }
      }
      if (count > 0 && firstId) {
        updatesBadges.push({
          type: 'entity',
          entity: firstId,
          name: String(count),
          icon: 'mdi:update',
          color: 'orange',
          show_state: false,
          tap_action: { action: 'navigate', navigation_path: '/config/updates' },
        });
      }
    }
    const overviewBadges = [
      ...personBadges,
      ...powerBadges,
      ...alertBadges,
      ...nowPlayingBadges,
      ...sunBadges,
      ...updatesBadges,
      ...customBadges,
    ];

    if (dashboardConfig.overview_layout === 'weather_start') {
      const overviewSections = dashboardConfig.weather_start_layout_items?.length
        ? createWeatherStartSectionsFromItems(
          dashboardConfig.weather_start_layout_items,
          weatherEntity ?? null,
          visibleAreas,
          dashboardConfig,
          hass
        )
        : createWeatherStartSections(
          weatherEntity ?? null,
          areasSections,
          createCustomCardsSection(
            customCardsBySection.get('custom_cards') || [],
            dashboardConfig.custom_cards_heading,
            dashboardConfig.custom_cards_icon,
            hiddenHeadings.has('custom_cards')
          ),
          createCustomSectionsArray(dashboardConfig.custom_sections || [], hiddenHeadings.has('custom_sections')),
          dashboardConfig,
          dashboardConfig.weather_start_order ?? [...DEFAULT_WEATHER_START_ORDER],
          dashboardConfig.weather_start_blocks_config ?? {}
        );
      const totalCards = overviewSections.reduce((sum, s) => sum + (s.cards?.length || 0), 0);
      timeEnd('overview-generate');
      debugLog(`Weather start: ${overviewSections.length} sections, ${totalCards} cards, ${personBadges.length} badges`);

      return createOverviewView(overviewSections, overviewBadges, dashboardConfig);
    }

    // Section map: key → section(s) or null
    const sectionMap = new Map<SectionKey, LovelaceSectionConfig | LovelaceSectionConfig[] | null>([
      ['overview', overviewSection],
      ['custom_cards', customCardsSection],
      ['custom_sections', createCustomSectionsArray(dashboardConfig.custom_sections || [], hiddenHeadings.has('custom_sections'))],
      ['areas', areasSections],
      [
        'weather',
        createWeatherSection(
          weatherEntity ?? null,
          showWeather,
          dashboardConfig.show_weather_forecast_card !== false,
          dashboardConfig.weather_sensors || [],
          dashboardConfig.weather_presentation,
          hiddenHeadings.has('weather'),
          dashboardConfig.pollen_entities || []
        ),
      ],
      [
        'energy',
        createEnergySection(
          showEnergy,
          dashboardConfig.energy_link_dashboard !== false,
          dashboardConfig.show_energy_distribution_card !== false,
          hiddenHeadings.has('energy')
        ),
      ],
      ['plants', createPlantsSection(hass, dashboardConfig.show_plants_section === true, hiddenHeadings.has('plants'))],
      [
        'agenda',
        createAgendaSection(
          hass,
          dashboardConfig.show_agenda_section === true,
          dashboardConfig.agenda_calendar_entities,
          hiddenHeadings.has('agenda')
        ),
      ],
      [
        'todos',
        createTodosSection(
          hass,
          dashboardConfig.show_todos_section === true,
          dashboardConfig.todos_entities,
          hiddenHeadings.has('todos')
        ),
      ],
      ['persons', createPersonsSection(hass, dashboardConfig.show_persons_section === true, hiddenHeadings.has('persons'))],
      ['vacuums', createVacuumsSection(hass, dashboardConfig.show_vacuums_section === true, hiddenHeadings.has('vacuums'))],
      [
        'maintenance',
        createMaintenanceSection(
          hass,
          dashboardConfig.show_maintenance_section === true,
          hiddenHeadings.has('maintenance')
        ),
      ],
    ]);

    // Assemble in configured order, appending assigned custom cards to each section
    const sectionsOrder = mergeConfiguredOrder(dashboardConfig.sections_order, DEFAULT_SECTIONS_ORDER);
    const overviewSections: LovelaceSectionConfig[] = [];
    for (const key of sectionsOrder) {
      const result = sectionMap.get(key);
      if (!result) continue;
      const visibilityRule = dashboardConfig.section_visibility?.[key];
      if (Array.isArray(result)) {
        overviewSections.push(...result.map((section) => withSectionVisibility(section, visibilityRule)));
      } else {
        overviewSections.push(withSectionVisibility(result, visibilityRule));
      }
      // Append custom cards assigned to this section (skip 'custom_cards' — handled by createCustomCardsSection)
      if (key !== 'custom_cards') {
        const assigned = customCardsBySection.get(key);
        if (assigned && assigned.length > 0) {
          const extraCards = renderParsedCustomCards(assigned, 'subtitle');
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

    return createOverviewView(
      overviewSections,
      overviewBadges,
      dashboardConfig
    );
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-overview', Simon42ViewOverviewStrategy);
