import { describe, expect, it } from 'vitest';

import { DEFAULT_WEATHER_START_ORDER } from './strategy';

describe('weather-start defaults', () => {
  it('contains every migrated overview feature in a stable order', () => {
    expect(DEFAULT_WEATHER_START_ORDER).toEqual([
      'house_mode',
      'alarm',
      'summaries',
      'favorites',
      'light_favorites',
      'quick_actions',
      'areas',
      'clock',
      'date',
      'search',
      'overview',
      'weather_current',
      'weather_hourly',
      'weather_daily',
      'weather_details',
      'energy',
      'plants',
      'agenda',
      'todos',
      'persons',
      'vacuums',
      'maintenance',
      'media',
      'activity',
      'custom_cards',
      'custom_sections',
    ]);
  });
});
