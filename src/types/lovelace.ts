// ====================================================================
// Lovelace Configuration Types
// ====================================================================
// Types for the Lovelace dashboard config objects that the strategy
// generates (views, sections, cards, badges) and receives as input.
// ====================================================================

// -- Strategy Config --------------------------------------------------

export interface LovelaceStrategyConfig {
  type: string;
  [key: string]: any;
}

// -- Cards ------------------------------------------------------------

export interface LovelaceCardConfig {
  type: string;
  grid_options?: LovelaceGridOptions;
  visibility?: LovelaceCondition[];
  [key: string]: any;
}

export interface LovelaceTileCardFeatureBase {
  type: string;
  [key: string]: any;
}

export interface LightBrightnessTileFeature extends LovelaceTileCardFeatureBase {
  type: 'light-brightness';
}

export interface ClimateHvacModesTileFeature extends LovelaceTileCardFeatureBase {
  type: 'climate-hvac-modes';
}

export interface CoverOpenCloseTileFeature extends LovelaceTileCardFeatureBase {
  type: 'cover-open-close';
}

export interface FanSpeedTileFeature extends LovelaceTileCardFeatureBase {
  type: 'fan-speed';
}

export interface LockCommandsTileFeature extends LovelaceTileCardFeatureBase {
  type: 'lock-commands';
}

export interface MediaPlayerPlaybackTileFeature extends LovelaceTileCardFeatureBase {
  type: 'media-player-playback';
}

export interface MediaPlayerSourceTileFeature extends LovelaceTileCardFeatureBase {
  type: 'media-player-source';
}

export interface MediaPlayerSoundModeTileFeature extends LovelaceTileCardFeatureBase {
  type: 'media-player-sound-mode';
}

export interface NumericInputTileFeature extends LovelaceTileCardFeatureBase {
  type: 'numeric-input';
}

export interface SelectOptionsTileFeature extends LovelaceTileCardFeatureBase {
  type: 'select-options';
}

export interface ToggleTileFeature extends LovelaceTileCardFeatureBase {
  type: 'toggle';
}

export interface UpdateActionsTileFeature extends LovelaceTileCardFeatureBase {
  type: 'update-actions';
}

export interface VacuumCommandsTileFeature extends LovelaceTileCardFeatureBase {
  type: 'vacuum-commands';
}

export interface LawnMowerCommandsTileFeature extends LovelaceTileCardFeatureBase {
  type: 'lawn-mower-commands';
}

export type LovelaceTileCardFeatureConfig =
  | LightBrightnessTileFeature
  | ClimateHvacModesTileFeature
  | CoverOpenCloseTileFeature
  | FanSpeedTileFeature
  | LockCommandsTileFeature
  | MediaPlayerPlaybackTileFeature
  | MediaPlayerSourceTileFeature
  | MediaPlayerSoundModeTileFeature
  | NumericInputTileFeature
  | SelectOptionsTileFeature
  | ToggleTileFeature
  | UpdateActionsTileFeature
  | VacuumCommandsTileFeature
  | LawnMowerCommandsTileFeature
  | LovelaceTileCardFeatureBase;

export interface LovelaceTileCardConfig extends LovelaceCardConfig {
  type: 'tile';
  entity: string;
  vertical?: boolean;
  name?: string;
  color?: string;
  show_entity_picture?: boolean;
  features?: LovelaceTileCardFeatureConfig[];
  features_position?: 'inline' | 'bottom';
  state_content?: string | string[];
}

// -- Badges -----------------------------------------------------------

export interface LovelaceBadgeConfig {
  type?: string;
  entity?: string;
  color?: string;
  tap_action?: Record<string, any>;
  visibility?: LovelaceCondition[];
  [key: string]: any;
}

// -- Sections ---------------------------------------------------------

export interface LovelaceSectionConfig {
  type?: string;
  title?: string;
  cards?: LovelaceCardConfig[];
  column_span?: number;
  row_span?: number;
  visibility?: LovelaceCondition[];
  [key: string]: any;
}

// -- Views ------------------------------------------------------------

export interface LovelaceViewConfig {
  title?: string;
  path?: string;
  icon?: string;
  theme?: string;
  type?: string;
  subview?: boolean;
  max_columns?: number;
  dense_section_placement?: boolean;
  badges?: (string | Partial<LovelaceBadgeConfig>)[];
  header?: LovelaceViewHeaderConfig;
  sections?: LovelaceSectionConfig[];
  cards?: LovelaceCardConfig[];
  strategy?: LovelaceStrategyConfig;
  background?: string | LovelaceViewBackgroundConfig;
  visible?: boolean | ShowViewConfig[];
  back_path?: string;
}

// -- Dashboard --------------------------------------------------------

export interface LovelaceConfig {
  title?: string;
  views: LovelaceViewConfig[];
  background?: string;
}

// -- Supporting Types -------------------------------------------------

export interface LovelaceGridOptions {
  columns?: number | 'full';
  rows?: number | 'auto';
  max_columns?: number;
  min_columns?: number;
}

export interface LovelaceCondition {
  condition: string;
  [key: string]: any;
}

export interface LovelaceViewHeaderConfig {
  card?: LovelaceCardConfig;
  layout?: 'start' | 'center' | 'responsive';
  badges_position?: 'bottom' | 'top';
  badges_wrap?: 'wrap' | 'nowrap';
}

export interface LovelaceViewBackgroundConfig {
  image?: string;
  opacity?: number;
  size?: 'auto' | 'cover' | 'contain';
  alignment?: string;
  repeat?: 'repeat' | 'no-repeat';
  attachment?: 'scroll' | 'fixed';
}

export interface ShowViewConfig {
  user?: string;
}
