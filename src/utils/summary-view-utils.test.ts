import { describe, expect, it } from 'vitest';
import { countActiveClimateEntities, isUtilityViewEnabled } from './summary-view-utils';
import { makeHass } from '../../tests/fixtures/hass';

describe('isUtilityViewEnabled', () => {
  it('preserves existing defaults', () => {
    expect(isUtilityViewEnabled({}, 'lights')).toBe(true);
    expect(isUtilityViewEnabled({}, 'covers')).toBe(true);
    expect(isUtilityViewEnabled({}, 'security')).toBe(true);
    expect(isUtilityViewEnabled({}, 'batteries')).toBe(true);
    expect(isUtilityViewEnabled({}, 'climate')).toBe(false);
  });

  it('allows each view independently of its hidden summary', () => {
    expect(isUtilityViewEnabled({ show_light_summary: false, show_light_view: true }, 'lights')).toBe(true);
    expect(isUtilityViewEnabled({ show_covers_summary: false, show_covers_view: true }, 'covers')).toBe(true);
    expect(isUtilityViewEnabled({ show_security_summary: false, show_security_view: true }, 'security')).toBe(true);
    expect(isUtilityViewEnabled({ show_battery_summary: false, show_battery_view: true }, 'batteries')).toBe(true);
    expect(isUtilityViewEnabled({ show_climate_view: true }, 'climate')).toBe(true);
  });

  it('disables a view when neither trigger is enabled', () => {
    expect(isUtilityViewEnabled({ show_light_summary: false }, 'lights')).toBe(false);
    expect(isUtilityViewEnabled({ show_climate_summary: false, show_climate_view: false }, 'climate')).toBe(false);
  });
});

describe('countActiveClimateEntities', () => {
  it('does not count idle or off thermostats as active', () => {
    const hass = makeHass({
      entities: [
        { entity_id: 'climate.idle', state: 'heat', attributes: { hvac_action: 'idle' } },
        { entity_id: 'climate.off', state: 'heat', attributes: { hvac_action: 'off' } },
        { entity_id: 'climate.heating', state: 'heat', attributes: { hvac_action: 'heating' } },
      ],
    });
    expect(countActiveClimateEntities(hass, new Set(['climate.idle', 'climate.off', 'climate.heating']), {})).toBe(1);
  });
});
