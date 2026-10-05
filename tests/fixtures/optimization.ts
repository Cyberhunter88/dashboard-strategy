import { makeHass } from './hass';
import type { Simon42StrategyConfig } from '../../src/types/strategy';

/** Synthetic household only: no instance IDs, addresses or camera stream names. */
export function makeOptimizationFixture(count = 500) {
  const areas = Array.from({ length: 24 }, (_, i) => ({ area_id: `room_${i}`, name: `Room ${i}`, floor_id: `floor_${i % 3}` }));
  const hass = makeHass({
    areas,
    floors: Array.from({ length: 3 }, (_, i) => ({ floor_id: `floor_${i}`, name: `Floor ${i}` })),
    devices: Array.from({ length: count }, (_, i) => ({ id: `device_${i}`, area_id: `room_${i % 24}` })),
    entities: Array.from({ length: count }, (_, i) => ({
      entity_id: `${['light', 'cover', 'sensor', 'switch'][i % 4]}.fixture_${i}`,
      device_id: `device_${i}`,
      state: i % 4 === 1 ? 'closed' : 'on',
      attributes: i % 4 === 2 ? { device_class: 'battery', unit_of_measurement: '%' } : {},
    })),
  });
  const extra = makeHass({ entities: [
    { entity_id: 'weather.fixture', state: 'sunny' },
    { entity_id: 'camera.fixture', area_id: 'room_1', state: 'idle' },
    { entity_id: 'sensor.ups_fixture', area_id: 'room_0', state: '100', attributes: { device_class: 'battery', unit_of_measurement: '%' } },
    { entity_id: 'button.ptz_fixture', area_id: 'room_1', state: 'unknown' },
  ] });
  Object.assign(hass.entities, extra.entities);
  Object.assign(hass.states, extra.states);
  Object.assign(hass, { themes: { themes: {} }, user: { id: 'fixture_user', is_admin: false } });
  const config: Simon42StrategyConfig = {
    group_by_floors: true,
    show_summary_views: false,
    show_maintenance_view: false,
    camera_live_toggle: true,
    camera_pause_when_hidden: true,
    areas_display: { hidden: ['room_23'] },
    weather_start_layout_items: [
      { id: 'floor', type: 'floor', floor_id: 'floor_0' },
      { id: 'weather', type: 'weather_current', yaml: 'type: weather-forecast\nentity: weather.fixture', parsed_config: { type: 'weather-forecast', entity: 'weather.fixture' } },
    ],
    areas_options: {
      room_0: { custom_cards: [{ mode: 'yaml', yaml: 'type: gauge\nentity: sensor.ups_fixture', parsed_config: { type: 'gauge', entity: 'sensor.ups_fixture' } }] },
      room_1: { view_override: { yaml: 'type: sections\nsections:\n  - type: grid\n    cards:\n      - type: tile\n        entity: button.ptz_fixture', parsed_config: { type: 'sections', sections: [{ type: 'grid', cards: [{ type: 'tile', entity: 'button.ptz_fixture' }] }] } } },
    },
  };
  return { hass, config };
}
