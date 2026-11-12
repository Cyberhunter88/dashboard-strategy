// ====================================================================
// Editor option search
// ====================================================================
// Pure index and filter behind the editor's search field and the
// "changed options only" switch. It reads the option metadata and a small
// list of structured options; it never writes to the configuration.
// ====================================================================

import type { Simon42StrategyConfig } from '../types/strategy';
import { CONFIG_ALIASES } from '../utils/config-aliases';
import { localize } from '../utils/localize';
import { getOptionDefault, getOptionMetadata, OPTION_METADATA } from '../utils/option-metadata';
import { editorPanelMeta, type EditorPanelKey } from './editor-panel-registry';

/** Editor panel that renders each metadata option; `null` means YAML only. */
export const OPTION_PANELS: Readonly<Record<keyof typeof OPTION_METADATA, EditorPanelKey | null>> = {
  weather_entity: 'overview',
  overview_max_columns: 'overview',
  overview_area_card_columns: 'overview',
  weather_start_weather_mode: 'overview',
  weather_start_date_card: 'overview',
  show_light_summary: 'summaries',
  show_covers_summary: 'summaries',
  show_security_summary: 'summaries',
  show_climate_summary: 'summaries',
  show_battery_summary: 'summaries',
  show_windows_summary: 'summaries',
  compact_overview_summaries: 'summaries',
  show_person_badges: 'appearance',
  show_unavailable_alert_badge: 'appearance',
  show_now_playing_badge: 'appearance',
  show_sun_badge: 'appearance',
  show_updates_badge: 'appearance',
  show_clock_card: 'appearance',
  show_search_card: 'appearance',
  house_mode_entity: 'appearance',
  alarm_entity: 'appearance',
  power_badge_entity: 'appearance',
  show_security_view: 'details',
  group_security_by_areas: 'details',
  hide_hidden_areas_in_security: 'details',
  show_security_activity: 'details',
  show_light_view: 'details',
  group_lights_by_floors: 'details',
  group_lights_by_areas: 'details',
  nested_light_groups: 'details',
  show_covers_view: 'details',
  group_covers_by_floors: 'details',
  group_covers_by_areas: 'details',
  show_partially_open_covers: 'details',
  show_climate_view: 'details',
  show_climate_air_quality: 'details',
  show_battery_view: 'details',
  show_area_in_battery_view: 'details',
  group_batteries_by_areas: 'details',
  hide_mobile_app_batteries: 'details',
  hide_battery_notes_entities: 'details',
  battery_critical_threshold: 'details',
  battery_low_threshold: 'details',
  hide_unavailable_entities: 'advanced',
  dense_section_placement: 'advanced',
  hide_completed_todos: 'advanced',
  favorites_show_state: 'favorites',
  favorites_hide_last_changed: 'favorites',
  room_pins_show_state: 'roomPins',
  room_pins_hide_last_changed: 'roomPins',
  group_by_floors: 'areaOptions',
  show_switches_on_areas: 'areaOptions',
  show_alerts_on_areas: 'areaOptions',
  show_locks_in_rooms: 'areaOptions',
  show_automations_in_rooms: 'areaOptions',
  show_scripts_in_rooms: 'areaOptions',
  show_vacuums_section_in_rooms: 'areaOptions',
  show_switches_section_in_rooms: 'areaOptions',
  show_cover_controls_in_rooms: 'areaOptions',
  show_cameras_in_rooms: 'areaOptions',
  camera_live_toggle: 'areaOptions',
  camera_pause_when_hidden: 'areaOptions',
  show_energy_in_rooms: 'areaOptions',
  show_ups_in_rooms: 'areaOptions',
  hide_grouped_climate_members: 'areaOptions',
  show_window_contacts_in_rooms: 'areaOptions',
  show_door_contacts_in_rooms: 'areaOptions',
  use_default_area_sort: 'areaOptions',
  show_cctv_view: 'views',
  show_maintenance_view: 'views',
  camera_renderer: null,
};

