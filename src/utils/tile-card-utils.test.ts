import { describe, expect, it } from 'vitest';

import type { HomeAssistant } from '../types/homeassistant';
import { buildAdaptiveTileCardConfig } from './tile-card-utils';

describe('buildAdaptiveTileCardConfig', () => {
  it('uses the native lawn mower commands feature for lawn mower entities', () => {
    const hass = {
      states: {
        'lawn_mower.garden': { attributes: {} },
      },
    } as unknown as HomeAssistant;

    const card = buildAdaptiveTileCardConfig(hass, 'lawn_mower.garden');

    expect(card.features).toEqual([{ type: 'lawn-mower-commands' }]);
    expect(card.features_position).toBe('inline');
  });

  const hassAt = (version: string, states: Record<string, unknown>) =>
    ({ config: { version }, states }) as unknown as HomeAssistant;
  const colorLight = { attributes: { supported_color_modes: ['hs', 'color_temp'] } };
  const thermostat = { attributes: { supported_features: 1 } };

  it('adds native timer actions from Home Assistant 2026.10 on', () => {
    const states = { 'timer.tea': { attributes: {} } };
    expect(buildAdaptiveTileCardConfig(hassAt('2026.10.0', states), 'timer.tea').features).toEqual([
      { type: 'timer-actions' },
    ]);
    expect(buildAdaptiveTileCardConfig(hassAt('2026.9.3', states), 'timer.tea').features).toBeUndefined();
  });

  it('keeps lights and climates single-row unless extended controls are enabled', () => {
    const hass = hassAt('2026.11.3', { 'light.desk': colorLight, 'climate.office': thermostat });
    const light = buildAdaptiveTileCardConfig(hass, 'light.desk');
    expect(light.features).toEqual([{ type: 'light-brightness' }]);
    expect(light.features_position).toBe('inline');
    expect(buildAdaptiveTileCardConfig(hass, 'climate.office').features).toEqual([{ type: 'climate-hvac-modes' }]);
  });

  it('adds the hue strip and target temperature buttons with extended controls', () => {
    const hass = hassAt('2026.11.3', { 'light.desk': colorLight, 'climate.office': thermostat });
    const light = buildAdaptiveTileCardConfig(hass, 'light.desk', { extendedControls: true });
    expect(light.features).toEqual([{ type: 'light-brightness' }, { type: 'light-color', controls: 'hue' }]);
    expect(light.features_position).toBeUndefined();
    expect(buildAdaptiveTileCardConfig(hass, 'climate.office', { extendedControls: true }).features).toEqual([
      { type: 'target-temperature', style: 'buttons' },
      { type: 'climate-hvac-modes' },
    ]);
  });

  it('ignores extended controls for unsupported entities and older Home Assistant', () => {
    const whiteLight = { attributes: { supported_color_modes: ['color_temp'] } };
    const fanOnly = { attributes: { supported_features: 0 } };
    const hass = hassAt('2026.11.0', { 'light.hall': whiteLight, 'climate.fan': fanOnly });
    expect(buildAdaptiveTileCardConfig(hass, 'light.hall', { extendedControls: true }).features).toEqual([
      { type: 'light-brightness' },
    ]);
    expect(buildAdaptiveTileCardConfig(hass, 'climate.fan', { extendedControls: true }).features).toEqual([
      { type: 'climate-hvac-modes' },
    ]);
    const old = hassAt('2026.10.2', { 'light.desk': colorLight });
    expect(buildAdaptiveTileCardConfig(old, 'light.desk', { extendedControls: true }).features).toEqual([
      { type: 'light-brightness' },
    ]);
  });
});
