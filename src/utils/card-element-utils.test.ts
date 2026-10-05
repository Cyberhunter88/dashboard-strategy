import { expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { hasHassPresentationChanged, haveEntityStatesChanged } from './card-element-utils';

it('detects presentation, relevant attributes and availability but ignores unrelated state updates', () => {
  const hass = makeHass({ entities: [{ entity_id: 'light.fixture' }, { entity_id: 'sensor.other' }] });
  const unrelated = { ...hass, states: { ...hass.states, 'sensor.other': { ...hass.states['sensor.other'], state: '2' } } };
  expect(hasHassPresentationChanged(hass, unrelated)).toBe(false);
  expect(haveEntityStatesChanged(hass, unrelated, ['light.fixture'])).toBe(false);
  for (const patch of [{ language: 'de' }, { areas: { ...hass.areas } }, { devices: { ...hass.devices } }, { floors: { ...hass.floors } }]) expect(hasHassPresentationChanged(hass, { ...hass, ...patch })).toBe(true);
  const changed = { ...hass, states: { ...hass.states, 'light.fixture': { ...hass.states['light.fixture'], attributes: { brightness: 42 } } } };
  expect(haveEntityStatesChanged(hass, changed, ['light.fixture'])).toBe(true);
  changed.states['light.fixture'] = { ...changed.states['light.fixture'], state: 'unavailable' };
  expect(haveEntityStatesChanged(hass, changed, ['light.fixture'])).toBe(true);
});
