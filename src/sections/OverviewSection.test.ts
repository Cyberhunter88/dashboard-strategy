import { describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import {
  createAlarmSection,
  createFavoritesSection,
  createHouseModeSection,
  createLightFavoritesSection,
  createOverviewSection,
  createSearchSection,
} from './OverviewSection';

const hass = {
  states: {
    'input_select.house_mode': {
      entity_id: 'input_select.house_mode',
      state: 'Smart Home',
      attributes: { friendly_name: 'House Mode', options: ['Smart Home', 'Guest'] },
    },
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

describe('weather-start overview blocks', () => {
  it('creates favorites as an independent section', () => {
    const section = createFavoritesSection(hass, { favorite_entities: ['light.favorite'] });
    expect(section?.cards?.some((card: any) => card.entity === 'light.favorite')).toBe(true);
  });

  it('omits unavailable alarm entities and disabled search', () => {
    expect(createAlarmSection(hass, { alarm_entity: 'alarm_control_panel.missing' })).toBeNull();
    expect(createSearchSection(false)).toBeNull();
    expect(createSearchSection(true)?.cards?.some((card: any) => card.type === 'custom:search-card')).toBe(true);
    expect(createSearchSection(true, 'tip')?.cards?.some((card: any) => card.type === 'markdown')).toBe(true);
  });

  it('renders a configured house-mode helper as a native inline selector', () => {
    const section = createHouseModeSection(hass, { house_mode_entity: 'input_select.house_mode' });
    expect(section?.cards).toEqual([
      expect.objectContaining({
        type: 'tile',
        entity: 'input_select.house_mode',
        hide_state: true,
        features: [{ type: 'select-options' }],
        features_position: 'inline',
      }),
    ]);
    expect(createHouseModeSection(hass, { house_mode_entity: 'select.missing' })).toBeNull();
    expect(createHouseModeSection(hass, { house_mode_entity: 'input_boolean.invalid' })).toBeNull();
  });

  it('creates light favorites only from existing light entities', () => {
    expect(createLightFavoritesSection(hass, { light_favorite_entities: ['light.favorite', 'sensor.missing'] })
      ?.cards?.some((card: any) => card.entity === 'light.favorite')).toBe(true);
    expect(createLightFavoritesSection(hass, { light_favorite_entities: [] })).toBeNull();
  });
});
