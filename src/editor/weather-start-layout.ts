// ====================================================================
// Weather-start layout logic (editor)
// ====================================================================
// Pure helpers behind the free weather-start layout editor: which blocks
// are disabled by the current config, which areas/floors can be placed,
// how the legacy block order becomes layout items, how stored items are
// normalized against the live areas, and how each item is labeled.
// The editor host keeps the caches and delegates here.
// ====================================================================

import type { AreaRegistryEntry, FloorRegistryEntry } from '../types/registries';
import type {
  AreaCustomCard,
  CustomCard,
  CustomSection,
  SectionKey,
  Simon42StrategyConfig,
  WeatherStartKey,
  WeatherStartLayoutItem,
} from '../types/strategy';
import { DEFAULT_WEATHER_START_ORDER } from '../types/strategy';
import { localize } from '../utils/localize';
import { getWeatherStartWeatherMode } from '../utils/weather-start-defaults';
import { WEATHER_START_BLOCK_META } from './editor-panel-registry';
import type { WeatherStartFloorOption } from './panels/WeatherStartPanel';

type BlockMeta = { icon: string; labelKey: string };

const WEATHER_START_BLOCK_META_MAP = new Map<WeatherStartKey, BlockMeta>(
  Object.entries(WEATHER_START_BLOCK_META) as [WeatherStartKey, BlockMeta][]
);

const SECTION_META = new Map<SectionKey, BlockMeta>([
  ['overview', { icon: 'mdi:home-outline', labelKey: 'sections.overview' }],
  ['custom_cards', { icon: 'mdi:cards', labelKey: 'sections.custom_cards' }],
  ['areas', { icon: 'mdi:floor-plan', labelKey: 'sections.areas' }],
  ['weather', { icon: 'mdi:weather-partly-cloudy', labelKey: 'sections.weather' }],
  ['energy', { icon: 'mdi:lightning-bolt', labelKey: 'sections.energy' }],
]);

/** Translation key for a legacy overview section heading. */
export function getSectionLabelKey(key: SectionKey): string {
  return SECTION_META.get(key)!.labelKey;
}

export function getWeatherStartOrder(config: Simon42StrategyConfig): WeatherStartKey[] {
  return config.weather_start_order || [...DEFAULT_WEATHER_START_ORDER];
}

/** Whether a built-in block has nothing to show with the current config. */
export function isWeatherStartBlockDisabled(config: Simon42StrategyConfig, key: WeatherStartKey): boolean {
  switch (key) {
    case 'clock':
      return config.show_clock_card === false;
    case 'weather_current':
    case 'weather_daily':
      return config.show_weather === false;
    case 'weather_hourly':
      return config.show_weather === false || getWeatherStartWeatherMode(config) === 'compact_hourly';
    case 'weather_details':
      return (config.weather_sensors || []).length === 0 && (config.pollen_entities || []).length === 0;
    case 'favorites':
      return (config.favorite_entities || []).length === 0;
    case 'light_favorites':
      return (config.light_favorite_entities || []).length === 0;
    case 'alarm':
      return !config.alarm_entity;
    case 'search':
      return config.show_search_card !== true;
    case 'overview':
      return !(config.custom_cards || []).some((card) => (card.target_section || 'custom_cards') === 'overview');
    case 'energy':
      return config.show_energy === false;
    case 'plants':
      return config.show_plants_section !== true;
    case 'agenda':
      return config.show_agenda_section !== true;
    case 'todos':
      return config.show_todos_section !== true;
    case 'persons':
      return config.show_persons_section !== true;
    case 'vacuums':
      return config.show_vacuums_section !== true;
    case 'maintenance':
      return config.show_maintenance_section !== true;
    case 'quick_actions':
      return (config.quick_action_entities || []).length === 0;
    case 'media':
      return config.show_media_section !== true;
    case 'timers':
      return config.show_timers_section !== true;
    case 'activity':
      return config.show_activity_section !== true;
    case 'custom_cards':
      return (config.custom_cards || []).length === 0;
    case 'custom_sections':
      return (config.custom_sections || []).length === 0;
    case 'summaries':
      return (
        config.show_light_summary === false &&
        config.show_covers_summary === false &&
        config.show_security_summary === false &&
        config.show_battery_summary === false &&
        config.show_climate_summary !== true &&
        config.show_windows_summary !== true
      );
    default:
      return false;
  }
}

