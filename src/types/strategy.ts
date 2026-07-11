// ====================================================================
// Simon42 Dashboard Strategy Types
// ====================================================================
// All configuration and data types specific to the simon42 strategy.
// These types cover the YAML config schema and internal data structures
// used throughout the strategy codebase.
// ====================================================================

import type { LovelaceCardConfig } from './lovelace';

// -- Section Ordering -------------------------------------------------

export type SectionKey =
  | 'overview'
  | 'custom_cards'
  | 'custom_sections'
  | 'areas'
  | 'weather'
  | 'energy'
  | 'plants'
  | 'agenda'
  | 'todos'
  | 'persons'
  | 'vacuums'
  | 'maintenance';

export type HeadingKey =
  | 'overview'
  | 'summaries'
  | 'favorites'
  | 'custom_cards'
  | 'custom_sections'
  | 'areas'
  | 'areas_other'
  | 'weather'
  | 'energy'
  | 'plants'
  | 'agenda'
  | 'todos'
  | 'persons'
  | 'vacuums'
  | 'maintenance';

export const ALL_HEADING_KEYS: HeadingKey[] = [
  'overview',
  'summaries',
  'favorites',
  'custom_cards',
  'custom_sections',
  'areas',
  'areas_other',
  'weather',
  'energy',
  'plants',
  'agenda',
  'todos',
  'persons',
  'vacuums',
  'maintenance',
];

export const DEFAULT_SECTIONS_ORDER: SectionKey[] = [
  'overview',
  'custom_cards',
  'custom_sections',
  'areas',
  'weather',
  'energy',
  'plants',
  'agenda',
  'todos',
  'persons',
  'vacuums',
  'maintenance',
];

export type OverviewLayout = 'default' | 'weather_start';
export type LightsSortBy = 'last_changed' | 'name';
export type PersonBadgeLayout = 'minimal' | 'with_state' | 'with_state_and_time';
export type WeatherPresentation =
  | 'forecast_daily'
  | 'forecast_hourly'
  | 'forecast_twice_daily'
  | 'tile'
  | 'none';

export interface WeatherSensorConfig {
  entity: string;
  icon?: string;
  unit?: string;
  round?: number;
}

// -- Weather-Start Block Ordering --------------------------------------

export type WeatherStartKey =
  | 'clock'
  | 'date'
  | 'summaries'
  | 'weather_current'
  | 'weather_hourly'
  | 'weather_daily'
  | 'areas'
  | 'custom_cards'
  | 'custom_sections';

export const DEFAULT_WEATHER_START_ORDER: WeatherStartKey[] = [
  'clock',
  'date',
  'summaries',
  'weather_current',
  'weather_hourly',
  'weather_daily',
  'custom_cards',
  'custom_sections',
  'areas',
];

// -- Weather-Start Block Config (per-block YAML override) --------------

export interface WeatherStartBlockConfig {
  /** Raw YAML string entered by the user in the editor */
  yaml?: string;
  /** Parsed cards array (list of Lovelace card configs) */
  parsed_config?: Record<string, any>[] | null;
  /** YAML parse error message, if any */
  _yaml_error?: string;
}

export type WeatherStartLayoutItemType = WeatherStartKey | 'area' | 'floor' | 'custom_card' | 'custom_section';

export interface WeatherStartLayoutItem {
  /** Stable item id for drag/drop and references */
  id: string;
  /** Built-in block type or a free-layout item type */
  type: WeatherStartLayoutItemType;
  /** Area id for type=area */
  area_id?: string;
  /** Floor id for type=floor. Use null/undefined for areas without a floor. */
  floor_id?: string | null;
  /** Custom card id for type=custom_card */
  custom_card_id?: string;
  /** Custom section id for type=custom_section */
  custom_section_id?: string;
  /** Optional editor/display title */
  title?: string;
  /** Summary card size for type=summaries on the weather start page */
  summary_size?: 'mini' | 'normal';
  /** Render this item below the previous item in the same dashboard section */
  stack_with_previous?: boolean;
  /** Raw YAML override for built-in and area items */
  yaml?: string;
  /** Parsed card/section config generated from yaml */
  parsed_config?: Record<string, any> | Record<string, any>[] | null;
  /** YAML parse error message, if any */
  _yaml_error?: string;
}

export type CameraRenderer = 'native' | 'webrtc';

