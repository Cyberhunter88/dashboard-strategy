import { describe, expect, it } from 'vitest';

import { getWeatherStartWeatherMode, usesDefaultWeatherStartLayout } from './weather-start-defaults';

describe('weather-start presentation defaults', () => {
  it('uses the compact presentation when no custom layout is configured', () => {
    expect(usesDefaultWeatherStartLayout({})).toBe(true);
    expect(getWeatherStartWeatherMode({})).toBe('compact_hourly');
  });

  it('preserves explicit weather mode choices', () => {
    expect(getWeatherStartWeatherMode({ weather_start_weather_mode: 'full' })).toBe('full');
    expect(getWeatherStartWeatherMode({ weather_start_weather_mode: 'compact_hourly' })).toBe('compact_hourly');
  });

  it('keeps full weather as the fallback for a configured order or free layout', () => {
    expect(usesDefaultWeatherStartLayout({ weather_start_order: ['areas'] })).toBe(false);
    expect(getWeatherStartWeatherMode({ weather_start_order: ['areas'] })).toBe('full');
    expect(usesDefaultWeatherStartLayout({ weather_start_layout_items: [{ id: 'clock', type: 'clock' }] })).toBe(false);
    expect(getWeatherStartWeatherMode({ weather_start_layout_items: [{ id: 'clock', type: 'clock' }] })).toBe('full');
  });
});
