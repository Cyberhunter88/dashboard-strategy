import { describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import { createOverviewSection } from './OverviewSection';

const hass = {
  states: {
    'light.favorite': {
      entity_id: 'light.favorite',
      state: 'on',
      attributes: { friendly_name: 'Favorite Light' },
    },
  },
} as unknown as HomeAssistant;

describe('createOverviewSection', () => {
  it('can hide overview and favorites headings while keeping content', () => {
    const section = createOverviewSection({
      someSensorId: null,
      showSearchCard: false,
      hass,
      config: {
        show_clock_card: true,
        favorite_entities: ['light.favorite'],
        hidden_section_headings: ['overview', 'favorites'],
        show_light_summary: false,
        show_covers_summary: false,
        show_security_summary: false,
        show_battery_summary: false,
        show_climate_summary: false,
      },
    });

    expect(section?.cards?.some((card: any) => card.type === 'heading' && card.heading === 'Übersicht')).toBe(false);
    expect(section?.cards?.some((card: any) => card.type === 'heading' && card.heading === 'Favorites')).toBe(false);
    expect(section?.cards?.some((card: any) => card.entity === 'light.favorite')).toBe(true);
  });
});
