import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceViewConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';
import { makeHass } from '../../tests/fixtures/hass';

type OverviewStrategy = {
  generate: (config: { dashboardConfig: Simon42StrategyConfig }, hass: HomeAssistant) => Promise<LovelaceViewConfig>;
};

const originalGlobals = {
  HTMLElement: globalThis.HTMLElement,
  customElements: globalThis.customElements,
  window: globalThis.window,
};

let overviewStrategy: OverviewStrategy;

beforeAll(async () => {
  const definitions = new Map<string, unknown>();
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: (name: string, constructor: unknown) => definitions.set(name, constructor) },
    window: { location: { pathname: '/lovelace/home', search: '' } },
  });

  await import('./OverviewViewStrategy');
  overviewStrategy = definitions.get('ll-strategy-dashboard-strategy-view-overview') as OverviewStrategy;
});

afterAll(() => {
  Object.assign(globalThis, originalGlobals);
});

beforeEach(() => Registry.resetForTesting());

function makeOverviewHass(): HomeAssistant {
  return makeHass({
    entities: [
      { entity_id: 'input_select.house_mode', state: 'home', attributes: { options: ['home', 'away'] } },
      { entity_id: 'alarm_control_panel.house', state: 'disarmed' },
      { entity_id: 'light.living_room', area_id: 'living_room' },
      { entity_id: 'weather.home', state: 'sunny' },
    ],
    areas: [{ area_id: 'living_room', name: 'Living room' }],
  });
}

function findCard(view: LovelaceViewConfig, predicate: (card: LovelaceCardConfig) => boolean) {
  for (const section of view.sections || []) {
    const card = section.cards?.find(predicate);
    if (card) return card;
  }
  return undefined;
}

