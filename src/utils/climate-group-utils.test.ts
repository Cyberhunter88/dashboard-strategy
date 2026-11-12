import { describe, expect, it } from 'vitest';
import { getClimateGroupMembers } from './climate-group-utils';

describe('getClimateGroupMembers', () => {
  it('reads Climate Group Helper members', () => {
    expect(
      getClimateGroupMembers('climate.living_heating', 'climate_group_helper', {
        member_entities: ['climate.trv_left', 'climate.trv_right'],
      })
    ).toEqual(['climate.trv_left', 'climate.trv_right']);
  });

  it('reads Home Assistant climate group members', () => {
    expect(
      getClimateGroupMembers('climate.group', 'group', { entity_id: ['climate.a', 'sensor.ignored', 'climate.group'] })
    ).toEqual(['climate.a']);
  });

  it('reads Better Thermostat thermostats from the batteries attribute', () => {
    const batteries = JSON.stringify({
      'sensor.office_temperature': { battery: 'off' },
      'climate.office_trv': { battery: null },
    });
    expect(getClimateGroupMembers('climate.office_heating', 'better_thermostat', { batteries })).toEqual([
      'climate.office_trv',
    ]);
  });

  it('ignores unparsable or foreign data', () => {
    expect(getClimateGroupMembers('climate.x', 'better_thermostat', { batteries: '{broken' })).toEqual([]);
    expect(getClimateGroupMembers('climate.x', 'tado', { batteries: '{"climate.y": {}}' })).toEqual([]);
    expect(getClimateGroupMembers('sensor.x', 'group', { entity_id: ['climate.y'] })).toEqual([]);
    expect(getClimateGroupMembers('climate.x', 'group', undefined)).toEqual([]);
  });
});