export interface CameraWebrtcStreamConfig {
  url?: string;
  entity?: string;
  poster?: string;
  mode?: string;
  media?: string;
  muted?: boolean;
  ui?: boolean;
  server?: string;
  style?: string;
}

export type CameraWebrtcStreamsConfig = Record<string, string | CameraWebrtcStreamConfig>;

// -- Stack Ordering (per-area room view) ------------------------------

export type StackKey =
  | 'ups'
  | 'energy'
  | 'cameras'
  | 'lights'
  | 'locks'
  | 'climate'
  | 'covers'
  | 'covers_curtain'
  | 'covers_window'
  | 'media'
  | 'scenes'
  | 'misc'
  | 'automations'
  | 'scripts'
  | 'room_pins';

export const DEFAULT_STACKS_ORDER: StackKey[] = [
  'ups',
  'energy',
  'cameras',
  'lights',
  'locks',
  'climate',
  'covers',
  'covers_window',
  'media',
  'scenes',
  'misc',
  'room_pins',
];

// -- Main Strategy Config ---------------------------------------------

export interface Simon42StrategyConfig {
  // Appearance
  theme?: string; // default: Home Assistant/user default

  // Global toggles
  show_weather?: boolean; // default: true
  show_weather_forecast_card?: boolean; // legacy bool; default: true
  weather_presentation?: WeatherPresentation; // default: 'forecast_daily'
  weather_sensors?: WeatherSensorConfig[]; // default: []
  show_energy?: boolean; // default: true
  show_energy_distribution_card?: boolean; // default: true
  show_search_card?: boolean; // default: false
  show_summary_views?: boolean; // default: false
  show_room_views?: boolean; // default: false
  show_cctv_view?: boolean; // default: false
  cctv_show_activity?: boolean; // default: false
  pollen_entities?: string[];
  group_by_floors?: boolean; // default: false
  group_covers_by_floors?: boolean; // default: false
  show_covers_summary?: boolean; // default: true
  show_partially_open_covers?: boolean; // default: false
  show_clock_card?: boolean; // default: true
  show_person_badges?: boolean; // default: true
  person_badge_layout?: PersonBadgeLayout; // default: 'with_state'
  show_light_summary?: boolean; // default: true
  group_lights_by_floors?: boolean; // default: false
  nested_light_groups?: boolean; // default: false
  lights_sort_by?: LightsSortBy; // default: 'last_changed'
  show_security_summary?: boolean; // default: true
  show_battery_summary?: boolean; // default: true
  show_battery_view?: boolean; // default: false (summary remains the main trigger)
  show_climate_summary?: boolean; // default: false
  hide_mobile_app_batteries?: boolean; // default: false
  hide_battery_notes_entities?: boolean; // default: false
  battery_critical_threshold?: number; // default: 20
  battery_low_threshold?: number; // default: 50
  show_area_in_battery_view?: boolean; // default: false
  unavailable_batteries_bucket?: 'critical' | 'good'; // default: 'good'
  show_locks_in_rooms?: boolean; // default: false
  show_automations_in_rooms?: boolean; // default: false
  show_scripts_in_rooms?: boolean; // default: false
  show_vacuums_section_in_rooms?: boolean; // default: false
  show_ups_in_rooms?: boolean; // default: true (Opt-out, anders als die übrigen show_*_in_rooms)
  show_energy_in_rooms?: boolean; // default: true (keeps current behavior)
  show_window_contacts_in_rooms?: boolean; // default: false
  show_door_contacts_in_rooms?: boolean; // default: false
  show_switches_on_areas?: boolean; // default: false
  show_alerts_on_areas?: boolean; // default: false
  energy_link_dashboard?: boolean; // default: true
  power_badge_entity?: string;
  show_unavailable_alert_badge?: boolean; // default: false
  show_now_playing_badge?: boolean; // default: false
  show_sun_badge?: boolean; // default: false
  show_updates_badge?: boolean; // default: false
  hide_unavailable_entities?: boolean; // default: false
  show_plants_section?: boolean; // default: false
  show_agenda_section?: boolean; // default: false
  agenda_calendar_entities?: string[];
  show_todos_section?: boolean; // default: false
  todos_entities?: string[];
  show_persons_section?: boolean; // default: false
  show_vacuums_section?: boolean; // default: false
  show_maintenance_section?: boolean; // default: false
  camera_renderer?: CameraRenderer; // default: 'native'
  camera_live_toggle?: boolean; // default: false
  camera_webrtc_streams?: CameraWebrtcStreamsConfig;

