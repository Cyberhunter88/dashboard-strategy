// ====================================================================
// Climate view — humidity and CO2 alerts per room
// ====================================================================
// Thresholds are evaluated live by Lovelace visibility conditions: the
// strategy only regenerates on registry changes, so a generation-time
// comparison would go stale. The whole section hides while all is fine.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceCondition, LovelaceSectionConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export const DEFAULT_HUMIDITY_THRESHOLD = 65;
export const DEFAULT_CO2_THRESHOLD = 1200;

type AirQualityConfig = Pick<
  Simon42StrategyConfig,
  'show_climate_air_quality' | 'climate_humidity_threshold' | 'climate_co2_threshold'
>;

interface AirQualityAlert {
  entityId: string;
  above: number;
  color: string;
}

function validThreshold(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function areaNameFor(hass: HomeAssistant, entityId: string): string | undefined {
  const entry = Registry.getEntity(entityId);
  const areaId = entry?.area_id ?? (entry?.device_id ? Registry.getDeviceAreaId(entry.device_id) : null);
  return areaId ? hass.areas[areaId]?.name : undefined;
}

export function collectAirQualityAlerts(hass: HomeAssistant, config: AirQualityConfig): AirQualityAlert[] {
  const humidity = validThreshold(config.climate_humidity_threshold, DEFAULT_HUMIDITY_THRESHOLD);
  const co2 = validThreshold(config.climate_co2_threshold, DEFAULT_CO2_THRESHOLD);
  const alerts: AirQualityAlert[] = [];

  for (const entityId of Registry.getVisibleEntityIdsForDomain('sensor')) {
    const attributes = hass.states[entityId]?.attributes;
    if (!attributes) continue;
    // Relative humidity only; absolute humidity uses g/m³ and another scale.
    if (attributes.device_class === 'humidity' && attributes.unit_of_measurement === '%') {
      alerts.push({ entityId, above: humidity, color: 'blue' });
    } else if (attributes.device_class === 'carbon_dioxide') {
      alerts.push({ entityId, above: co2, color: 'deep-orange' });
    }
  }
  return alerts;
}

export function buildAirQualitySection(hass: HomeAssistant, config: AirQualityConfig): LovelaceSectionConfig | null {
  if (config.show_climate_air_quality !== true) return null;
  const alerts = collectAirQualityAlerts(hass, config);
  if (alerts.length === 0) return null;

  const condition = (alert: AirQualityAlert): LovelaceCondition => ({
    condition: 'numeric_state',
    entity: alert.entityId,
    above: alert.above,
  });

  const cards: LovelaceCardConfig[] = [
    {
      type: 'heading',
      heading: localize('climate.air_quality'),
      heading_style: 'title',
      icon: 'mdi:air-filter',
    },
    ...alerts.map((alert) => {
      const areaName = areaNameFor(hass, alert.entityId);
      return {
        type: 'tile',
        entity: alert.entityId,
        vertical: false,
        color: alert.color,
        ...(areaName ? { name: areaName } : {}),
        visibility: [condition(alert)],
      };
    }),
  ];

  return {
    type: 'grid',
    cards,
    visibility: alerts.length === 1 ? [condition(alerts[0])] : [{ condition: 'or', conditions: alerts.map(condition) }],
  };
}
