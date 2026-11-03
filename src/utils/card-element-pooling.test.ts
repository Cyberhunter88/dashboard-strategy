import { expect, it, vi } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { propagateHassToCards, setPooledCardConfig, type LovelaceCardElement } from './card-element-utils';

function fakeCard(): LovelaceCardElement & { setConfig: ReturnType<typeof vi.fn> } {
  return { setConfig: vi.fn() } as unknown as LovelaceCardElement & { setConfig: ReturnType<typeof vi.fn> };
}

it('configures a pooled card only when its configuration content changes', () => {
  const card = fakeCard();
  setPooledCardConfig(card, { type: 'tile', entity: 'light.a' });
  setPooledCardConfig(card, { type: 'tile', entity: 'light.a' });
  expect(card.setConfig).toHaveBeenCalledTimes(1);
  setPooledCardConfig(card, { type: 'tile', entity: 'light.b' });
  expect(card.setConfig).toHaveBeenCalledTimes(2);
  expect(card.setConfig).toHaveBeenLastCalledWith({ type: 'tile', entity: 'light.b' });
});

it('tracks configuration per pooled card instance', () => {
  const first = fakeCard();
  const second = fakeCard();
  setPooledCardConfig(first, { type: 'tile', entity: 'light.a' });
  setPooledCardConfig(second, { type: 'tile', entity: 'light.a' });
  expect(first.setConfig).toHaveBeenCalledTimes(1);
  expect(second.setConfig).toHaveBeenCalledTimes(1);
});

it('propagates hass to single cards and iterables and skips empty groups', () => {
  const hass = makeHass({ entities: [{ entity_id: 'light.a' }] });
  const single = fakeCard();
  const pooled = [fakeCard(), fakeCard()];
  const map = new Map([['k', fakeCard()]]);
  propagateHassToCards(hass, single, pooled, map.values(), null, undefined);
  expect(single.hass).toBe(hass);
  expect(pooled.every((card) => card.hass === hass)).toBe(true);
  expect([...map.values()][0].hass).toBe(hass);
});
