import { afterAll, beforeAll, it, expect } from 'vitest';
import { Registry } from './Registry';
import * as diagnostics from './editor/config-diagnostics';
import { makeOptimizationFixture } from '../tests/fixtures/optimization';
import type { HomeAssistant } from './types/homeassistant';
import type { Simon42StrategyConfig } from './types/strategy';
import type { LovelaceViewConfig } from './types/lovelace';

const originals = {
  HTMLElement: globalThis.HTMLElement,
  customElements: globalThis.customElements,
  window: globalThis.window,
};
let generate: (options: { dashboardConfig: Simon42StrategyConfig }, hass: HomeAssistant) => Promise<LovelaceViewConfig>;
beforeAll(async () => {
  const definitions = new Map<string, unknown>();
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: (name: string, ctor: unknown) => definitions.set(name, ctor) },
    window: { location: { pathname: '/synthetic-dashboard/home', search: '' } },
  });
  await import('./views/OverviewViewStrategy');
  generate = (definitions.get('ll-strategy-dashboard-strategy-view-overview') as { generate: typeof generate })
    .generate;
});
afterAll(() => Object.assign(globalThis, originals));

it('measures synthetic generation and diagnostics without changing input', async () => {
  for (const count of [500, 2000, 5000]) {
    const { hass, config } = makeOptimizationFixture(count);
    const before = JSON.stringify(config);
    const cacheClass = (
      diagnostics as unknown as { ConfigDiagnostics?: new () => { inspect: typeof diagnostics.inspectConfig } }
    ).ConfigDiagnostics;
    const cache = cacheClass ? new cacheClass() : undefined;
    const samples: Record<string, number[]> = { registry: [], overview: [], diagnostics: [] };
    for (let i = 0; i < 13; i++) {
      Registry.resetForTesting();
      let start = performance.now();
      Registry.initialize(hass, config);
      const registry = performance.now() - start;
      start = performance.now();
      const view = await generate({ dashboardConfig: config }, hass);
      const overview = performance.now() - start;
      expect(view.sections?.length).toBeGreaterThan(0);
      start = performance.now();
      for (let update = 0; update < 100; update++) {
        if (cache) cache.inspect(config, hass);
        else diagnostics.inspectConfig(config, hass);
      }
      if (i > 2) {
        samples.registry.push(registry);
        samples.overview.push(overview);
        samples.diagnostics.push(performance.now() - start);
      }
    }
    expect(JSON.stringify(config)).toBe(before);
    process.stdout.write(
      'OPTIMIZATION_BENCHMARK ' +
        JSON.stringify({
          count,
          medianMs: Object.fromEntries(
            Object.entries(samples).map(([key, values]) => [
              key,
              values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
            ])
          ),
        }) +
        '\n'
    );
  }
});
