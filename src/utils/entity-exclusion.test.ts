import { describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { getGroupedClimateMembers, getRegistryExclusionReason } from './entity-exclusion';

describe('registry exclusion reasons', () => {
  const hass = makeHass({
    entities: [
      { entity_id: 'sensor.labeled', labels: ['no_dboard'] },
      { entity_id: 'sensor.legacy_label', labels: ['no-dboard'] },
      { entity_id: 'sensor.disabled', disabled_by: 'user' },
      { entity_id: 'sensor.hidden', hidden_by: 'user' },
      { entity_id: 'switch.config', entity_category: 'config' },
      { entity_id: 'sensor.diagnostic', entity_category: 'diagnostic' },
      { entity_id: 'sensor.plain' },
    ],
  });

  it('names the first registry rule that excludes an entity', () => {
    expect(getRegistryExclusionReason(hass, 'sensor.labeled')).toBe('label');
    expect(getRegistryExclusionReason(hass, 'sensor.legacy_label')).toBe('label');
    expect(getRegistryExclusionReason(hass, 'sensor.disabled')).toBe('disabled');
    expect(getRegistryExclusionReason(hass, 'sensor.hidden')).toBe('hidden');
    expect(getRegistryExclusionReason(hass, 'switch.config')).toBe('category');
    expect(getRegistryExclusionReason(hass, 'sensor.diagnostic')).toBe('category');
  });

  it('returns nothing for visible or unknown entities', () => {
    expect(getRegistryExclusionReason(hass, 'sensor.plain')).toBeUndefined();
    expect(getRegistryExclusionReason(hass, 'sensor.missing')).toBeUndefined();
  });

  it('reports climate members only when a member set is passed', () => {
    const members = new Set(['sensor.plain']);
    expect(getRegistryExclusionReason(hass, 'sensor.plain', members)).toBe('climate_member');
    expect(getRegistryExclusionReason(hass, 'sensor.plain')).toBeUndefined();
  });
});

describe('getGroupedClimateMembers', () => {
  const wrapperAttributes = { batteries: JSON.stringify({ 'climate.trv': { battery: null } }) };

  it('collects members of a visible Better Thermostat wrapper', () => {
    const hass = makeHass({
      entities: [
        { entity_id: 'climate.room_heating', platform: 'better_thermostat', attributes: wrapperAttributes },
        { entity_id: 'climate.trv', platform: 'matter' },
      ],
    });
    expect([...getGroupedClimateMembers(hass)]).toEqual(['climate.trv']);
  });

  it('keeps members when the wrapper is excluded by registry or configuration', () => {
    const labeled = makeHass({
      entities: [
        {
          entity_id: 'climate.room_heating',
          platform: 'better_thermostat',
          labels: ['no_dboard'],
          attributes: wrapperAttributes,
        },
        { entity_id: 'climate.trv', platform: 'matter' },
      ],
    });
    expect(getGroupedClimateMembers(labeled).size).toBe(0);

    const plain = makeHass({
      entities: [
        { entity_id: 'climate.room_heating', platform: 'better_thermostat', attributes: wrapperAttributes },
        { entity_id: 'climate.trv', platform: 'matter' },
      ],
    });
    expect(getGroupedClimateMembers(plain, new Set(['climate.room_heating'])).size).toBe(0);
  });
});
