import { describe, expect, it } from 'vitest';
import { collectEntityReferences, inspectConfig, isSelectableEntity } from './config-diagnostics';
import type { HomeAssistant } from '../types/homeassistant';

describe('editor diagnostics', () => {
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
