import { expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { hasHassPresentationChanged, haveEntityMembershipChanged, haveEntityStatesChanged } from './card-element-utils';

it('detects presentation, relevant attributes and availability but ignores unrelated state updates', () => {
  const hass = makeHass({ entities: [{ entity_id: 'light.fixture' }, { entity_id: 'sensor.other' }] });
  const unrelated = {
    ...hass,
    states: { ...hass.states, 'sensor.other': { ...hass.states['sensor.other'], state: '2' } },
  };
  expect(hasHassPresentationChanged(hass, unrelated)).toBe(false);
  expect(haveEntityStatesChanged(hass, unrelated, ['light.fixture'])).toBe(false);
  for (const patch of [
    { language: 'de' },
    { areas: { ...hass.areas } },
    { devices: { ...hass.devices } },
    { floors: { ...hass.floors } },
  ])
    expect(hasHassPresentationChanged(hass, { ...hass, ...patch })).toBe(true);
  const changed = {
    ...hass,
    states: { ...hass.states, 'light.fixture': { ...hass.states['light.fixture'], attributes: { brightness: 42 } } },
  };
  expect(haveEntityStatesChanged(hass, changed, ['light.fixture'])).toBe(true);
  changed.states['light.fixture'] = { ...changed.states['light.fixture'], state: 'unavailable' };
  expect(haveEntityStatesChanged(hass, changed, ['light.fixture'])).toBe(true);
});

it('detects membership changes across several id lists without reacting to plain state changes', () => {
  const hass = makeHass({
    entities: [
      { entity_id: 'sensor.level', state: '80', attributes: { device_class: 'battery', unit_of_measurement: '%' } },
      { entity_id: 'binary_sensor.low', state: 'off', attributes: { device_class: 'battery' } },
    ],
  });
  const lists = [['sensor.level'], ['binary_sensor.low', 'binary_sensor.missing']];
  const withState = (id: string, patch: Record<string, unknown> | undefined) => {
    const states = { ...hass.states };
    if (patch) states[id] = { ...states[id], ...patch };
    else delete states[id];
    return { ...hass, states };
  };

  expect(haveEntityMembershipChanged(undefined, hass, ...lists)).toBe(true);
  expect(haveEntityMembershipChanged(hass, hass, ...lists)).toBe(false);
  expect(haveEntityMembershipChanged(hass, withState('sensor.level', { state: '79' }), ...lists)).toBe(false);
  expect(
    haveEntityMembershipChanged(hass, withState('sensor.level', { attributes: { device_class: 'battery' } }), ...lists)
  ).toBe(true);
  // A change in the second list must be found as well.
  expect(
    haveEntityMembershipChanged(
      hass,
      withState('binary_sensor.low', { attributes: { device_class: 'door' } }),
      ...lists
    )
  ).toBe(true);
  expect(haveEntityMembershipChanged(hass, withState('binary_sensor.low', undefined), ...lists)).toBe(true);
  // Ids outside the lists are ignored.
  expect(haveEntityMembershipChanged(hass, withState('sensor.level', undefined), ['binary_sensor.low'])).toBe(false);
});
