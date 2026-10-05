import type { Simon42StrategyConfig } from '../types/strategy';
import { CONFIG_ALIASES } from './config-aliases';
import { usesDefaultWeatherStartLayout } from './weather-start-defaults';

type ScalarOptionKey = {
  [K in keyof Simon42StrategyConfig]-?: NonNullable<Simon42StrategyConfig[K]> extends string | number | boolean
    ? K
    : never;
}[keyof Simon42StrategyConfig];
type OptionMetadata<K extends ScalarOptionKey> = {
  kind: 'boolean' | 'select' | 'number' | 'entity';
  defaultValue?: Simon42StrategyConfig[K];
  labelKey: string;
  values?: readonly Simon42StrategyConfig[K][];
  min?: number;
  max?: number;
  dependencies?: readonly { option: ScalarOptionKey; value: string | boolean }[];
  aliases?: readonly string[];
};
type Metadata = { [K in ScalarOptionKey]?: OptionMetadata<K> };

/** Describes existing options; never materializes defaults into user YAML. */
export const OPTION_METADATA = {
  hide_unavailable_entities: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_unavailable_entities',
    values: [true, false],
  },
  dense_section_placement: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.dense_section_placement',
    values: [true, false],
  },
  show_light_summary: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_light_summary',
    values: [true, false],
  },
  show_covers_summary: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_covers_summary',
    values: [true, false],
  },
  show_security_summary: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_security_summary',
    values: [true, false],
  },
  show_climate_summary: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_climate_summary',
    values: [true, false],
  },
  show_battery_summary: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_battery_summary',
    values: [true, false],
  },
  show_person_badges: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_person_badges',
    values: [true, false],
  },
  show_unavailable_alert_badge: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_unavailable_alert_badge',
    values: [true, false],
  },
  show_now_playing_badge: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_now_playing_badge',
    values: [true, false],
  },
  show_sun_badge: { kind: 'boolean', defaultValue: false, labelKey: 'editor.show_sun_badge', values: [true, false] },
  show_updates_badge: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_updates_badge',
    values: [true, false],
  },
  show_clock_card: { kind: 'boolean', defaultValue: true, labelKey: 'editor.show_clock_card', values: [true, false] },
  show_search_card: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_search_card',
    values: [true, false],
  },
  show_security_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_security_view',
    values: [true, false],
  },
  group_security_by_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_security_by_areas',
    values: [true, false],
  },
  hide_hidden_areas_in_security: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_hidden_areas_in_security',
    values: [true, false],
  },
  show_security_activity: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_security_activity',
    values: [true, false],
  },
  show_light_view: { kind: 'boolean', defaultValue: false, labelKey: 'editor.show_light_view', values: [true, false] },
  group_lights_by_floors: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_lights_by_floors',
    values: [true, false],
  },
  group_lights_by_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_lights_by_areas',
    values: [true, false],
  },
  show_covers_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_covers_view',
    values: [true, false],
  },
  group_covers_by_floors: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_covers_by_floors',
    values: [true, false],
  },
  group_covers_by_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_covers_by_areas',
    values: [true, false],
  },
  show_climate_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_climate_view',
    values: [true, false],
  },
  nested_light_groups: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.nested_light_groups',
    values: [true, false],
  },
  show_partially_open_covers: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_partially_open_covers',
    values: [true, false],
  },
  hide_mobile_app_batteries: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_mobile_app_batteries',
    values: [true, false],
  },
  hide_battery_notes_entities: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_battery_notes_entities',
    values: [true, false],
  },
  show_battery_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_battery_view',
    values: [true, false],
  },
  show_area_in_battery_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_area_in_battery_view',
    values: [true, false],
  },
  group_batteries_by_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.group_batteries_by_areas',
    values: [true, false],
  },
  favorites_show_state: { kind: 'boolean', defaultValue: false, labelKey: 'editor.show_state', values: [true, false] },
  favorites_hide_last_changed: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_last_changed',
    values: [true, false],
  },
  group_by_floors: { kind: 'boolean', defaultValue: false, labelKey: 'editor.group_by_floors', values: [true, false] },
  show_switches_on_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_switches_on_areas',
    values: [true, false],
  },
  show_alerts_on_areas: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_alerts_on_areas',
    values: [true, false],
  },
  show_locks_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_locks_in_rooms',
    values: [true, false],
  },
  show_automations_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_automations_in_rooms',
    values: [true, false],
  },
  show_scripts_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_scripts_in_rooms',
    values: [true, false],
  },
  show_vacuums_section_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_vacuums_section_in_rooms',
    values: [true, false],
  },
  show_switches_section_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_switches_section_in_rooms',
    values: [true, false],
  },
  show_cover_controls_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_cover_controls_in_rooms',
    values: [true, false],
  },
  show_cameras_in_rooms: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_cameras_in_rooms',
    values: [true, false],
  },
  camera_live_toggle: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.camera_live_toggle',
    values: [true, false],
  },
  show_energy_in_rooms: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_energy_in_rooms',
    values: [true, false],
  },
  show_ups_in_rooms: {
    kind: 'boolean',
    defaultValue: true,
    labelKey: 'editor.show_ups_in_rooms',
    values: [true, false],
  },
  show_window_contacts_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_window_contacts_in_rooms',
    values: [true, false],
  },
  show_door_contacts_in_rooms: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_door_contacts_in_rooms',
    values: [true, false],
  },
  use_default_area_sort: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.use_default_area_sort',
    values: [true, false],
  },
  room_pins_show_state: { kind: 'boolean', defaultValue: false, labelKey: 'editor.show_state', values: [true, false] },
  room_pins_hide_last_changed: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.hide_last_changed',
    values: [true, false],
  },
  overview_max_columns: {
    kind: 'select',
    defaultValue: 3,
    labelKey: 'editor.overview_max_columns',
    values: [1, 2, 3, 4],
  },
  overview_area_card_columns: {
    kind: 'select',
    defaultValue: 'full',
    labelKey: 'editor.overview_area_card_columns',
    values: ['full', 6, 4],
  },
  weather_start_weather_mode: {
    kind: 'select',
    labelKey: 'editor.weather_start_weather_mode',
    values: ['full', 'compact_hourly'],
  },
  weather_start_date_card: {
    kind: 'select',
    defaultValue: 'button-card',
    labelKey: 'editor.weather_start_date_card',
    values: ['button-card', 'markdown'],
  },
  battery_critical_threshold: {
    kind: 'number',
    defaultValue: 20,
    labelKey: 'editor.battery_critical_below',
    min: 0,
    max: 100,
  },
  battery_low_threshold: { kind: 'number', defaultValue: 50, labelKey: 'editor.battery_low_below', min: 0, max: 100 },
  camera_renderer: {
    kind: 'select',
    defaultValue: 'native',
    labelKey: 'editor.camera_renderer',
    values: ['native', 'webrtc'],
  },
  camera_pause_when_hidden: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.camera_pause_when_hidden',
    values: [true, false],
    dependencies: [
      { option: 'camera_renderer', value: 'native' },
      { option: 'camera_live_toggle', value: true },
    ],
  },
  show_cctv_view: {
    kind: 'boolean',
    defaultValue: false,
    labelKey: 'editor.show_cctv_view',
    values: [true, false],
    aliases: CONFIG_ALIASES.show_cctv_view,
  },
  show_maintenance_view: {
    kind: 'boolean',
    labelKey: 'editor.show_maintenance_view',
    values: [true, false],
    aliases: CONFIG_ALIASES.show_maintenance_view,
  },
  house_mode_entity: { kind: 'entity', labelKey: 'editor.house_mode_entity' },
  alarm_entity: { kind: 'entity', labelKey: 'editor.alarm_entity' },
  weather_entity: { kind: 'entity', labelKey: 'editor.weather_entity' },
  power_badge_entity: { kind: 'entity', labelKey: 'editor.power_badge_entity' },
} satisfies Metadata;

export function getOptionMetadata(key: string): OptionMetadata<ScalarOptionKey> | undefined {
  return (OPTION_METADATA as Metadata)[key as ScalarOptionKey];
}

export function getOptionDefault(key: string, config: Simon42StrategyConfig, fallback?: unknown): unknown {
  if (key === 'weather_start_weather_mode') return usesDefaultWeatherStartLayout(config) ? 'compact_hourly' : 'full';
  // Unset maintenance visibility is intentionally automatic, never false.
  return getOptionMetadata(key)?.defaultValue ?? fallback;
}