  // Layout
  overview_layout?: OverviewLayout; // default: 'default'
  sections_order?: SectionKey[]; // default: DEFAULT_SECTIONS_ORDER
  section_visibility?: Partial<Record<SectionKey, { entity: string; state: string }>>;
  weather_start_order?: WeatherStartKey[]; // default: DEFAULT_WEATHER_START_ORDER
  weather_start_layout_items?: WeatherStartLayoutItem[];
  summaries_columns?: 2 | 4; // default: 2
  dense_section_placement?: boolean; // default: false
  hidden_section_headings?: HeadingKey[]; // default: []

  // Favorites display
  favorites_show_state?: boolean; // default: false
  favorites_hide_last_changed?: boolean; // default: false
  room_pins_show_state?: boolean; // default: false
  room_pins_hide_last_changed?: boolean; // default: false

  // Legacy weather-start layout font sizes (kept for backwards-compatible YAML)
  clock_size?: number;
  date_size?: number;

  // Special entities
  alarm_entity?: string;
  weather_entity?: string;
  favorite_entities?: string[];
  room_pin_entities?: string[];

  // Per-block YAML overrides for weather_start layout blocks
  weather_start_blocks_config?: Partial<Record<WeatherStartKey, WeatherStartBlockConfig>>;

  // Area management
  use_default_area_sort?: boolean; // default: false
  areas_display?: AreasDisplay;
  areas_options?: Record<string, AreaOptions>;

  // Custom views
  custom_views?: CustomView[];

  // Custom cards (shown as own section on overview)
  custom_cards?: CustomCard[];
  custom_cards_heading?: string;
  custom_cards_icon?: string;

  // Custom sections (multiple complete sections on overview, each with own heading + cards)
  custom_sections?: CustomSection[];

  // Custom badges (shown in header next to person chips)
  custom_badges?: CustomBadge[];

  // Inline editor persistence for generated cards/sections
  inline_editor?: InlineEditorConfig;
}

export interface InlineCardOverride {
  yaml: string;
  parsed_config?: LovelaceCardConfig | null;
  source_hash?: string;
  updated_at?: string;
}

export interface InlineViewEdits {
  generated_card_overrides?: Record<string, InlineCardOverride>;
  hidden_generated_cards?: string[];
  section_order?: string[];
}

export interface InlineEditorConfig {
  version: number;
  views?: Record<string, InlineViewEdits>;
}

// -- Area Management --------------------------------------------------

export interface AreasDisplay {
  hidden?: string[];
  order?: string[];
  nav_items?: string[];
}

export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
  custom_cards?: AreaCustomCard[];
  stacks_order?: StackKey[]; // default: DEFAULT_STACKS_ORDER
  view_override?: AreaViewOverride;
}

export interface AreaViewOverride {
  /** Raw full Lovelace view YAML entered in the editor */
  yaml?: string;
  /** Parsed Lovelace view config used by the strategy at runtime */
  parsed_config?: Record<string, any> | null;
  /** Editor-only YAML parse error */
  _yaml_error?: string;
}

export interface GroupOptions {
  hidden?: string[];
  order?: string[];
  additional?: string[]; // Extra entities to include (used by badges group)
  names_visible?: string[]; // Override show_name to true (used by badges group)
  names_hidden?: string[]; // Override show_name to false (used by badges group)
  [key: string]: unknown;
}

// -- Custom Views -----------------------------------------------------

export interface CustomView {
  /** View title shown in the navigation */
  title?: string;
  /** URL path for the view */
  path?: string;
  /** MDI icon for the view tab */
  icon?: string;
  /** Raw YAML string entered by the user in the editor */
  yaml?: string;
  /** Parsed Lovelace view config (generated from yaml) */
  parsed_config?: Record<string, any> | null;
  /** YAML parse error message, if any */
  _yaml_error?: string;
}

// -- Custom Badges ----------------------------------------------------

export interface CustomBadge {
  /** Raw YAML string entered by the user in the editor */
  yaml?: string;
  /** Parsed Lovelace badge config (generated from yaml) */
  parsed_config?: Record<string, any> | null;
  /** YAML parse error message, if any */
  _yaml_error?: string;
}

// -- Custom Cards -----------------------------------------------------

