import type { LovelaceCondition, LovelaceViewConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';

export function getViewVisibleUsers(config: Simon42StrategyConfig, path: string): string[] | undefined {
  const rules = config.view_visible_users || {};
  if (Object.prototype.hasOwnProperty.call(rules, path)) return (Reflect.get(rules, path) as string[] | undefined) || [];
  return undefined;
}

export function getSectionVisibleUsers(config: Simon42StrategyConfig, key: string): string[] | undefined {
  const rules = config.section_visible_users || {};
  if (Object.prototype.hasOwnProperty.call(rules, key)) return (Reflect.get(rules, key) as string[] | undefined) || [];
  return undefined;
}

export function userVisibilityConditions(users: string[] | undefined): LovelaceCondition[] | undefined {
  return users === undefined ? undefined : [{ condition: 'user', users }];
}

export function unionVisibleUsers(rules: (string[] | undefined)[]): string[] | undefined {
  const union = new Set<string>();
  for (const rule of rules) {
    if (rule === undefined) return undefined;
    for (const user of rule) union.add(user);
  }
  return [...union];
}

export function applyViewVisibility(view: LovelaceViewConfig, config: Simon42StrategyConfig): LovelaceViewConfig {
  if (!view.path) return view;
  const users = getViewVisibleUsers(config, view.path);
  if (users === undefined) return view;
  return { ...view, visible: users.length === 0 ? false : users.map((user) => ({ user })) };
}
