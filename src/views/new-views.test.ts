import { beforeEach, describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { Registry } from '../Registry';
import { buildAirQualitySection, collectAirQualityAlerts } from './ClimateAirQuality';
import { buildEnergyView, collectTopConsumers, MAX_TOP_CONSUMERS, powerInWatts } from './EnergyViewStrategy';

beforeEach(() => Registry.resetForTesting());

const power = (id: string, state: string, unit = 'W', areaId?: string) => ({
  entity_id: id,
  state,
  area_id: areaId ?? null,
  attributes: { device_class: 'power', unit_of_measurement: unit },
});

describe('energy view', () => {
  it('normalizes units and rejects unusable readings', () => {
    const hass = makeHass({
      entities: [power('sensor.a', '1.5', 'kW'), power('sensor.b', 'unavailable'), power('sensor.c', '5', 'VA')],
    });
    expect(powerInWatts(hass, 'sensor.a')).toBe(1500);
    expect(powerInWatts(hass, 'sensor.b')).toBeNull();
    expect(powerInWatts(hass, 'sensor.c')).toBeNull();
    expect(powerInWatts(hass, 'sensor.missing')).toBeNull();
  });

  it('ranks consumers by watts across units and caps the list', () => {
    const entities = [
      power('sensor.kettle', '2', 'kW'),
      power('sensor.tv', '120'),
      power('sensor.idle', '0'),
      ...Array.from({ length: MAX_TOP_CONSUMERS + 3 }, (_, index) => power(`sensor.load_${index}`, String(10 + index))),
    ];
    const hass = makeHass({ entities });
    Registry.initialize(hass, {});
    const ranked = collectTopConsumers(hass);
    expect(ranked[0]).toBe('sensor.kettle');
    expect(ranked[1]).toBe('sensor.tv');
    expect(ranked).toHaveLength(MAX_TOP_CONSUMERS);
    expect(ranked).not.toContain('sensor.idle');
  });

  it('groups sensors per room and shows a hint without any', () => {
    const hass = makeHass({
      entities: [power('sensor.fridge', '80', 'W', 'kitchen')],
      areas: [{ area_id: 'kitchen', name: 'Kitchen' }],
    });
    Registry.initialize(hass, {});
    const view = buildEnergyView(hass, {});
    const headings = view.sections?.flatMap((section) => section.cards ?? []).filter((card) => card.type === 'heading');
    expect(headings?.map((card) => card.heading)).toContain('Kitchen');

    const empty = makeHass({});
    Registry.resetForTesting();
    Registry.initialize(empty, {});
    expect(buildEnergyView(empty, {}).sections?.[0].cards?.[0].type).toBe('markdown');
  });
});

describe('climate air quality', () => {
  const sensors = [
    {
      entity_id: 'sensor.bath_humidity',
      state: '40',
      attributes: { device_class: 'humidity', unit_of_measurement: '%' },
    },
    {
      entity_id: 'sensor.abs_humidity',
      state: '9',
      attributes: { device_class: 'humidity', unit_of_measurement: 'g/m³' },
    },
    { entity_id: 'sensor.office_co2', state: '500', attributes: { device_class: 'carbon_dioxide' } },
  ];

  it('is opt-in and uses live numeric conditions with custom thresholds', () => {
    const hass = makeHass({ entities: sensors });
    Registry.initialize(hass, {});
    expect(buildAirQualitySection(hass, {})).toBeNull();

    const alerts = collectAirQualityAlerts(hass, { climate_humidity_threshold: 70, climate_co2_threshold: 900 });
    expect(alerts.map((alert) => [alert.entityId, alert.above])).toEqual([
      ['sensor.bath_humidity', 70],
      ['sensor.office_co2', 900],
    ]);

    const section = buildAirQualitySection(hass, { show_climate_air_quality: true });
    expect(section?.visibility?.[0]).toMatchObject({ condition: 'or' });
    const tiles = section?.cards?.filter((card) => card.type === 'tile') ?? [];
    expect(tiles[0].visibility?.[0]).toEqual({ condition: 'numeric_state', entity: 'sensor.bath_humidity', above: 65 });
  });

  it('falls back to defaults for invalid thresholds', () => {
    const hass = makeHass({ entities: sensors });
    Registry.initialize(hass, {});
    const alerts = collectAirQualityAlerts(hass, { climate_humidity_threshold: -4, climate_co2_threshold: Number.NaN });
    expect(alerts.map((alert) => alert.above)).toEqual([65, 1200]);
  });
});
