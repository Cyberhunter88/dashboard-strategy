import { describe, expect, it } from 'vitest';
import { applyDashboardLabelExclusion, findLabelExcludedOptionEntities } from './label-exclusion';
import { makeHass } from '../../tests/fixtures/hass';
import type { Simon42StrategyConfig } from '../types/strategy';

const hass = makeHass({
  devices: [{ id: 'dev_labeled', labels: ['no_dboard'] }],
  entities: [
    { entity_id: 'light.on_labeled_device', state: 'on', device_id: 'dev_labeled' },
    { entity_id: 'light.labeled', state: 'on', labels: ['no_dboard'] },
    { entity_id: 'light.visible', state: 'on' },
    { entity_id: 'scene.upstream_label', state: 'unknown', labels: ['no-dboard'] },
    { entity_id: 'sensor.power', state: '120', labels: ['no_dboard'] },
    { entity_id: 'sensor.wind', state: '3', labels: ['no_dboard'] },
    { entity_id: 'binary_sensor.extra', state: 'off', labels: ['no_dboard'] },
  ],
});

describe('strict no_dboard option filtering', () => {
  it('returns the same config object when nothing is labeled', () => {
    const config: Simon42StrategyConfig = { favorite_entities: ['light.visible'], power_badge_entity: 'sensor.none' };
    expect(applyDashboardLabelExclusion(config, hass)).toBe(config);
  });

  it('removes labeled entities from every entity option without mutating the input', () => {
    const config: Simon42StrategyConfig = {
      favorite_entities: ['light.visible', 'light.labeled', 'light.on_labeled_device'],
      light_favorite_entities: ['light.labeled'],
      quick_action_entities: ['scene.upstream_label', 'light.visible'],
      room_pin_entities: ['light.labeled'],
      power_badge_entity: 'sensor.power',
      weather_sensors: [{ entity: 'sensor.wind' }, { entity: 'light.visible' }],
      areas_options: {
        living: { groups_options: { badges: { additional: ['binary_sensor.extra', 'light.visible'] } } },
        kitchen: { stacks_order: ['lights'] },
      },
      custom_cards: [{ id: 'c1', yaml: 'type: tile\nentity: light.labeled' }],
    } as Simon42StrategyConfig;
    const before = JSON.stringify(config);

    const result = applyDashboardLabelExclusion(config, hass);

    expect(result.favorite_entities).toEqual(['light.visible']);
    expect(result.light_favorite_entities).toEqual([]);
    expect(result.quick_action_entities).toEqual(['light.visible']);
    expect(result.room_pin_entities).toEqual([]);
    expect(result.power_badge_entity).toBeUndefined();
    expect(result.weather_sensors).toEqual([{ entity: 'light.visible' }]);
    expect(result.areas_options?.living.groups_options?.badges.additional).toEqual(['light.visible']);
    expect(result.areas_options?.kitchen).toBe(config.areas_options?.kitchen);
    // Hand-written YAML is never rewritten.
    expect(result.custom_cards).toBe(config.custom_cards);
    expect(JSON.stringify(config)).toBe(before);
  });

  it('reports the option path of every removed entity', () => {
    const config: Simon42StrategyConfig = {
      favorite_entities: ['light.visible', 'light.labeled'],
      alarm_entity: 'binary_sensor.extra',
      areas_options: { living: { groups_options: { badges: { additional: ['binary_sensor.extra'] } } } },
    };
    expect(findLabelExcludedOptionEntities(config, hass)).toEqual([
      { path: 'favorite_entities[1]', entityId: 'light.labeled' },
      { path: 'alarm_entity', entityId: 'binary_sensor.extra' },
      { path: 'areas_options.living.groups_options.badges.additional[0]', entityId: 'binary_sensor.extra' },
    ]);
  });
});
