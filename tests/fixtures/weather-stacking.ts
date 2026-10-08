import { makeHass } from './hass';
import type { Simon42StrategyConfig } from '../../src/types/strategy';

export function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export function makeWeatherStackingFixture() {
  const hass = makeHass({
    floors: [
      { floor_id: 'ground', name: 'Ground' },
      { floor_id: 'upper', name: 'Upper' },
    ],
    areas: [
      { area_id: 'kitchen', name: 'Kitchen', floor_id: 'ground' },
      { area_id: 'bedroom', name: 'Bedroom', floor_id: 'upper' },
    ],
    entities: [
      { entity_id: 'weather.fixture', state: 'sunny' },
      { entity_id: 'sensor.waste', state: 'tomorrow' },
      { entity_id: 'light.kitchen', area_id: 'kitchen' },
      { entity_id: 'light.bedroom', area_id: 'bedroom' },
    ],
  });
  const config: Simon42StrategyConfig = {
    overview_layout: 'weather_start',
    group_by_floors: true,
    show_maintenance_view: false,
    weather_start_layout_items: [
      {
        id: 'weather',
        type: 'custom_section',
        parsed_config: {
          type: 'grid',
          cards: [
            { type: 'heading', heading: 'Weather' },
            { type: 'weather-forecast', entity: 'weather.fixture' },
          ],
        },
      },
      {
        id: 'waste',
        type: 'custom_section',
        stack_with_previous: true,
        parsed_config: {
          type: 'grid',
          cards: [
            { type: 'heading', heading: 'Waste' },
            { type: 'tile', entity: 'sensor.waste' },
          ],
        },
      },
      { id: 'ground', type: 'floor', floor_id: 'ground', stack_with_previous: true },
      { id: 'upper', type: 'floor', floor_id: 'upper', stack_with_previous: true },
    ],
  };
  return { hass, config };
}
