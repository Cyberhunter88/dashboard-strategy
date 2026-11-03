// @vitest-environment happy-dom
import { beforeAll, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';

type TestCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: Record<string, unknown>): void;
  updateComplete: Promise<boolean>;
};

class FakeNativeCard extends HTMLElement {
  config?: Record<string, unknown>;
  hass?: HomeAssistant;
  setConfig(config: Record<string, unknown>): void {
    this.config = config;
  }
}

const settle = async (card: TestCard): Promise<void> => {
  await card.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
};

beforeAll(async () => {
  for (const tag of ['hui-tile-card', 'hui-heading-card']) {
    if (!customElements.get(tag)) customElements.define(tag, class extends FakeNativeCard {});
  }
  await import('./LightsGroupCard');
  await import('./CoversGroupCard');
});

function mount(tag: string, config: Record<string, unknown>, hass: HomeAssistant): TestCard {
  const card = document.createElement(tag) as TestCard;
  card.setConfig(config);
  card.hass = hass;
  document.body.appendChild(card);
  return card;
}

const strategyConfig = {} as Simon42StrategyConfig;

it('reuses the pooled light tile for unrelated state updates and removes it when the light disappears', async () => {
  const hass = makeHass({
    entities: [
      { entity_id: 'light.lamp', state: 'on' },
      { entity_id: 'sensor.other', state: '1' },
    ],
  });
  Registry.initialize(hass, strategyConfig);
  const card = mount(
    'dashboard-strategy-lights-group-card',
    { group_type: 'all', config: strategyConfig, entities: ['light.lamp'] },
    hass
  );
  await settle(card);
  const tile = card.shadowRoot?.querySelector('hui-tile-card');
  expect(tile).toBeTruthy();

  card.hass = { ...hass, states: { ...hass.states, 'sensor.other': { ...hass.states['sensor.other'], state: '2' } } };
  await settle(card);
  expect(card.shadowRoot?.querySelector('hui-tile-card')).toBe(tile);

  const states = { ...hass.states };
  delete states['light.lamp'];
  card.hass = { ...hass, states };
  await settle(card);
  expect(card.shadowRoot?.querySelector('hui-tile-card')).toBeNull();
  card.remove();
});

it('renders closed covers into a pooled tile that survives unrelated updates', async () => {
  const hass = makeHass({
    entities: [
      { entity_id: 'cover.blind', state: 'closed', attributes: { device_class: 'shutter' } },
      { entity_id: 'sensor.other', state: '1' },
    ],
  });
  Registry.initialize(hass, strategyConfig);
  const card = mount(
    'dashboard-strategy-covers-group-card',
    { group_type: 'closed', config: strategyConfig, device_classes: ['shutter'] },
    hass
  );
  await settle(card);
  const tile = card.shadowRoot?.querySelector('hui-tile-card');
  expect(tile).toBeTruthy();
  card.hass = { ...hass, states: { ...hass.states, 'sensor.other': { ...hass.states['sensor.other'], state: '2' } } };
  await settle(card);
  expect(card.shadowRoot?.querySelector('hui-tile-card')).toBe(tile);
  card.remove();
});
