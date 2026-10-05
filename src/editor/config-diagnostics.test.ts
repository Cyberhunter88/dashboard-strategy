import { describe, expect, it } from 'vitest';
import { ConfigDiagnostics, collectEntityReferences, inspectConfig, isSelectableEntity } from './config-diagnostics';
import { makeHass } from '../../tests/fixtures/hass';
import type { HomeAssistant } from '../types/homeassistant';

describe('editor diagnostics', () => {
  it('caches references per config and reflects state changes without reparsing', () => {
    const cache = new ConfigDiagnostics();
    const config = { custom_cards: [{ yaml: 'entity: sensor.fixture' }] };
    const hass = makeHass({ entities: [{ entity_id: 'sensor.fixture', state: 'unavailable' }] });
    const analysis = cache.analyze(config);
    expect(cache.inspect(config, hass)[0].status).toBe('unavailable');
    hass.states['sensor.fixture'] = { ...hass.states['sensor.fixture'], state: 'on' };
    expect(cache.inspect(config, hass)).toEqual([]);
    expect(cache.analyze(config)).toBe(analysis);
    expect(cache.analyze({ ...config })).not.toBe(analysis);
  });

  it('distinguishes disabled, stateless and unknown entities and ignores exclusion availability', () => {
    const hass = makeHass({ entities: [
      { entity_id: 'sensor.disabled', disabled_by: 'user' },
      { entity_id: 'sensor.stateless' },
      { entity_id: 'sensor.unknown', state: 'unknown' },
      { entity_id: 'button.unused', state: 'unknown' },
      { entity_id: 'event.unused', state: 'unknown' },
      { entity_id: 'binary_sensor.hidden', state: 'unavailable' },
    ] });
    delete hass.states['sensor.stateless'];
    const config = { entities: ['sensor.disabled', 'sensor.stateless', 'sensor.unknown', 'button.unused', 'event.unused'], hidden: ['binary_sensor.hidden'] };
    expect(inspectConfig(config, hass).map((issue) => issue.status)).toEqual(['disabled', 'no_state', 'unknown']);
    expect(inspectConfig({ hidden: ['sensor.removed'] }, hass)[0].severity).toBe('info');
  });

  it('reports optional layout and camera notes without altering YAML or parsing stream names', () => {
    const config = {
      weather_start_layout_items: [{ type: 'house_mode' }, { type: 'custom_card', custom_card_id: 'gone' }],
      areas_options: { fixture: { view_override: { yaml: 'type: custom:advanced-camera-card\nlive:\n  preload: true\n  auto_pause: []\ncameras:\n  - webrtc_card:\n      url: camera.stream' } } },
    };
    const before = JSON.stringify(config);
    expect(inspectConfig(config, makeHass()).map((issue) => issue.code)).toEqual(['camera_preload', 'house_mode_unconfigured', 'layout_reference', 'room_override']);
    expect(JSON.stringify(config)).toBe(before);
  });

  it('handles cyclic YAML aliases without hanging', () => {
    expect(collectEntityReferences({ yaml: 'cards: &cards\n  - entity: sensor.fixture\n  - cards: *cards' }).map((ref) => ref.entityId)).toEqual(['sensor.fixture']);
    expect(collectEntityReferences({ yaml: 'entities: &entities [sensor.fixture, *entities]' }).map((ref) => ref.entityId)).toEqual(['sensor.fixture']);
  });

  it('keeps summary subviews reachable and reports definitely missing internal targets', () => {
    const config = { show_summary_views: false, show_covers_summary: false, custom_cards: [{ yaml: 'type: tile\ntap_action:\n  action: navigate\n  navigation_path: lights' }, { parsed_config: { tap_action: { navigation_path: 'covers' } } }] };
    expect(inspectConfig(config, makeHass()).map((issue) => issue.code)).toEqual(['navigation_target']);
    expect(inspectConfig({ ...config, show_covers_view: true }, makeHass())).toEqual([]);
  });
  it('reads nested YAML and action targets without treating services or streams as entities', () => {
    const config = { custom_cards: [{ yaml: 'type: vertical-stack\ncards:\n  - entity: sensor.missing\n    tap_action:\n      perform_action: button.press\n      target:\n        entity_id: button.real\n  - url: camera.stream\n  - entity: "{{ states.sensor.dynamic }}"',
      parsed_config: { entity: 'sensor.duplicate' } }] };
    expect(collectEntityReferences(config).map((ref) => ref.entityId)).toEqual(['sensor.missing', 'button.real']);
  });

  it('reports locations, distinguishes missing states and recovers without mutating config', () => {
    const config = { alarm_entity: 'alarm_control_panel.home', custom_cards: [{ parsed_config: { entity: 'sensor.offline' } }] };
    const before = JSON.stringify(config);
    const hass = { states: { 'sensor.offline': { state: 'unavailable' } }, entities: {} } as unknown as HomeAssistant;
    expect(inspectConfig(config, hass).map((issue) => [issue.path, issue.status])).toEqual([
      ['alarm_entity', 'missing'], ['custom_cards[0].parsed_config.entity', 'unavailable'],
    ]);
    hass.states['sensor.offline'].state = '1';
    expect(inspectConfig(config, hass)).toHaveLength(1);
    expect(JSON.stringify(config)).toBe(before);
  });

  it('excludes new categorized choices and retains existing selections', () => {
    const hass = { entities: { 'sensor.config': { entity_category: 'config' }, 'sensor.diag': { entity_category: 'diagnostic' } } } as unknown as HomeAssistant;
    expect(isSelectableEntity(hass, 'sensor.config', new Set())).toBe(false);
    expect(isSelectableEntity(hass, 'sensor.diag', new Set(['sensor.diag']))).toBe(true);
    expect(isSelectableEntity(hass, 'sensor.normal', new Set())).toBe(true);
  });
});
