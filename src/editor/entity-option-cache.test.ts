import { expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { haveEntityOptionSourcesChanged } from './entity-option-cache';

it('reuses picker options for telemetry but refreshes names and membership', () => {
  const { states } = makeHass({ entities: [{ entity_id: 'sensor.fixture', attributes: { friendly_name: 'Fixture' } }] });
  expect(haveEntityOptionSourcesChanged(states, { ...states, 'sensor.fixture': { ...states['sensor.fixture'], state: '2' } })).toBe(false);
  expect(haveEntityOptionSourcesChanged(states, { ...states, 'sensor.fixture': { ...states['sensor.fixture'], attributes: { friendly_name: 'New name' } } })).toBe(true);
  expect(haveEntityOptionSourcesChanged(states, {})).toBe(true);
  expect(haveEntityOptionSourcesChanged(states, { 'sensor.new': states['sensor.fixture'] })).toBe(true);
});