/** Lists and objects have no scalar metadata; they count as changed when non-empty. */
const STRUCTURED_OPTIONS: readonly { key: keyof Simon42StrategyConfig; labelKey: string; panel: EditorPanelKey }[] = [
  { key: 'favorite_entities', labelKey: 'editor.section_favorites', panel: 'favorites' },
  { key: 'light_favorite_entities', labelKey: 'editor.section_favorites', panel: 'favorites' },
  { key: 'room_pin_entities', labelKey: 'editor.section_room_pins', panel: 'roomPins' },
  { key: 'areas_display', labelKey: 'editor.section_areas_rooms', panel: 'areas' },
  { key: 'areas_options', labelKey: 'editor.section_areas', panel: 'areaOptions' },
  { key: 'custom_views', labelKey: 'editor.section_views', panel: 'views' },
  { key: 'custom_cards', labelKey: 'editor.section_custom_content', panel: 'customContent' },
  { key: 'custom_sections', labelKey: 'editor.section_custom_content', panel: 'customContent' },
  { key: 'custom_badges', labelKey: 'editor.section_custom_content', panel: 'customContent' },
  { key: 'sections_order', labelKey: 'editor.section_order', panel: 'sectionOrder' },
  { key: 'weather_start_order', labelKey: 'editor.section_order', panel: 'sectionOrder' },
  { key: 'weather_start_layout_items', labelKey: 'editor.section_order', panel: 'sectionOrder' },
];

export interface OptionSearchResult {
  key: string;
  label: string;
  description: string;
  panel: EditorPanelKey | null;
  panelLabel: string;
  changed: boolean;
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function translated(key: string): string {
  const value = localize(key);
  // localize() returns the key itself when no translation exists.
  return value === key ? '' : value;
}

function readValue(config: Simon42StrategyConfig, key: string): unknown {
  const values = config as Record<string, unknown>;
  if (values[key] !== undefined) return values[key];
  for (const alias of (CONFIG_ALIASES as Record<string, readonly string[]>)[key] ?? []) {
    if (values[alias] !== undefined) return values[alias];
  }
  return undefined;
}

/** True when the configuration sets the option to something other than its default. */
export function isOptionChanged(config: Simon42StrategyConfig, key: string): boolean {
  const value = readValue(config, key);
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  const metadata = getOptionMetadata(key);
  if (!metadata) return true;
  if (metadata.kind === 'entity') return true;
  const defaultValue = getOptionDefault(key, config);
  // Options without a default (automatic maintenance view) count as changed once set explicitly.
  return defaultValue === undefined ? true : value !== defaultValue;
}

function buildEntries(config: Simon42StrategyConfig): OptionSearchResult[] {
  const entries: OptionSearchResult[] = [];
  for (const [key, definition] of Object.entries(OPTION_METADATA)) {
    const panel = OPTION_PANELS[key as keyof typeof OPTION_METADATA];
    entries.push({
      key,
      label: translated(definition.labelKey),
      description: translated(`${definition.labelKey}_desc`),
      panel,
      panelLabel: panel ? editorPanelMeta(panel).label : '',
      changed: isOptionChanged(config, key),
    });
  }
  for (const { key, labelKey, panel } of STRUCTURED_OPTIONS) {
    entries.push({
      key,
      label: translated(labelKey),
      description: '',
      panel,
      panelLabel: editorPanelMeta(panel).label,
      changed: isOptionChanged(config, key),
    });
  }
  return entries;
}

/**
 * Finds options by label, description, panel name, or configuration key (all words must match,
 * accents ignored). An empty query lists nothing unless `changedOnly` is set.
 */
export function searchOptions(
  config: Simon42StrategyConfig,
  query: string,
  changedOnly: boolean
): OptionSearchResult[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length && !changedOnly) return [];

  const scored: Array<{ entry: OptionSearchResult; score: number }> = [];
  for (const entry of buildEntries(config)) {
    if (changedOnly && !entry.changed) continue;
    const label = normalize(entry.label);
    const key = normalize(entry.key);
    const rest = normalize(`${entry.description} ${entry.panelLabel}`);
    if (!words.every((word) => label.includes(word) || key.includes(word) || rest.includes(word))) continue;
    scored.push({
      entry,
      score: words.reduce((sum, word) => sum + (label.includes(word) ? 2 : key.includes(word) ? 1 : 0), 0),
    });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label))
    .map(({ entry }) => entry);
}
