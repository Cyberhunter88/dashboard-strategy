import type { WeatherStartKey } from '../types/strategy';
import { localize } from '../utils/localize';
import type { PanelMeta } from './panels/panel-shell';

export type EditorPanelKey =
  | 'overview' | 'summaries' | 'favorites' | 'areas' | 'appearance' | 'details'
  | 'areaOptions' | 'roomPins' | 'views' | 'advanced' | 'sectionOrder' | 'customContent';

const PANEL_DEFINITIONS: Record<EditorPanelKey, { key: string; icon: string; labelKey: string }> = {
  overview: { key: 'overview', icon: 'mdi:view-dashboard-outline', labelKey: 'editor.section_overview' },
  summaries: { key: 'summaries', icon: 'mdi:counter', labelKey: 'editor.section_summaries' },
  favorites: { key: 'favorites', icon: 'mdi:star-outline', labelKey: 'editor.section_favorites' },
  areas: { key: 'areas', icon: 'mdi:floor-plan', labelKey: 'editor.section_areas_rooms' },
  appearance: { key: 'appearance', icon: 'mdi:palette-outline', labelKey: 'editor.section_overview' },
  details: { key: 'details', icon: 'mdi:tune-variant', labelKey: 'editor.section_summaries' },
  areaOptions: { key: 'area-options', icon: 'mdi:home-cog-outline', labelKey: 'editor.section_areas' },
  roomPins: { key: 'room-pins', icon: 'mdi:pin-outline', labelKey: 'editor.section_room_pins' },
  views: { key: 'views', icon: 'mdi:tab', labelKey: 'editor.section_views' },
  advanced: { key: 'advanced-options', icon: 'mdi:cog-outline', labelKey: 'editor.section_advanced_options' },
  sectionOrder: { key: 'section-order', icon: 'mdi:sort', labelKey: 'editor.section_order' },
  customContent: { key: 'custom-content', icon: 'mdi:view-grid-plus-outline', labelKey: 'editor.section_custom_content' },
};

export function editorPanelMeta(key: EditorPanelKey): PanelMeta {
  const definition = PANEL_DEFINITIONS[key];
  return { key: definition.key, icon: definition.icon, label: localize(definition.labelKey) };
}

export const WEATHER_START_BLOCK_META: Readonly<Record<WeatherStartKey, { icon: string; labelKey: string }>> = {
  clock: { icon: 'mdi:clock-outline', labelKey: 'weather_start_blocks.clock' },
  date: { icon: 'mdi:calendar-today', labelKey: 'weather_start_blocks.date' },
  summaries: { icon: 'mdi:view-dashboard-outline', labelKey: 'weather_start_blocks.summaries' },
  favorites: { icon: 'mdi:star', labelKey: 'weather_start_blocks.favorites' },
  light_favorites: { icon: 'mdi:lightbulb-star-outline', labelKey: 'weather_start_blocks.light_favorites' },
  alarm: { icon: 'mdi:shield-home', labelKey: 'weather_start_blocks.alarm' },
  house_mode: { icon: 'mdi:home-switch-outline', labelKey: 'weather_start_blocks.house_mode' },
  search: { icon: 'mdi:magnify', labelKey: 'weather_start_blocks.search' },
  overview: { icon: 'mdi:overscan', labelKey: 'weather_start_blocks.overview' },
  weather_current: { icon: 'mdi:weather-partly-cloudy', labelKey: 'weather_start_blocks.weather_current' },
  weather_hourly: { icon: 'mdi:clock-time-four-outline', labelKey: 'weather_start_blocks.weather_hourly' },
  weather_daily: { icon: 'mdi:calendar-week', labelKey: 'weather_start_blocks.weather_daily' },
  weather_details: { icon: 'mdi:gauge', labelKey: 'weather_start_blocks.weather_details' },
  energy: { icon: 'mdi:lightning-bolt', labelKey: 'weather_start_blocks.energy' },
  plants: { icon: 'mdi:flower', labelKey: 'weather_start_blocks.plants' },
  agenda: { icon: 'mdi:calendar', labelKey: 'weather_start_blocks.agenda' },
  todos: { icon: 'mdi:check-circle-outline', labelKey: 'weather_start_blocks.todos' },
  persons: { icon: 'mdi:account-group', labelKey: 'weather_start_blocks.persons' },
  vacuums: { icon: 'mdi:robot-vacuum', labelKey: 'weather_start_blocks.vacuums' },
  maintenance: { icon: 'mdi:wrench-clock', labelKey: 'weather_start_blocks.maintenance' },
  areas: { icon: 'mdi:floor-plan', labelKey: 'weather_start_blocks.areas' },
  custom_cards: { icon: 'mdi:cards', labelKey: 'weather_start_blocks.custom_cards' },
  custom_sections: { icon: 'mdi:view-grid-plus-outline', labelKey: 'weather_start_blocks.custom_sections' },
};
