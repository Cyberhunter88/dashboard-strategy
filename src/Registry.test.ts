import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from './Registry';
import type { HomeAssistant } from './types/homeassistant';
import type { DeviceRegistryEntry, EntityRegistryEntry, FloorRegistryEntry } from './types/registries';
import type { Simon42StrategyConfig } from './types/strategy';
import { localize } from './utils/localize';

function entity(entityId: string, overrides: Partial<EntityRegistryEntry> = {}): EntityRegistryEntry {
  return {
    entity_id: entityId,
    area_id: 'living_room',
    labels: [],
    ...overrides,
  };
}

function hassWith(
  entities: EntityRegistryEntry[],
  overrides: Partial<Pick<HomeAssistant, 'areas' | 'devices' | 'floors' | 'language' | 'locale' | 'states'>> = {}
): HomeAssistant {
  const states = Object.fromEntries(
    entities.map(({ entity_id }) => [
      entity_id,
      {
        entity_id,
        state: 'on',
        attributes: {},
        context: { id: 'test', parent_id: null, user_id: null },
        last_changed: '2026-01-01T00:00:00Z',
        last_updated: '2026-01-01T00:00:00Z',
      },
    ])
  );

  return {
    entities: Object.fromEntries(entities.map((entry) => [entry.entity_id, entry])),
    devices: {},
    areas: {},
    floors: {},
    states,
    language: 'en',
    locale: { language: 'en' },
    ...overrides,
  } as HomeAssistant;
}

beforeEach(() => {
  Registry.resetForTesting();
});

describe('Registry', () => {
  it('tracks returning states without rebuilding registries or exposing disabled candidates', () => {
    const hass = hassWith([entity('light.returning'), entity('light.disabled', { disabled_by: 'user' })], {
      states: {},
    });
    Registry.initialize(hass, {});
    const candidates = Registry.getVisibleCandidateIdsForDomain('light');
    expect(candidates).toEqual(['light.returning']);
    expect(Registry.getVisibleEntityIdsForDomain('light')).toEqual([]);
    const returning = hassWith([entity('light.returning')]).states;
    Registry.initialize({ ...hass, states: returning }, {});
    expect(Registry.getVisibleCandidateIdsForDomain('light')).toBe(candidates);
    expect(Registry.getVisibleEntityIdsForDomain('light')).toEqual(['light.returning']);
  });
  it('reuses indexes when only non-filtering dashboard options change', () => {
    const hass = hassWith([entity('light.visible')]);
    const config = {};
    Registry.initialize(hass, config);
    const entries = Registry.getVisibleEntitiesForArea('living_room');
    const updated = { show_maintenance_view: true };
    Registry.initialize(hass, updated);
    expect(Registry.getVisibleEntitiesForArea('living_room')).toBe(entries);
    expect(Registry.config).toBe(updated);
  });
  it('keeps raw entries while filtering hidden, excluded, and diagnostic entries', () => {
    const entries = [
      entity('light.visible'),
      entity('light.hidden', { hidden_by: 'user' }),
      entity('light.excluded', { labels: ['no_dboard'] }),
      entity('sensor.diagnostic', { entity_category: 'diagnostic' }),
      entity('switch.config_hidden'),
    ];
    const hass = hassWith(entries);
    const config = {
      areas_options: {
        living_room: {
          groups_options: {
            switches: { hidden: ['switch.config_hidden'] },
          },
        },
      },
    } as Simon42StrategyConfig;

    Registry.initialize(hass, config);

    expect(Registry.getEntitiesForArea('living_room')).toEqual(entries);
    expect(Registry.getVisibleEntitiesForArea('living_room').map((entry) => entry.entity_id)).toEqual([
      'light.visible',
    ]);
    expect(Registry.getEntityIdsForDomain('light')).toEqual(['light.visible', 'light.hidden', 'light.excluded']);
    expect(Registry.getVisibleEntityIdsForDomain('light')).toEqual(['light.visible']);
  });

  it('reuses maps when registry and config references are unchanged', () => {
    const hass = hassWith([entity('light.visible')]);
    const config = {} as Simon42StrategyConfig;
    Registry.initialize(hass, config);
    const visibleEntries = Registry.getVisibleEntitiesForArea('living_room');

    const stateOnlyUpdate = {
      ...hass,
      states: { ...hass.states },
      language: 'de',
      locale: { ...hass.locale, language: 'de' as const },
    };
    Registry.initialize(stateOnlyUpdate, config);

    expect(Registry.isCurrent(stateOnlyUpdate, config)).toBe(true);
    expect(Registry.hass).toBe(stateOnlyUpdate);
    expect(Registry.getVisibleEntitiesForArea('living_room')).toBe(visibleEntries);
    expect(localize('views.lights')).toBe('Lichter');
  });

  it('rebuilds when floors change so floor metadata stays current', () => {
    const hass = hassWith([entity('light.visible')]);
    const config = {} as Simon42StrategyConfig;
    Registry.initialize(hass, config);
    const visibleEntries = Registry.getVisibleEntitiesForArea('living_room');

    const floor: FloorRegistryEntry = {
      floor_id: 'ground',
      name: 'Ground floor',
      level: 0,
      icon: null,
      aliases: [],
    };
    const updated = hassWith([entity('light.visible')], {
      floors: { ground: floor },
    });

    Registry.initialize(updated, config);

    expect(Registry.isCurrent(updated, config)).toBe(true);
    expect(Registry.hass).toBe(updated);
    expect(Registry.getVisibleEntitiesForArea('living_room')).not.toBe(visibleEntries);
    expect(Registry.floors).toEqual([floor]);
  });

  it('keeps badge-hidden entities visible outside the badge pseudo-group', () => {
    const hass = hassWith([entity('sensor.power')]);
    const config = {
      areas_options: {
        living_room: { groups_options: { badges: { hidden: ['sensor.power'] } } },
      },
    } as Simon42StrategyConfig;
    Registry.initialize(hass, config);
    expect(Registry.isHiddenByConfig('sensor.power')).toBe(false);
    expect(Registry.getVisibleEntitiesForArea('living_room').map((entry) => entry.entity_id)).toContain('sensor.power');
  });

  it('resolves an entity area through its parent device', () => {
    const childEntity = entity('sensor.child_temperature', { area_id: null, device_id: 'child' });
    const hass = hassWith([childEntity], {
      devices: {
        parent: {
          id: 'parent',
          area_id: 'living_room',
          config_entries: [],
          connections: [],
          identifiers: [],
          manufacturer: null,
          model: null,
          model_id: null,
          name: null,
          name_by_user: null,
          labels: [],
          sw_version: null,
          hw_version: null,
          serial_number: null,
          via_device_id: null,
          entry_type: null,
          disabled_by: null,
          configuration_url: null,
          primary_config_entry: null,
        },
        child: {
          id: 'child',
          area_id: null,
          parent_device_id: 'parent',
          config_entries: [],
          connections: [],
          identifiers: [],
          manufacturer: null,
          model: null,
          model_id: null,
          name: null,
          name_by_user: null,
          labels: [],
          sw_version: null,
          hw_version: null,
          serial_number: null,
          via_device_id: null,
          entry_type: null,
          disabled_by: null,
          configuration_url: null,
          primary_config_entry: null,
        } as DeviceRegistryEntry,
      },
    });

    Registry.initialize(hass, {} as Simon42StrategyConfig);

    expect(Registry.getVisibleEntitiesForArea('living_room').map((entry) => entry.entity_id)).toContain(
      'sensor.child_temperature'
    );
    expect(Registry.getDeviceAreaId('child')).toBe('living_room');
  });
});
