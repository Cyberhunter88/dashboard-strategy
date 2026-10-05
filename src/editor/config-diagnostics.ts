import yaml from 'js-yaml';
import type { HomeAssistant } from '../types/homeassistant';

export interface EntityReference { entityId: string; path: string; }
export interface ConfigIssue extends EntityReference { status: 'missing' | 'unavailable'; }

const ENTITY = /^[a-z_]+\.[a-z0-9_]+$/;
const ENTITY_FIELDS = new Set(['entity', 'entity_id', 'entities', 'room_pin_entities', 'favorites',
  'light_favorites', 'additional', 'hidden', 'temperature_sensor', 'humidity_sensor']);

/** Inspect structured fields only; never guess entity IDs from arbitrary text. */
export function collectEntityReferences(config: unknown): EntityReference[] {
  const refs: EntityReference[] = [];
  const add = (value: unknown, path: string): void => {
    if (typeof value === 'string' && ENTITY.test(value)) refs.push({ entityId: value, path });
    else if (Array.isArray(value)) value.forEach((entry, i) => add(entry, `${path}[${i}]`));
  };
  const walk = (value: unknown, path: string): void => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach((entry, i) => walk(entry, `${path}[${i}]`)); return; }
    const record = value as Record<string, unknown>;
    for (const [key, child] of Object.entries(record)) {
      if (key.startsWith('_') || (key === 'parsed_config' && typeof record.yaml === 'string')) continue;
      const location = path ? `${path}.${key}` : key;
      if (key === 'yaml' && typeof child === 'string') {
        try { walk(yaml.load(child), location); } catch { /* Existing YAML editor reports syntax errors. */ }
      } else {
        if (ENTITY_FIELDS.has(key) || key.endsWith('_entity') || key.endsWith('_entities') || key.endsWith('_entity_id')) add(child, location);
        walk(child, location);
      }
    }
  };
  walk(config, '');
  return refs;
}

export function inspectConfig(config: unknown, hass: HomeAssistant): ConfigIssue[] {
  return collectEntityReferences(config).flatMap((ref): ConfigIssue[] => {
    const state = hass.states[ref.entityId];
    if (!state) return [{ ...ref, status: 'missing' }];
    return state.state === 'unavailable' ? [{ ...ref, status: 'unavailable' }] : [];
  });
}

export function isRestrictedEntity(hass: HomeAssistant, id: string): boolean {
  const category = hass.entities[id]?.entity_category;
  return category === 'config' || category === 'diagnostic';
}

export function isSelectableEntity(hass: HomeAssistant, id: string, selected: ReadonlySet<string>): boolean {
  return !isRestrictedEntity(hass, id) || selected.has(id);
}
