import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { WeatherPresentation, WeatherSensorConfig } from '../types/strategy';
import { localize } from '../utils/localize';

const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;
const ICON_RE = /^[a-z]+:[a-z0-9-]+$/;

function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

function buildWeatherSensorRow(sensors: WeatherSensorConfig[]): LovelaceCardConfig | null {
  if (sensors.length === 0) return null;

  const parts: string[] = [];
  for (const sensor of sensors) {
    if (typeof sensor.entity !== 'string' || !ENTITY_ID_RE.test(sensor.entity)) continue;

    const icon = typeof sensor.icon === 'string' && ICON_RE.test(sensor.icon) ? sensor.icon : 'mdi:gauge';
    const round =
      typeof sensor.round === 'number' && Number.isInteger(sensor.round) && sensor.round >= 0
        ? sensor.round
        : undefined;
    const valueExpr =
      round !== undefined
        ? `{{ states("${sensor.entity}") | float(0) | round(${round}) }}`
        : `{{ states("${sensor.entity}") }}`;
    const unit = typeof sensor.unit === 'string' && sensor.unit.length > 0 ? ` ${escapeHtml(sensor.unit)}` : '';

    parts.push(`<ha-icon icon="${icon}"></ha-icon> ${valueExpr}${unit}`);
  }

  if (parts.length === 0) return null;

  return {
    type: 'markdown',
    text_only: true,
    content: parts.join(' &nbsp;&nbsp;&nbsp; '),
  };
}

function buildPresentationCard(
  weatherEntity: string,
  presentation: WeatherPresentation
): LovelaceCardConfig | null {
  switch (presentation) {
    case 'forecast_daily':
      return { type: 'weather-forecast', entity: weatherEntity, forecast_type: 'daily' };
    case 'forecast_hourly':
      return { type: 'weather-forecast', entity: weatherEntity, forecast_type: 'hourly' };
    case 'forecast_twice_daily':
      return { type: 'weather-forecast', entity: weatherEntity, forecast_type: 'twice_daily' };
    case 'tile':
      return { type: 'tile', entity: weatherEntity };
    case 'none':
    default:
      return null;
  }
}

export function createWeatherSection(
  weatherEntity: string | null,
  showWeather: boolean,
  showForecastCard = true,
  weatherSensors: WeatherSensorConfig[] = [],
  presentation?: WeatherPresentation,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!weatherEntity || !showWeather) return null;

  const resolvedPresentation: WeatherPresentation =
    presentation ?? (showForecastCard ? 'forecast_daily' : 'none');

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading: localize('sections.weather'),
      heading_style: 'title',
      icon: 'mdi:weather-partly-cloudy',
    });
  }

  const sensorRow = buildWeatherSensorRow(weatherSensors);
  if (sensorRow) cards.push(sensorRow);

  const card = buildPresentationCard(weatherEntity, resolvedPresentation);
  if (card) cards.push(card);

  if (cards.length === 0) return null;
  return { type: 'grid', cards };
}

export function createEnergySection(
  showEnergy: boolean,
  linkDashboard = true,
  showDistributionCard = true,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!showEnergy) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading: localize('sections.energy'),
      heading_style: 'title',
      icon: 'mdi:lightning-bolt',
    });
  }

  if (showDistributionCard) {
    cards.push({
      type: 'energy-distribution',
      link_dashboard: linkDashboard,
    });
  }

  if (cards.length === 0) return null;
  return { type: 'grid', cards };
}
