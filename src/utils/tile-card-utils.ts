// ====================================================================
// Adaptive Tile Card Builder
// ====================================================================
// Centralizes all generated HA-native tile card configs so new frontend
// tile features can be adopted conservatively in one place.
// ====================================================================

import type { HomeAssistant, HassEntity } from '../types/homeassistant';
import type { LovelaceTileCardConfig, LovelaceTileCardFeatureConfig } from '../types/lovelace';
import { haVersionAtLeast } from './ha-version';

const LIGHT_BRIGHTNESS_MODES = ['brightness', 'color_temp', 'hs', 'xy', 'rgb', 'rgbw', 'rgbww', 'white'];
const LIGHT_COLOR_MODES = ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'];
const CLIMATE_TARGET_TEMPERATURE = 1;
const CLIMATE_TARGET_TEMPERATURE_RANGE = 2;
const LEGACY_FAN_SET_SPEED = 1;
const LEGACY_MEDIA_PAUSE = 1;
const LEGACY_MEDIA_STOP = 4096;
const LEGACY_MEDIA_PLAY = 16384;

export interface AdaptiveTileCardOptions extends Omit<
  Partial<LovelaceTileCardConfig>,
  'type' | 'entity' | 'features' | 'features_position'
> {
  allowAdaptiveFeatures?: boolean;
  preferFeaturePosition?: 'auto' | 'inline' | 'bottom' | 'none';
  /**
   * Opt-in `extended_tile_controls` (HA 2026.11+): color lights add the hue
   * strip and climates with a target temperature add +/- buttons. Both stack
   * below the tile, so they stay off by default to keep tiles single-row.
   */
  extendedControls?: boolean;
}

function getDomain(entityId: string): string {
  return entityId.split('.')[0];
}

function hasLightBrightness(state: HassEntity): boolean {
  const modes = state.attributes?.supported_color_modes as string[] | undefined;
  if (Array.isArray(modes) && modes.some((mode) => LIGHT_BRIGHTNESS_MODES.includes(mode))) return true;
  return typeof state.attributes?.brightness === 'number';
}

function lightSupportsColor(state: HassEntity): boolean {
  const modes = state.attributes?.supported_color_modes as string[] | undefined;
  return Array.isArray(modes) && modes.some((mode) => LIGHT_COLOR_MODES.includes(mode));
}

function climateSupportsTargetTemperature(state: HassEntity): boolean {
  const supported = (state.attributes?.supported_features as number) || 0;
  return (supported & (CLIMATE_TARGET_TEMPERATURE | CLIMATE_TARGET_TEMPERATURE_RANGE)) !== 0;
}

function fanSupportsSpeed(state: HassEntity): boolean {
  if (typeof state.attributes?.percentage_step === 'number') return true;
  if (typeof state.attributes?.percentage === 'number') return true;
  return (((state.attributes?.supported_features as number) || 0) & LEGACY_FAN_SET_SPEED) !== 0;
}

function mediaPlayerSupportsPlayback(state: HassEntity): boolean {
  const supported = (state.attributes?.supported_features as number) || 0;
  return (supported & (LEGACY_MEDIA_PAUSE | LEGACY_MEDIA_PLAY | LEGACY_MEDIA_STOP)) !== 0;
}

function mediaPlayerSupportsSourceSelection(state: HassEntity): boolean {
  const sourceList = state.attributes?.source_list;
  return Array.isArray(sourceList) && sourceList.length > 0;
}

function mediaPlayerSupportsSoundModeSelection(state: HassEntity): boolean {
  const soundModeList = state.attributes?.sound_mode_list;
  return Array.isArray(soundModeList) && soundModeList.length > 0;
}

function buildAdaptiveFeatures(
  hass: HomeAssistant,
  entityId: string,
  state: HassEntity | undefined,
  extendedControls: boolean
): LovelaceTileCardFeatureConfig[] {
  if (!state) return [];
  const extended = extendedControls && haVersionAtLeast(hass, 2026, 11);

  switch (getDomain(entityId)) {
    case 'light': {
      const features: LovelaceTileCardFeatureConfig[] = hasLightBrightness(state) ? [{ type: 'light-brightness' }] : [];
      if (extended && lightSupportsColor(state)) features.push({ type: 'light-color', controls: 'hue' });
      return features;
    }
    case 'climate':
      return extended && climateSupportsTargetTemperature(state)
        ? [{ type: 'target-temperature', style: 'buttons' }, { type: 'climate-hvac-modes' }]
        : [{ type: 'climate-hvac-modes' }];
    case 'cover':
      return [{ type: 'cover-open-close' }];
    case 'fan':
      return fanSupportsSpeed(state) ? [{ type: 'fan-speed' }] : [];
    case 'lock':
      return [{ type: 'lock-commands' }];
    case 'media_player': {
      // Keep media tiles strictly horizontal by exposing only one
      // primary inline feature instead of stacking multiple controls.
      if (mediaPlayerSupportsPlayback(state)) return [{ type: 'media-player-playback' }];
      if (mediaPlayerSupportsSourceSelection(state)) return [{ type: 'media-player-source' }];
      if (mediaPlayerSupportsSoundModeSelection(state)) return [{ type: 'media-player-sound-mode' }];
      return [];
    }
    case 'vacuum':
      return [{ type: 'vacuum-commands' }];
    case 'lawn_mower':
      return [{ type: 'lawn-mower-commands' }];
    case 'humidifier':
      return [{ type: 'humidifier-toggle' }];
    case 'valve':
      return [{ type: 'valve-open-close' }];
    case 'water_heater':
      return [{ type: 'water-heater-operation-modes' }];
    case 'select':
    case 'input_select':
      return [{ type: 'select-options' }];
    case 'number':
    case 'input_number':
      return [{ type: 'numeric-input' }];
    case 'update':
      return [{ type: 'update-actions' }];
    case 'input_boolean':
      return [{ type: 'toggle' }];
    case 'timer':
      // Native start/pause/cancel buttons arrived in HA 2026.10.
      return haVersionAtLeast(hass, 2026, 10) ? [{ type: 'timer-actions' }] : [];
    default:
      return [];
  }
}

function resolveFeaturePosition(
  features: LovelaceTileCardFeatureConfig[],
  vertical: boolean | undefined,
  preference: AdaptiveTileCardOptions['preferFeaturePosition']
): LovelaceTileCardConfig['features_position'] | undefined {
  if (features.length === 0 || vertical === true || preference === 'none') return undefined;
  if (preference === 'bottom') return 'bottom';
  if (preference === 'inline') return features.length === 1 ? 'inline' : undefined;
  return features.length === 1 ? 'inline' : undefined;
}

export function buildAdaptiveTileCardConfig(
  hass: HomeAssistant,
  entityId: string,
  options: AdaptiveTileCardOptions = {}
): LovelaceTileCardConfig {
  const {
    allowAdaptiveFeatures = true,
    preferFeaturePosition = 'auto',
    extendedControls = false,
    vertical,
    ...rest
  } = options;

  const card: LovelaceTileCardConfig = {
    type: 'tile',
    entity: entityId,
    vertical,
    ...rest,
  };

  if (!allowAdaptiveFeatures) return card;

  const state = hass.states[entityId];
  const features = buildAdaptiveFeatures(hass, entityId, state, extendedControls);
  if (features.length === 0) return card;

  card.features = features;

  const featuresPosition = resolveFeaturePosition(features, vertical, preferFeaturePosition);
  if (featuresPosition) {
    card.features_position = featuresPosition;
  }

  return card;
}