/** Visible areas in the configured order (unordered ones last, by name). */
export function computeWeatherStartAreaOptions(
  areas: Readonly<Record<string, AreaRegistryEntry>> | undefined,
  hiddenList: readonly string[],
  order: readonly string[]
): AreaRegistryEntry[] {
  const hidden = new Set(hiddenList);
  const orderMap = new Map(order.map((areaId, index) => [areaId, index]));
  return Object.values(areas || {})
    .filter((area) => !hidden.has(area.area_id))
    .sort((a, b) => {
      const ai = orderMap.get(a.area_id) ?? -1;
      const bi = orderMap.get(b.area_id) ?? -1;
      const ae = ai >= 0 ? ai : 9999;
      const be = bi >= 0 ? bi : 9999;
      return ae - be || a.name.localeCompare(b.name);
    });
}

/** Floors that hold at least one of the areas, by level, plus an "other areas" entry when needed. */
export function computeWeatherStartFloorOptions(
  floors: Readonly<Record<string, FloorRegistryEntry>> | undefined,
  areas: readonly AreaRegistryEntry[]
): WeatherStartFloorOption[] {
  const floorIds = new Set<string>();
  let hasFloorlessAreas = false;
  for (const area of areas) {
    if (area.floor_id) floorIds.add(area.floor_id);
    else hasFloorlessAreas = true;
  }

  const result: WeatherStartFloorOption[] = Object.values(floors || {})
    .filter((floor) => floorIds.has(floor.floor_id))
    .sort((a, b) => {
      const aLevel = a.level ?? 9999;
      const bLevel = b.level ?? 9999;
      return aLevel - bLevel || a.name.localeCompare(b.name);
    })
    .map((floor) => ({ floor_id: floor.floor_id, name: floor.name, icon: floor.icon }));

  if (hasFloorlessAreas) {
    result.push({ floor_id: null, name: localize('sections.areas_other'), icon: 'mdi:home-outline' });
  }
  return result;
}

export function getCustomCardRef(card: CustomCard, index: number): string {
  return card.id || `legacy-custom-card-${index}`;
}

export function getCustomSectionRef(section: CustomSection, index: number): string {
  return section.id || `legacy-custom-section-${index}`;
}

export function getCustomCardEditorLabel(card: CustomCard | AreaCustomCard | undefined, fallback: string): string {
  return card?.editor_title || card?.title || fallback;
}

function floorItem(floor: WeatherStartFloorOption): WeatherStartLayoutItem {
  return { id: `floor-${floor.floor_id || 'none'}`, type: 'floor', floor_id: floor.floor_id, title: floor.name };
}

/** Turn the legacy `weather_start_order` into layout items. */
export function buildLegacyWeatherStartLayoutItems(
  config: Simon42StrategyConfig,
  areas: readonly AreaRegistryEntry[],
  floors: readonly WeatherStartFloorOption[]
): WeatherStartLayoutItem[] {
  const items: WeatherStartLayoutItem[] = [];
  for (const key of getWeatherStartOrder(config)) {
    const blockCfg = config.weather_start_blocks_config?.[key];
    if (key === 'areas') {
      if (config.group_by_floors === true) {
        for (const floor of floors) items.push(floorItem(floor));
      } else {
        for (const area of areas) items.push({ id: `area-${area.area_id}`, type: 'area', area_id: area.area_id });
      }
    } else if (key === 'custom_cards') {
      (config.custom_cards || []).forEach((card, index) => {
        const ref = getCustomCardRef(card, index);
        items.push({ id: `custom-card-${ref}`, type: 'custom_card', custom_card_id: ref });
      });
    } else if (key === 'custom_sections') {
      (config.custom_sections || []).forEach((section, index) => {
        const ref = getCustomSectionRef(section, index);
        items.push({ id: `custom-section-${ref}`, type: 'custom_section', custom_section_id: ref });
      });
    } else {
      items.push({
        id: key,
        type: key,
        ...(blockCfg?.yaml
          ? { yaml: blockCfg.yaml, parsed_config: blockCfg.parsed_config, _yaml_error: blockCfg._yaml_error }
          : {}),
      });
    }
  }
  return items;
}

/**
 * Align stored layout items with the live areas: drop hidden or removed
 * areas, expand a legacy `areas` item, keep every visible area exactly once
 * and append areas that no item represents yet.
 */