describe('overview default presentation', () => {
  it('puts controls, compact summaries, and rooms before compact clock and weather', async () => {
    const view = await overviewStrategy.generate(
      {
        dashboardConfig: {
          house_mode_entity: 'input_select.house_mode',
          alarm_entity: 'alarm_control_panel.house',
          weather_entity: 'weather.home',
        },
      },
      makeOverviewHass()
    );
    const sections = view.sections || [];
    const areaIndex = sections.findIndex((section) =>
      section.cards?.some((card) => card.type === 'custom:dashboard-strategy-area-card')
    );
    const clockIndex = sections.findIndex((section) => section.cards?.some((card) => card.type === 'clock'));
    const summaries = sections.find((section) => section.cards?.some((card) => card.type === 'horizontal-stack'));
    const firstSummaryRow = summaries?.cards?.find((card) => card.type === 'horizontal-stack');
    const weatherTile = findCard(view, (card) => card.type === 'tile' && card.entity === 'weather.home');
    const clockCardIndex = sections
      .flatMap((section) => section.cards || [])
      .findIndex((card) => card.type === 'clock');
    const dateCardIndex = sections
      .flatMap((section) => section.cards || [])
      .findIndex((card) => card.type === 'custom:button-card');
    const weatherCardIndex = sections
      .flatMap((section) => section.cards || [])
      .findIndex((card) => card.type === 'tile' && card.entity === 'weather.home');

    expect(sections[0]?.cards?.[0]).toMatchObject({ type: 'tile', entity: 'input_select.house_mode' });
    expect(sections[1]?.cards?.some((card) => card.entity === 'alarm_control_panel.house')).toBe(true);
    expect(firstSummaryRow?.grid_options).toMatchObject({ rows: 1 });
    expect(areaIndex).toBeGreaterThan(0);
    expect(areaIndex).toBeLessThan(clockIndex);
    expect(dateCardIndex).toBeGreaterThan(clockCardIndex);
    expect(weatherCardIndex).toBeGreaterThan(dateCardIndex);
    expect(findCard(view, (card) => card.type === 'clock')).toMatchObject({
      clock_size: 'small',
      grid_options: { rows: 1 },
    });
    expect(findCard(view, (card) => card.type === 'custom:button-card')?.styles?.name?.[0]).toMatchObject({
      'font-size': '20px',
    });
    expect(weatherTile?.features).toEqual([
      { type: 'temperature-forecast', forecast_type: 'hourly', hours_to_show: 6, show_labels: true },
    ]);
    expect(
      findCard(view, (card) => card.type === 'weather-forecast' && card.forecast_type === 'hourly')
    ).toBeUndefined();
    expect(findCard(view, (card) => card.type === 'weather-forecast' && card.forecast_type === 'daily')).toBeDefined();
  });

  it('preserves an explicit legacy order and its full presentation', async () => {
    const view = await overviewStrategy.generate(
      {
        dashboardConfig: {
          weather_entity: 'weather.home',
          weather_start_order: ['areas', 'clock', 'date', 'weather_current', 'weather_hourly', 'weather_daily'],
        },
      },
      makeOverviewHass()
    );
    const sections = view.sections || [];
    const areaIndex = sections.findIndex((section) =>
      section.cards?.some((card) => card.type === 'custom:dashboard-strategy-area-card')
    );
    const clockIndex = sections.findIndex((section) => section.cards?.some((card) => card.type === 'clock'));
    const currentWeatherIndex = sections.findIndex((section) =>
      section.cards?.some((card) => card.type === 'weather-forecast' && card.show_current === true)
    );
    const cards = sections.flatMap((section) => section.cards || []);
    const clock = findCard(view, (card) => card.type === 'clock');
    const date = findCard(view, (card) => card.type === 'custom:button-card');
    const clockCardIndex = cards.findIndex((card) => card.type === 'clock');
    const dateCardIndex = cards.findIndex((card) => card.type === 'custom:button-card');
    const currentWeatherCardIndex = cards.findIndex(
      (card) => card.type === 'weather-forecast' && card.show_current === true
    );

    expect(areaIndex).toBe(0);
    expect(clockIndex).toBeGreaterThan(areaIndex);
    expect(currentWeatherIndex).toBe(clockIndex);
    expect(dateCardIndex).toBeGreaterThan(clockCardIndex);
    expect(currentWeatherCardIndex).toBeGreaterThan(dateCardIndex);
    expect(clock).toMatchObject({ clock_size: 'large', grid_options: { rows: 2 } });
    expect(date?.styles?.name?.[0]).toMatchObject({ 'font-size': '32px' });
    expect(findCard(view, (card) => card.type === 'weather-forecast' && card.forecast_type === 'hourly')).toBeDefined();
  });

  it('keeps free layouts and YAML block overrides in control', async () => {
    const customLayoutView = await overviewStrategy.generate(
      {
        dashboardConfig: {
          weather_entity: 'weather.home',
          weather_start_layout_items: [
            { id: 'clock', type: 'clock' },
            { id: 'date', type: 'date' },
            { id: 'weather', type: 'weather_current' },
          ],
        },
      },
      makeOverviewHass()
    );
    expect(findCard(customLayoutView, (card) => card.type === 'clock')).toMatchObject({ clock_size: 'large' });
    expect(
      findCard(customLayoutView, (card) => card.type === 'weather-forecast' && card.show_current === true)
    ).toBeDefined();

    Registry.resetForTesting();
    const overrideView = await overviewStrategy.generate(
      {
        dashboardConfig: {
          weather_entity: 'weather.home',
          weather_start_blocks_config: {
            weather_current: { parsed_config: [{ type: 'markdown', content: 'Current override' }] },
            weather_hourly: { parsed_config: [{ type: 'markdown', content: 'Hourly override' }] },
          },
        },
      },
      makeOverviewHass()
    );
    expect(
      findCard(overrideView, (card) => card.type === 'markdown' && card.content === 'Current override')
    ).toBeDefined();
    expect(
      findCard(overrideView, (card) => card.type === 'markdown' && card.content === 'Hourly override')
    ).toBeDefined();
  });
});