export interface CustomCard {
  /** Stable id used by free weather-start layout items */
  id?: string;
  /** Optional editor-only name used for lists and drag/drop labels */
  editor_title?: string;
  /** Optional title shown as heading above the card on the dashboard */
  title?: string;
  /** Target section where this card appears (default: 'custom_cards') */
  target_section?: SectionKey;
  /** Raw YAML string entered by the user in the editor */
  yaml?: string;
  /** Parsed Lovelace card config (generated from yaml) */
  parsed_config?: Record<string, any> | null;
  /** YAML parse error message, if any */
  _yaml_error?: string;
}

// -- Custom Sections (multiple complete sections on overview) ---------

export interface CustomSection {
  /** Stable id used by free weather-start layout items */
  id?: string;
  /** Heading text for this section */
  title?: string;
  /** MDI icon for this section */
  icon?: string;
  /** Cards within this section */
  cards?: CustomCard[];
  /** Complete Lovelace section YAML; legacy cards remain supported. */
  yaml?: string;
  /** Parsed complete section, single card, or card list. */
  parsed_config?: unknown;
  _yaml_error?: string;
}

// -- Area Custom Cards (per-area room view) ---------------------------

export interface AreaCustomCard {
  /** Eingabemodus: freies YAML oder geführte Entity-Kachel */
  mode?: 'yaml' | 'tile' | 'section'; // default: 'yaml'
  /** Platzierung relativ zu den Auto-Sektionen der Raumansicht */
  position?: 'top' | 'bottom'; // default: 'bottom'
  /** Optionaler Editor-only Name fuer Listen und Sortierung */
  editor_title?: string;
  /** Optionale Überschrift (rendert als heading-Card davor) */
  title?: string;
  // --- YAML-Modus ---
  /** Roh-YAML-String aus dem Editor */
  yaml?: string;
  /** Geparste Lovelace-Card-Config (aus yaml erzeugt) */
  parsed_config?: Record<string, any> | Record<string, any>[] | null;
  /** YAML-Parse-Fehlermeldung, falls vorhanden */
  _yaml_error?: string;
  // --- Geführter Kachel-Modus ---
  /** Entity-ID für `{ type: 'tile', entity }` */
  entity?: string;
}

// -- Room Entities (entity collections per area) ----------------------

export interface RoomEntities {
  lights: string[];
  covers: string[];
  covers_curtain: string[];
  covers_window: string[];
  scenes: string[];
  climate: string[];
  media_player: string[];
  vacuum: string[];
  fan: string[];
  humidifier: string[];
  valve: string[];
  water_heater: string[];
  switches: string[];
  locks: string[];
  automations: string[];
  scripts: string[];
  cameras: string[];
  ups: string[];
  energy: string[];
  [key: string]: string[];
}

// -- Sensor Entities (sensor types discovered per area) ---------------

export interface SensorEntities {
  temperature: string[];
  humidity: string[];
  pm25: string[];
  pm10: string[];
  co2: string[];
  voc: string[];
  motion: string[];
  occupancy: string[];
  illuminance: string[];
  absolute_humidity: string[];
  battery: string[];
  window: string[];
  door: string[];
  smoke: string[];
  gas: string[];
}

// -- Person Data (used in overview badges) ----------------------------

export interface PersonData {
  entity_id: string;
  name: string;
  state: string;
  isHome: boolean;
}

// -- Summary Types (used by summary cards) ----------------------------

export type SummaryType = 'lights' | 'covers' | 'security' | 'batteries' | 'climate';

// -- Resolved Area (internal, enriched area for rendering) ------------

export interface ResolvedArea {
  area_id: string;
  name: string;
  icon: string | null;
  floor_id: string | null;
  floor_name: string | null;
  floor_level: number | null;
  entities: RoomEntities;
  sensors: SensorEntities;
  temperature_entity_id: string | null;
  humidity_entity_id: string | null;
}

// -- Floor Group (areas grouped by floor) -----------------------------

export interface FloorGroup {
  floor_id: string | null;
  floor_name: string;
  floor_level: number | null;
  floor_icon: string | null;
  areas: ResolvedArea[];
}

// -- Strategy Generate Result -----------------------------------------

export interface StrategyDashboardConfig {
  title?: string;
  views: StrategyViewConfig[];
}

export interface StrategyViewConfig {
  title?: string;
  path?: string;
  icon?: string;
  type?: string;
  subview?: boolean;
  max_columns?: number;
  dense_section_placement?: boolean;
  badges?: Record<string, any>[];
  header?: Record<string, any>;
  sections?: Record<string, any>[];
  cards?: Record<string, any>[];
  strategy?: { type: string; [key: string]: any };
}
