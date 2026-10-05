import { describe, expect, it } from 'vitest';
import en from '../translations/en.json';
import de from '../translations/de.json';
import { getOptionDefault, getOptionMetadata, OPTION_METADATA } from './option-metadata';
import { normalizeStrategyConfig } from './strategy-config';

describe('option metadata compatibility', () => {
  it('resolves every metadata label in English and German', () => {
    for (const definition of Object.values(OPTION_METADATA)) {
      const key = definition.labelKey.slice('editor.'.length);
      expect((en.editor as Record<string, string>)[key], key).toBeTruthy();
      expect((de.editor as Record<string, string>)[key], key).toBeTruthy();
    }
  });
  it('keeps automatic maintenance and layout-dependent weather defaults', () => {
    expect(getOptionDefault('show_maintenance_view', {})).toBeUndefined();
    expect(getOptionDefault('weather_start_weather_mode', {})).toBe('compact_hourly');
    expect(getOptionDefault('weather_start_weather_mode', { weather_start_order: ['clock'] })).toBe('full');
    expect(getOptionMetadata('camera_pause_when_hidden')?.dependencies).toEqual([
      { option: 'camera_renderer', value: 'native' },
      { option: 'camera_live_toggle', value: true },
    ]);
  });
  it('does not insert defaults or mutate caller configuration', () => {
    const input = { show_camera_view: true, show_maintenance_view: false, extension_option: { keep: true } };
    const original = JSON.stringify(input);
    expect(normalizeStrategyConfig(input)).toEqual({
      show_cctv_view: true,
      show_maintenance_view: false,
      extension_option: { keep: true },
    });
    expect(JSON.stringify(input)).toBe(original);
    expect(normalizeStrategyConfig({})).toEqual({});
    expect(getOptionMetadata('extension_option')).toBeUndefined();
  });
});