export function normalizeWeatherStartLayoutItems(
  items: readonly WeatherStartLayoutItem[],
  config: Simon42StrategyConfig,
  areas: readonly AreaRegistryEntry[],
  floors: readonly WeatherStartFloorOption[]
): WeatherStartLayoutItem[] {
  const visibleAreaIds = new Set(areas.map((area) => area.area_id));
  const representedAreaIds = new Set<string>();
  const result: WeatherStartLayoutItem[] = [];

  const addAreaItem = (areaId: string, item?: WeatherStartLayoutItem): void => {
    if (!visibleAreaIds.has(areaId) || representedAreaIds.has(areaId)) return;
    representedAreaIds.add(areaId);
    result.push({ ...(item || {}), id: item?.id || `area-${areaId}`, type: 'area', area_id: areaId });
  };

  const addFloorItem = (item: WeatherStartLayoutItem): void => {
    const floorAreas = areas.filter((area) => (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id));
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
      if (config.group_by_floors === true) {
        for (const floor of floors) addFloorItem(floorItem(floor));
      } else {
        for (const area of areas) addAreaItem(area.area_id);
      }
      continue;
    }
    result.push({ ...item });
  }

  for (const area of areas) addAreaItem(area.area_id);
  return result;
}

/** Icon and label shown for a layout item in the editor. */
export function getWeatherStartItemMeta(
  item: WeatherStartLayoutItem,
  areas: readonly AreaRegistryEntry[],
  floors: readonly WeatherStartFloorOption[],
  customCards: readonly CustomCard[],
  customSections: readonly CustomSection[]
): { icon: string; label: string } {
  if (item.type === 'area') {
    const area = areas.find((entry) => entry.area_id === item.area_id);
    return { icon: area?.icon || 'mdi:home-outline', label: area?.name || item.area_id || localize('sections.areas') };
  }
  if (item.type === 'floor') {
    const floor = floors.find((entry) => entry.floor_id === (item.floor_id ?? null));
    return { icon: floor?.icon || 'mdi:floor-plan', label: item.title || floor?.name || localize('sections.areas') };
  }
  if (item.type === 'custom_card') {
    const card = customCards.find((entry, index) => getCustomCardRef(entry, index) === item.custom_card_id);
    return { icon: 'mdi:cards', label: getCustomCardEditorLabel(card, localize('editor.new_card')) };
  }
  if (item.type === 'custom_section') {
    const section = customSections.find((entry, index) => getCustomSectionRef(entry, index) === item.custom_section_id);
    return {
      icon: section?.icon || 'mdi:view-grid-plus-outline',
      label: section?.title || localize('editor.section_custom_sections'),
    };
  }

  const meta = WEATHER_START_BLOCK_META_MAP.get(item.type as WeatherStartKey);
  return { icon: meta?.icon || 'mdi:view-dashboard-outline', label: meta ? localize(meta.labelKey) : item.type };
}

/** Whether a layout item renders nothing with the current config and areas. */
export function isWeatherStartItemDisabled(
  item: WeatherStartLayoutItem,
  config: Simon42StrategyConfig,
  areas: readonly AreaRegistryEntry[],
  customCards: readonly CustomCard[],
  customSections: readonly CustomSection[]
): boolean {
  if (item.parsed_config) return false;
  if (item._yaml_error) return true;
  if (item.type === 'custom_card') {
    return !customCards.some(
      (entry, index) => getCustomCardRef(entry, index) === item.custom_card_id && entry.parsed_config
    );
  }
  if (item.type === 'custom_section') {
    return !customSections.some(
      (entry, index) =>
        getCustomSectionRef(entry, index) === item.custom_section_id &&
        (entry.cards || []).some((card) => card.parsed_config)
    );
  }
  if (item.type === 'floor') {
    return !areas.some((area) => (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id));
  }
  if (WEATHER_START_BLOCK_META_MAP.has(item.type as WeatherStartKey)) {
    return isWeatherStartBlockDisabled(config, item.type as WeatherStartKey);
  }
  return false;
}

/** Count grids with a fixed column count nested below the top level. */
export function countNestedFixedGrids(value: unknown, depth = 0): number {
  if (!value || typeof value !== 'object') return 0;
  if (Array.isArray(value)) return value.reduce<number>((sum, entry) => sum + countNestedFixedGrids(entry, depth), 0);
  const record = value as Record<string, unknown>;
  const own = depth > 0 && record.type === 'grid' && typeof record.columns === 'number' ? 1 : 0;
  return own + Object.values(record).reduce<number>((sum, entry) => sum + countNestedFixedGrids(entry, depth + 1), 0);
}
