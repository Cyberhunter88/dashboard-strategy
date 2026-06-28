import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import { isEntityRegistryHidden, type EntityRegistryEntry } from '../types/registries';
import type { RoomEntities, Simon42StrategyConfig } from '../types/strategy';
import { isBadgeCandidate } from './badge-utils';

const UPS_DEVICE_CLASSES = new Set(['duration', 'apparent_power', 'power', 'voltage']);
const UPS_ID_PATTERN = /load|runtime|time_left|input_voltage|status/;
const ENERGY_DEVICE_CLASSES = new Set(['power', 'energy', 'water', 'gas']);

export interface UpsEntityGroup {
  deviceId: string;
  batteryId: string;
  sensorIds: string[];
  entityIds: string[];
}

export interface RoomEntityOptions {
  includeAutomations?: boolean;
  includeCameras?: boolean;
  includeLocks?: boolean;
  includeScripts?: boolean;
}

export function getVisibleAreaEntities(
  areaId: string,
  hass: HomeAssistant,
  config: Simon42StrategyConfig
): EntityRegistryEntry[] {
  if (!Registry.isCurrent(hass, config)) Registry.initialize(hass, config);
  return Registry.getVisibleEntitiesForArea(areaId);
}

export function getEditableAreaEntities(
  areaId: string,
  hass: HomeAssistant,
  config: Simon42StrategyConfig
): EntityRegistryEntry[] {
  if (!Registry.isCurrent(hass, config)) Registry.initialize(hass, config);
  return Registry.getEntitiesForArea(areaId).filter(
    (entity) =>
      !!hass.states[entity.entity_id] && !entity.labels?.includes('no_dboard') && !isEntityRegistryHidden(entity)
  );
}

export function findUpsEntityGroups(entities: EntityRegistryEntry[], hass: HomeAssistant): UpsEntityGroup[] {
  const entitiesByDevice = new Map<string, EntityRegistryEntry[]>();
  for (const entity of entities) {
    if (!entity.device_id) continue;
    const bucket = entitiesByDevice.get(entity.device_id);
    if (bucket) bucket.push(entity);
    else entitiesByDevice.set(entity.device_id, [entity]);
  }

  const groups: UpsEntityGroup[] = [];
  for (const [deviceId, deviceEntities] of entitiesByDevice) {
    let batteryId: string | undefined;
    let hasUpsSignal = false;
    let isNut = false;

    for (const entity of deviceEntities) {
      if (entity.platform === 'nut') isNut = true;

      const state = hass.states[entity.entity_id];
      if (!state) continue;
      const deviceClass = state.attributes?.device_class as string | undefined;
      const unit = state.attributes?.unit_of_measurement as string | undefined;

      if (!batteryId && entity.entity_id.startsWith('sensor.') && deviceClass === 'battery' && unit === '%') {
        batteryId = entity.entity_id;
        continue;
      }

      if (deviceClass && UPS_DEVICE_CLASSES.has(deviceClass)) hasUpsSignal = true;
      else if (UPS_ID_PATTERN.test(entity.entity_id)) hasUpsSignal = true;
    }

    if (!batteryId || (!isNut && !hasUpsSignal)) continue;
    groups.push({
      deviceId,
      batteryId,
      entityIds: deviceEntities.map((entity) => entity.entity_id),
      sensorIds: deviceEntities
        .map((entity) => entity.entity_id)
        .filter((entityId) => entityId !== batteryId && !!hass.states[entityId]),
    });
  }

  return groups;
}

export function createRoomEntities(
  entities: EntityRegistryEntry[],
  hass: HomeAssistant,
  upsGroups: UpsEntityGroup[],
  options: RoomEntityOptions = {}
): RoomEntities {
  const result: RoomEntities = {
    lights: [],
    covers: [],
    covers_curtain: [],
    covers_window: [],
    scenes: [],
    climate: [],
    media_player: [],
    vacuum: [],
    fan: [],
    switches: [],
    locks: [],
    automations: [],
    scripts: [],
    cameras: [],
    ups: [],
    energy: [],
  };
  const usedByUps = new Set(upsGroups.flatMap(({ entityIds }) => entityIds));
  result.ups.push(...usedByUps);

  for (const entity of entities) {
    const entityId = entity.entity_id;
    if (usedByUps.has(entityId)) continue;

    const state = hass.states[entityId];
    if (!state) continue;
    const domain = entityId.split('.')[0];
    const deviceClass = state.attributes?.device_class as string | undefined;

    if (domain === 'light') result.lights.push(entityId);
    else if (domain === 'cover') {
      if (deviceClass === 'curtain') result.covers_curtain.push(entityId);
      else if (['window', 'door', 'gate', 'garage'].includes(deviceClass || '')) {
        result.covers_window.push(entityId);
      } else result.covers.push(entityId);
    } else if (domain === 'scene') result.scenes.push(entityId);
    else if (domain === 'climate') result.climate.push(entityId);
    else if (domain === 'media_player') result.media_player.push(entityId);
    else if (domain === 'vacuum') result.vacuum.push(entityId);
    else if (domain === 'fan') result.fan.push(entityId);
    else if (domain === 'switch') result.switches.push(entityId);
    else if (domain === 'lock' && options.includeLocks !== false) result.locks.push(entityId);
    else if (domain === 'automation' && options.includeAutomations !== false) {
      result.automations.push(entityId);
    } else if (domain === 'script' && options.includeScripts !== false) result.scripts.push(entityId);
    else if (domain === 'camera' && options.includeCameras !== false) result.cameras.push(entityId);
    else if (domain === 'sensor' && deviceClass && ENERGY_DEVICE_CLASSES.has(deviceClass)) {
      result.energy.push(entityId);
    }
  }

  return result;
}

export function getAreaBadgeCandidates(entities: EntityRegistryEntry[], hass: HomeAssistant): string[] {
  const candidates: string[] = [];
  for (const entity of entities) {
    const state = hass.states[entity.entity_id];
    if (!state) continue;

    const domain = entity.entity_id.split('.')[0];
    const deviceClass = state.attributes?.device_class as string | undefined;
    const unit = state.attributes?.unit_of_measurement as string | undefined;
    if (!isBadgeCandidate(domain, deviceClass, unit, entity.entity_id)) continue;

    if (domain === 'sensor' && (deviceClass === 'battery' || entity.entity_id.includes('battery'))) {
      const value = parseFloat(state.state);
      if (!isNaN(value) && value < 20) candidates.push(entity.entity_id);
    } else {
      candidates.push(entity.entity_id);
    }
  }
  return candidates;
}

export function getAvailableBadgeEntities(
  entities: EntityRegistryEntry[],
  hass: HomeAssistant,
  excludedEntityIds: Iterable<string>
): Array<{ entity_id: string; name: string }> {
  const excluded = new Set(excludedEntityIds);
  const available = entities.flatMap((entity) => {
    const domain = entity.entity_id.split('.')[0];
    const state = hass.states[entity.entity_id];
    if (!state || (domain !== 'sensor' && domain !== 'binary_sensor') || excluded.has(entity.entity_id)) {
      return [];
    }
    return [
      {
        entity_id: entity.entity_id,
        name: (state.attributes?.friendly_name as string) || entity.entity_id.split('.')[1].replace(/_/g, ' '),
      },
    ];
  });
  return available.sort((a, b) => a.name.localeCompare(b.name));
}
