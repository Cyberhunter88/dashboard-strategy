import { describe, expect, it } from 'vitest';
import type { LovelaceSectionConfig } from '../types/lovelace';
import { supportsCustomHeading, withCustomHeading } from './section-heading';

const section = (): LovelaceSectionConfig => ({
  type: 'grid',
  cards: [
    { type: 'heading', heading: 'Weather', heading_style: 'title', icon: 'mdi:weather-partly-cloudy' },
    { type: 'weather-forecast', entity: 'weather.home' },
  ],
});

describe('withCustomHeading', () => {
  it('renames the first heading and keeps every other card property', () => {
    const result = withCustomHeading(section(), '  Outside  ');
    expect(result?.cards?.[0]).toEqual({
      type: 'heading',
      heading: 'Outside',
      heading_style: 'title',
      icon: 'mdi:weather-partly-cloudy',
    });
    expect(result?.cards?.[1]).toEqual({ type: 'weather-forecast', entity: 'weather.home' });
  });

  it('does not mutate the input section', () => {
    const input = section();
    const before = JSON.stringify(input);
    withCustomHeading(input, 'Outside');
    expect(JSON.stringify(input)).toBe(before);
  });

  it('returns the section unchanged without a usable title or heading card', () => {
    const input = section();
    expect(withCustomHeading(input, undefined)).toBe(input);
    expect(withCustomHeading(input, '   ')).toBe(input);
    const noHeading: LovelaceSectionConfig = { type: 'grid', cards: [{ type: 'weather-forecast' }] };
    expect(withCustomHeading(noHeading, 'Outside')).toBe(noHeading);
    expect(withCustomHeading(null, 'Outside')).toBeNull();
  });
});

describe('supportsCustomHeading', () => {
  it('covers the weather and alarm blocks only', () => {
    expect(supportsCustomHeading('weather_current')).toBe(true);
    expect(supportsCustomHeading('alarm')).toBe(true);
    expect(supportsCustomHeading('clock')).toBe(false);
    expect(supportsCustomHeading('summaries')).toBe(false);
  });
});
