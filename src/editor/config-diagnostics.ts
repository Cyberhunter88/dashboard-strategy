import yaml from 'js-yaml';
import type { HomeAssistant } from '../types/homeassistant';
import { trackOperation } from '../utils/debug';
import { getConfiguredNavigationPaths } from '../utils/summary-view-utils';
import type { Simon42StrategyConfig } from '../types/strategy';

export interface EntityReference { entityId: string; path: string; purpose?: 'display' | 'exclusion'; }
export type IssueSeverity = 'error' | 'warning' | 'info';
export type EntityStatus = 'missing' | 'no_state' | 'disabled' | 'unavailable' | 'unknown';
export interface ConfigIssue { code: string; severity: IssueSeverity; path: string; entityId?: string; status?: EntityStatus; }
export interface ConfigAnalysis { references: EntityReference[]; hints: ConfigIssue[]; links: Array<{ path: string; target: string }>; config: Simon42StrategyConfig; }
const ENTITY = /^[a-z_]+\.[a-z0-9_]+$/;
const ENTITY_FIELDS = new Set(['entity', 'entity_id', 'entities', 'camera_image', 'room_pin_entities', 'favorites',
  'light_favorites', 'additional', 'hidden', 'temperature_sensor', 'humidity_sensor']);

/** Per-editor cache; state updates never parse YAML again. */
export class ConfigDiagnostics {
  private _config: unknown;
  private _analysis: ConfigAnalysis | undefined;
  analyze(config: unknown): ConfigAnalysis {
    if (!this._analysis || config !== this._config) {
      this._config = config;
      this._analysis = analyzeConfig(config);
    }
    return this._analysis;
  }
  inspect(config: unknown, hass: HomeAssistant): ConfigIssue[] { return inspectAnalysis(this.analyze(config), hass); }
}

export function analyzeConfig(config: unknown): ConfigAnalysis {
  trackOperation('diagnostics-analysis');
  const references: EntityReference[] = [];
  const hints: ConfigIssue[] = [];
  const links: ConfigAnalysis['links'] = [];
  const ancestors = new WeakSet<object>();
  const root = (config && typeof config === 'object' ? config : {}) as Record<string, any>;
  const referenceArrays = new WeakSet<object>();
  const add = (value: unknown, path: string, purpose: 'display' | 'exclusion'): void => {
    if (typeof value === 'string' && ENTITY.test(value)) references.push({ entityId: value, path, purpose });
    else if (Array.isArray(value) && !referenceArrays.has(value)) {
      referenceArrays.add(value);
      value.forEach((entry, i) => add(entry, `${path}[${i}]`, purpose));
      referenceArrays.delete(value);
    }
  };
  const hint = (code: string, path: string): void => { hints.push({ code, severity: 'info', path }); };
  const walk = (value: unknown, path: string, depth = 0): void => {
    if (!value || typeof value !== 'object' || depth > 50 || ancestors.has(value)) return;
    ancestors.add(value);
    if (Array.isArray(value)) value.forEach((entry, i) => walk(entry, `${path}[${i}]`, depth + 1));
    else {
      const record = value as Record<string, unknown>;
      if (record.type === 'custom:advanced-camera-card') {
        const live = record.live as { preload?: boolean; auto_pause?: unknown } | undefined;
        if (live?.preload === true && Array.isArray(live.auto_pause) && live.auto_pause.length === 0) hint('camera_preload', path);
      }
      for (const [key, child] of Object.entries(record)) {
        if (key.startsWith('_') || (key === 'parsed_config' && typeof record.yaml === 'string')) continue;
        const location = path ? `${path}.${key}` : key;
        if (key === 'navigation_path' && typeof child === 'string' && /^[a-z][a-z0-9_-]*$/.test(child)) links.push({ path: location, target: child });
        if (key === 'yaml' && typeof child === 'string') {
          trackOperation('diagnostics-yaml');
          try { walk(yaml.load(child), location, depth + 1); } catch { /* Syntax errors belong to the YAML editor. */ }
        } else {
          if (ENTITY_FIELDS.has(key) || key.endsWith('_entity') || key.endsWith('_entities') || key.endsWith('_entity_id')) add(child, location, key === 'hidden' ? 'exclusion' : 'display');
          walk(child, location, depth + 1);
        }
      }
    }
    ancestors.delete(value);
  };
  walk(config, '');
  const items = Array.isArray(root.weather_start_layout_items) ? root.weather_start_layout_items : [];
  items.forEach((item: Record<string, any>, index: number) => {
    if (!item || item.yaml || item.parsed_config) return;
    const path = `weather_start_layout_items[${index}]`;
    if (item.type === 'house_mode' && !root.house_mode_entity) hint('house_mode_unconfigured', path);
    if (item.type === 'custom_card' && !root.custom_cards?.some((card: { id?: string }) => card.id === item.custom_card_id)) hint('layout_reference', path);
    if (item.type === 'custom_section' && !root.custom_sections?.some((section: { id?: string }) => section.id === item.custom_section_id)) hint('layout_reference', path);
  });
  for (const [id, options] of Object.entries(root.areas_options ?? {})) {
    if ((options as { view_override?: unknown })?.view_override) hint('room_override', `areas_options.${id}.view_override`);
  }
  return { references, hints, links, config: root as Simon42StrategyConfig };
}

export function collectEntityReferences(config: unknown): EntityReference[] { return analyzeConfig(config).references; }
export function inspectAnalysis(analysis: ConfigAnalysis, hass: HomeAssistant): ConfigIssue[] {
  const hints = [...analysis.hints];
  if (analysis.links.length) {
    const paths = getConfiguredNavigationPaths(analysis.config, hass);
    for (const link of analysis.links) if (!paths.has(link.target)) hints.push({ code: 'navigation_target', severity: 'warning', path: link.path });
  }
  for (const [index, item] of (analysis.config.weather_start_layout_items ?? []).entries()) {
    if (item.yaml || item.parsed_config) continue;
    if ((item.type === 'area' && item.area_id && !hass.areas[item.area_id]) || (item.type === 'floor' && item.floor_id && !hass.floors[item.floor_id])) hints.push({ code: 'layout_reference', severity: 'info', path: `weather_start_layout_items[${index}]` });
  }
  return [...hints, ...analysis.references.flatMap((ref): ConfigIssue[] => {
    const registry = hass.entities[ref.entityId];
    const state = hass.states[ref.entityId];
    let status: EntityStatus | undefined;
    if (registry?.disabled_by) status = 'disabled';
    else if (!state) status = registry ? 'no_state' : 'missing';
    else if (state.state === 'unavailable') status = 'unavailable';
    else if (state.state === 'unknown' && !/^(button|input_button|event|scene)\./.test(ref.entityId)) status = 'unknown';
    if (!status || (ref.purpose === 'exclusion' && status !== 'missing')) return [];
    return [{ code: `entity_${status}`, severity: ref.purpose === 'exclusion' ? 'info' : status === 'missing' ? 'error' : 'warning', path: ref.path, entityId: ref.entityId, status }];
  })];
}
export function inspectConfig(config: unknown, hass: HomeAssistant): ConfigIssue[] { return inspectAnalysis(analyzeConfig(config), hass); }
export function isRestrictedEntity(hass: HomeAssistant, id: string): boolean {
  const category = hass.entities[id]?.entity_category;
  return category === 'config' || category === 'diagnostic';
}
export function isSelectableEntity(hass: HomeAssistant, id: string, selected: ReadonlySet<string>): boolean {
  return !isRestrictedEntity(hass, id) || selected.has(id);
}
