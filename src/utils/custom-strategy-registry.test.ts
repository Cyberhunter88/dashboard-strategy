import { describe, expect, it } from 'vitest';
import { registerCustomStrategy, type CustomStrategyEntry } from './custom-strategy-registry';

const dashboard: CustomStrategyEntry = {
  type: 'dashboard-strategy',
  strategyType: 'dashboard',
  name: 'Dashboard Strategy',
};

describe('registerCustomStrategy', () => {
  it('registers bare names because Home Assistant adds the custom: prefix', () => {
    const registry: CustomStrategyEntry[] = [];
    registerCustomStrategy(registry, dashboard);
    expect(registry).toEqual([dashboard]);
    expect(registry.every((entry) => !entry.type.startsWith('custom:'))).toBe(true);
  });

  it('replaces a legacy prefixed entry and stays idempotent', () => {
    const registry: CustomStrategyEntry[] = [{ type: 'custom:dashboard-strategy', strategyType: 'dashboard' }];
    registerCustomStrategy(registry, dashboard);
    registerCustomStrategy(registry, dashboard);
    expect(registry).toEqual([dashboard]);
  });

  it('keeps dashboard and section entries apart and leaves other strategies alone', () => {
    const other: CustomStrategyEntry = { type: 'mushroom-strategy', strategyType: 'dashboard' };
    const registry: CustomStrategyEntry[] = [other];
    registerCustomStrategy(registry, dashboard);
    registerCustomStrategy(registry, { type: 'dashboard-strategy-room', strategyType: 'section' });
    expect(registry.map((entry) => `${entry.strategyType}:${entry.type}`)).toEqual([
      'dashboard:mushroom-strategy',
      'dashboard:dashboard-strategy',
      'section:dashboard-strategy-room',
    ]);
  });
});
