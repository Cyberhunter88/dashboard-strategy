// ====================================================================
// Strict, dashboard-wide no_dboard exclusion for configured entities
// ====================================================================
// Automatically discovered entities already pass Registry visibility, which
// drops every entity labeled `no_dboard`. Entities picked explicitly in the
// strategy options (favorites, quick actions, room pins, extra badges, ...)
// used to bypass that rule. This normalizer removes labeled entities from
// those option lists once in generate(), so every view sees the same strict
// rule. User-written YAML (custom cards, sections, badges, view overrides)
// is left untouched: the dashboard never rewrites hand-authored cards.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { AreaOptions, Simon42StrategyConfig } from '../types/strategy';
import { isDashboardLabelExcluded } from './entity-exclusion';

/** Option lists holding plain entity ids. */
const ENTITY_LIST_KEYS = [
  'favorite_entities',
  'light_favorite_entities',
  'quick_action_entities',
  'room_pin_entities',
  'security_extra_entities',
  'pollen_entities',
  'agenda_calendar_entities',
  'todos_entities',
] as const satisfies ReadonlyArray<keyof Simon42StrategyConfig>;

/** Options holding a single entity id. */
const SINGLE_ENTITY_KEYS = [
  'alarm_entity',
  'house_mode_entity',
  'weather_entity',
  'power_badge_entity',
] as const satisfies ReadonlyArray<keyof Simon42StrategyConfig>;

/** Configured option entries that the no_dboard label removes, with their option path. */
export function findLabelExcludedOptionEntities(
  config: Simon42StrategyConfig,
  hass: HomeAssistant
): Array<{ path: string; entityId: string }> {
  const found: Array<{ path: string; entityId: string }> = [];
  const check = (entityId: unknown, path: string) => {
    if (typeof entityId === 'string' && isDashboardLabelExcluded(hass, entityId)) found.push({ path, entityId });
  };
  for (const key of ENTITY_LIST_KEYS) (config[key] ?? []).forEach((id, i) => check(id, `${key}[${i}]`));
  for (const key of SINGLE_ENTITY_KEYS) check(config[key], key);
  (config.weather_sensors ?? []).forEach((sensor, i) => check(sensor?.entity, `weather_sensors[${i}].entity`));
  for (const [areaId, options] of Object.entries(config.areas_options ?? {})) {
    (options?.groups_options?.badges?.additional ?? []).forEach((id, i) =>
      check(id, `areas_options.${areaId}.groups_options.badges.additional[${i}]`)
    );
  }
  return found;
}

/**
 * Return a config copy without entities labeled `no_dboard` in the
 * entity-valued strategy options. Returns the same object when nothing is
 * removed, so Registry identity checks stay cheap.
 */
export function applyDashboardLabelExclusion(
  config: Simon42StrategyConfig,
  hass: HomeAssistant
): Simon42StrategyConfig {
  if (findLabelExcludedOptionEntities(config, hass).length === 0) return config;

  const allowed = (entityId: string) => !isDashboardLabelExcluded(hass, entityId);
  const result: Simon42StrategyConfig = { ...config };
  for (const key of ENTITY_LIST_KEYS) {
    const list = config[key];
    if (list) result[key] = list.filter(allowed);
  }
  for (const key of SINGLE_ENTITY_KEYS) {
    const entityId = config[key];
    if (entityId && !allowed(entityId)) delete result[key];
  }
  if (config.weather_sensors) {
    result.weather_sensors = config.weather_sensors.filter((sensor) => !sensor?.entity || allowed(sensor.entity));
  }
  if (config.areas_options) {
    const areasOptions: Record<string, AreaOptions> = {};
    for (const [areaId, options] of Object.entries(config.areas_options)) {
      const badges = options?.groups_options?.badges;
      areasOptions[areaId] = badges?.additional
        ? {
            ...options,
            groups_options: {
              ...options.groups_options,
              badges: { ...badges, additional: badges.additional.filter(allowed) },
            },
          }
        : options;
    }
    result.areas_options = areasOptions;
  }
  return result;
}
