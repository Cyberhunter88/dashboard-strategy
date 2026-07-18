// ====================================================================
// VIEW STRATEGY — ROOM (Room detail with sensor badges + cameras)
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type {
  LovelaceViewConfig,
  LovelaceCardConfig,
  LovelaceSectionConfig,
  LovelaceBadgeConfig,
} from '../types/lovelace';
import type { AreaRegistryEntry } from '../types/registries';
import type {
  RoomEntities,
  SensorEntities,
  AreaCustomCard,
  StackKey,
  CameraWebrtcStreamsConfig,
  CameraWebrtcStreamConfig,
} from '../types/strategy';
import { stripAreaName, sortLights, mergeStacksOrder } from '../utils/name-utils';
import { Registry } from '../Registry';
import { timeStart, timeEnd, debugLog } from '../utils/debug';
import { localize } from '../utils/localize';
import { BADGE_COLOR_MAP, getColorForEntity, isDefaultShowName, resolveShowName } from '../utils/badge-utils';
import { createHeadingCard, parsedConfigToCards } from '../utils/lovelace-utils';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import { createSectionsView } from '../utils/view-builder';
import {
  createRoomEntities,
  findUpsEntityGroups,
  getVisibleAreaEntities,
} from '../utils/area-entity-utils';

const ROOM_ENERGY_SENSOR_CLASSES = ['power', 'energy', 'water', 'gas'] as const;
const ROOM_ENERGY_SENSOR_CLASS_SET = new Set<string>(ROOM_ENERGY_SENSOR_CLASSES);

function upsSensorRole(entityId: string, hass: HomeAssistant): number {
  const deviceClass = hass.states[entityId]?.attributes?.device_class as string | undefined;
  if (deviceClass === 'duration' || /runtime|time_left|load_runtime/.test(entityId)) return 1;
  if (deviceClass === 'power' || deviceClass === 'apparent_power' || /(^|[._])load([._]|$)/.test(entityId)) return 2;
  if (deviceClass === 'voltage' || /voltage|input/.test(entityId)) return 3;
  if (/status|state/.test(entityId)) return 4;
  return 5;
}

interface UpsDeviceRender {
  name: string;
  batteryId: string;
  sensorIds: string[];
}

function buildWebrtcCameraCard(
  cameraId: string,
  name: string,
  streams: CameraWebrtcStreamsConfig | undefined
): LovelaceCardConfig {
  const mapping = streams?.[cameraId];
  const card: LovelaceCardConfig = {
    type: 'custom:webrtc-camera',
    title: name,
  };

  if (typeof mapping === 'string' && mapping.trim()) {
    return { ...card, url: mapping.trim() };
  }

  if (mapping && typeof mapping === 'object' && !Array.isArray(mapping)) {
    const streamConfig = mapping as CameraWebrtcStreamConfig;
    const { url, entity, ...options } = streamConfig;
    return {
      ...card,
      ...options,
      ...(url ? { url } : {}),
      ...(!url && entity ? { entity } : {}),
      ...(!url && !entity ? { entity: cameraId } : {}),
    };
  }

  return { ...card, entity: cameraId };
}

function buildNativeCameraCard(
  cameraId: string,
  name: string,
  liveToggle: boolean,
  entities?: Array<string | Record<string, unknown>>,
  isAqara: boolean = false
): LovelaceCardConfig {
  if (!liveToggle) {
    if (entities) {
      return {
        type: 'picture-glance',
        camera_image: cameraId,
        camera_view: isAqara ? 'live' : 'auto',
        fit_mode: 'cover',
        title: name,
        entities,
      };
    }
    return {
      type: 'picture-entity',
      entity: cameraId,
      camera_image: cameraId,
      camera_view: 'auto',
      name,
      show_name: true,
      show_state: false,
    };
  }
  return {
    type: 'custom:dashboard-strategy-camera-card',
    entity: cameraId,
    name,
    ...(entities?.length ? { entities } : {}),
    fit_mode: 'cover',
    aspect_ratio: '16:9',
  };
}

/**
 * Baut aus den AreaCustomCard-Einträgen einer Position (top/bottom) genau
 * eine grid-Sammel-Section. Gibt [] zurück, wenn keine gültige Karte vorliegt.
 * Defensiv: ungültige/leere Einträge werden übersprungen (kein Crash).
 */
function buildAreaCustomCardSection(
  cards: AreaCustomCard[],
  hass: HomeAssistant,
  position: 'top' | 'bottom'
): LovelaceSectionConfig[] {
  const sections: LovelaceSectionConfig[] = [];
  const built: LovelaceCardConfig[] = [];

  function flushCards(): void {
    if (built.length === 0) return;
    sections.push({ type: 'grid', cards: built.splice(0) });
  }

  for (const card of cards) {
    if ((card.position || 'bottom') !== position) continue;

    const mode = card.mode || 'yaml';
    if (mode === 'section') {
      if (!card.parsed_config || card._yaml_error) continue;
      const parsedSections = Array.isArray(card.parsed_config) ? card.parsed_config : [card.parsed_config];
      const validSections = parsedSections.filter((section) =>
        section && typeof section === 'object' && Array.isArray((section as LovelaceSectionConfig).cards)
      ) as LovelaceSectionConfig[];

      if (validSections.length === 0) continue;
      flushCards();

      validSections.forEach((section, index) => {
        const sectionConfig: LovelaceSectionConfig = { ...section };
        if (card.title && index === 0) {
          sectionConfig.cards = [
            createHeadingCard(card.title),
            ...((sectionConfig.cards || []) as LovelaceCardConfig[]),
          ];
        }
        sections.push(sectionConfig);
      });
      continue;
    }

    if (mode === 'tile') {
      if (card.entity) {
        if (card.title) {
          built.push(createHeadingCard(card.title));
        }
        built.push(buildAdaptiveTileCardConfig(hass, card.entity));
      }
    } else {
      // YAML-Modus: nur fehlerfreie, geparste Configs verwenden
      if (card.parsed_config && !card._yaml_error && typeof card.parsed_config === 'object') {
        if (card.title) {
          built.push(createHeadingCard(card.title));
        }
        built.push(...parsedConfigToCards(card.parsed_config));
      }
    }
  }

  flushCards();
  return sections;
}

class Simon42ViewRoomStrategy extends HTMLElement {
  static async generate(config: any, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const area: AreaRegistryEntry = config.area;
    debugLog(`room-generate-${area.area_id}: called at ${performance.now().toFixed(1)}ms after page load`);
    timeStart(`room-generate-${area.area_id}`);
    const dashboardConfig = config.dashboardConfig || {};

    const groupsOptions: Record<string, any> = config.groups_options || {};
    const customCards: AreaCustomCard[] = config.custom_cards || [];

    const sensorEntities: SensorEntities = {
      temperature: [],
      humidity: [],
      pm25: [],
      pm10: [],
      co2: [],
      voc: [],
      motion: [],
      occupancy: [],
      illuminance: [],
      absolute_humidity: [],
      battery: [],
      window: [],
      door: [],
      smoke: [],
      gas: [],
    };

    // Main categorization loop — use pre-filtered visible entities from Registry
    // (no hidden, no_dboard, config/diagnostic, config-hidden)
    const visibleEntities = getVisibleAreaEntities(area.area_id, hass, dashboardConfig);
    const showUps = dashboardConfig.show_ups_in_rooms !== false;
    const upsGroups = showUps ? findUpsEntityGroups(visibleEntities, hass) : [];
    const roomEntities: RoomEntities = createRoomEntities(visibleEntities, hass, upsGroups, {
      includeAutomations: !!dashboardConfig.show_automations_in_rooms,
      includeLocks: !!dashboardConfig.show_locks_in_rooms,
      includeScripts: !!dashboardConfig.show_scripts_in_rooms,
    });
    const usedByUps = new Set(upsGroups.flatMap(({ batteryId, sensorIds }) => [batteryId, ...sensorIds]));
    const upsDevices: UpsDeviceRender[] = [];

    for (const { deviceId, batteryId, sensorIds } of upsGroups) {
      const device = Registry.getDevice(deviceId);
      const name = device?.name_by_user ?? device?.name ?? 'UPS';
      upsDevices.push({ name, batteryId, sensorIds });
    }

    for (const entity of visibleEntities) {
      const entityId = entity.entity_id;
      if (usedByUps.has(entityId)) continue;

      // State check
      const state = hass.states[entityId];
      if (!state) continue;

      const domain = entityId.split('.')[0];
      const deviceClass = state.attributes?.device_class as string | undefined;
      const unit = state.attributes?.unit_of_measurement as string | undefined;

      // Sensors for badges
      if (domain === 'sensor') {
        if (deviceClass && ROOM_ENERGY_SENSOR_CLASS_SET.has(deviceClass)) {
          continue;
        }
        if (entityId.includes('battery') || deviceClass === 'battery') {
          const val = parseFloat(state.state);
          if (!isNaN(val) && val < 20) sensorEntities.battery.push(entityId);
          continue;
        }
        // Temperature and humidity badges are only shown when explicitly
        // assigned in HA area settings (area.temperature_entity_id / humidity_entity_id).
        // No auto-detection — avoids wrong sensors (e.g. heater temperature).
        if (deviceClass === 'temperature' || unit === '°C' || unit === '°F') continue;
        if (deviceClass === 'humidity' || unit === '%') continue;
        if (unit === 'g/m³') {
          sensorEntities.absolute_humidity.push(entityId);
          continue;
        }
        if (deviceClass === 'pm25' || entityId.includes('pm_2_5') || entityId.includes('pm25')) {
          sensorEntities.pm25.push(entityId);
          continue;
        }
        if (deviceClass === 'pm10' || entityId.includes('pm_10') || entityId.includes('pm10')) {
          sensorEntities.pm10.push(entityId);
          continue;
        }
        if (deviceClass === 'carbon_dioxide' || entityId.includes('co2')) {
          sensorEntities.co2.push(entityId);
          continue;
        }
        if (deviceClass === 'volatile_organic_compounds' || entityId.includes('voc')) {
          sensorEntities.voc.push(entityId);
          continue;
        }
        if (deviceClass === 'illuminance' || unit === 'lx') {
          sensorEntities.illuminance.push(entityId);
          continue;
        }
      }
      if (domain === 'binary_sensor') {
        if (deviceClass === 'motion') {
          sensorEntities.motion.push(entityId);
          continue;
        }
        if (deviceClass === 'occupancy' || deviceClass === 'presence') {
          sensorEntities.occupancy.push(entityId);
          continue;
        }
        if (deviceClass === 'window') {
          sensorEntities.window.push(entityId);
          continue;
        }
        if (deviceClass === 'door') {
          sensorEntities.door.push(entityId);
          continue;
        }
        if (deviceClass === 'smoke') {
          sensorEntities.smoke.push(entityId);
          continue;
        }
        if (deviceClass === 'gas') {
          sensorEntities.gas.push(entityId);
          continue;
        }
      }
    }

    // Apply groups_options filters
    const applyGroupFilter = (groupKey: keyof RoomEntities): string[] => {
      const groupOpts = groupsOptions[groupKey];
      if (!groupOpts) return roomEntities[groupKey];
      let filtered = roomEntities[groupKey];
      if (groupOpts.hidden?.length > 0) {
        const hiddenSet = new Set<string>(groupOpts.hidden);
        filtered = filtered.filter((e: string) => !hiddenSet.has(e));
      }
      if (groupOpts.order?.length > 0) {
        const orderMap = new Map<string, number>(groupOpts.order.map((id: string, i: number) => [id, i]));
        filtered.sort((a: string, b: string) => (orderMap.get(a) ?? 9999) - (orderMap.get(b) ?? 9999));
      }
      return filtered;
    };

    for (const key of Object.keys(roomEntities) as (keyof RoomEntities)[]) {
      roomEntities[key] = applyGroupFilter(key);
    }

    // === BADGES ===

    // Primary temp/humidity from area config (always shown, not filterable)
    let primaryTemp: string | null = null;
    let primaryHumidity: string | null = null;

    if (
      area.temperature_entity_id &&
      hass.states[area.temperature_entity_id] &&
      !Registry.isEntityExcluded(area.temperature_entity_id)
    ) {
      primaryTemp = area.temperature_entity_id;
    }
    if (
      area.humidity_entity_id &&
      hass.states[area.humidity_entity_id] &&
      !Registry.isEntityExcluded(area.humidity_entity_id)
    ) {
      primaryHumidity = area.humidity_entity_id;
    }

    // Build auto-detected badge candidates
    const badgeOpts = groupsOptions.badges;
    const hasBadgeConfig = !!badgeOpts;

    interface BadgeCandidate {
      entity: string;
      color: string;
      showName?: boolean;
    }

    const candidates: BadgeCandidate[] = [];

    // Auto-detected sensors (first match per type, except window/door which show all)
    // Colors from shared BADGE_COLOR_MAP, show_name from shared isDefaultShowName()
    const addCandidate = (entityId: string, colorKey: string, dcOverride?: string) => {
      const dc = dcOverride || (hass.states[entityId]?.attributes?.device_class as string | undefined);
      candidates.push({
        entity: entityId,
        color: BADGE_COLOR_MAP[colorKey] || 'grey',
        ...(isDefaultShowName(dc) ? { showName: true } : {}),
      });
    };

    // Single-match sensor types
    const singleTypes: Array<[string[], string]> = [
      [sensorEntities.pm25, 'pm25'],
      [sensorEntities.pm10, 'pm10'],
      [sensorEntities.co2, 'carbon_dioxide'],
      [sensorEntities.voc, 'volatile_organic_compounds'],
      [sensorEntities.illuminance, 'illuminance'],
      [sensorEntities.battery, 'battery'],
      [sensorEntities.motion, 'motion'],
      [sensorEntities.occupancy, 'occupancy'],
      [sensorEntities.absolute_humidity, 'moisture'],
      [sensorEntities.smoke, 'smoke'],
      [sensorEntities.gas, 'gas'],
    ];
    for (const [entities, colorKey] of singleTypes) {
      if (entities[0]) addCandidate(entities[0], colorKey);
    }

    if (dashboardConfig.show_window_contacts_in_rooms === true) {
      for (const id of sensorEntities.window) addCandidate(id, 'window', 'window');
    }
    if (dashboardConfig.show_door_contacts_in_rooms === true) {
      for (const id of sensorEntities.door) addCandidate(id, 'door', 'door');
    }

    // Apply per-area badge config: filter hidden, append additional
    let filteredCandidates = candidates;
    if (hasBadgeConfig) {
      if (badgeOpts.hidden?.length) {
        const hiddenSet = new Set<string>(badgeOpts.hidden);
        filteredCandidates = filteredCandidates.filter((b) => !hiddenSet.has(b.entity));
      }
      if (badgeOpts.additional?.length) {
        for (const entityId of badgeOpts.additional) {
          if (hass.states[entityId] && !filteredCandidates.some((b) => b.entity === entityId)) {
            filteredCandidates.push({ entity: entityId, color: getColorForEntity(entityId, hass) });
          }
        }
      }
    }

    // Resolve show_name per badge: default + config overrides
    const namesVisible = hasBadgeConfig ? new Set<string>(badgeOpts.names_visible || []) : null;
    const namesHidden = hasBadgeConfig ? new Set<string>(badgeOpts.names_hidden || []) : null;

    // Convert to LovelaceBadgeConfig
    const badges: LovelaceBadgeConfig[] = [];
    if (primaryTemp) badges.push({ type: 'entity', entity: primaryTemp, color: 'red', tap_action: { action: 'more-info' } });
    if (primaryHumidity) badges.push({ type: 'entity', entity: primaryHumidity, color: 'indigo', tap_action: { action: 'more-info' } });
    for (const b of filteredCandidates) {
      const showName = resolveShowName(b.entity, !!b.showName, namesVisible, namesHidden);
      badges.push({
        type: 'entity',
        entity: b.entity,
        color: b.color,
        tap_action: { action: 'more-info' },
        ...(showName ? { show_name: true } : {}),
      });
    }

    // === SECTIONS ===
    // Custom cards (position 'top') always come first, before all auto-stacks.
    const sections: LovelaceSectionConfig[] = [
      ...buildAreaCustomCardSection(customCards, hass, 'top'),
    ];

    // Per-area stack ordering: collect each auto-section under a StackKey,
    // then emit them in the user-configured order (areas_options.{areaId}.stacks_order).
    const areaOptions = dashboardConfig.areas_options?.[area.area_id];
    const stacksOrder = mergeStacksOrder(areaOptions?.stacks_order);
    const stacks = new Map<StackKey, LovelaceSectionConfig[]>();

    function pushStack(key: StackKey, section: LovelaceSectionConfig): void {
      const arr = stacks.get(key) ?? [];
      arr.push(section);
      stacks.set(key, arr);
    }

    if (upsDevices.length > 0) {
      const critThreshold = dashboardConfig.battery_critical_threshold ?? 20;
      const lowThreshold = dashboardConfig.battery_low_threshold ?? 50;
      const hiddenUpsEntities = new Set<string>(groupsOptions.ups?.hidden || []);

      for (const upsDevice of upsDevices) {
        if (hiddenUpsEntities.has(upsDevice.batteryId)) continue;

        const sortedSensors = [...upsDevice.sensorIds].sort(
          (a, b) => upsSensorRole(a, hass) - upsSensorRole(b, hass) || a.localeCompare(b)
        ).filter((entityId) => !hiddenUpsEntities.has(entityId));

        pushStack('ups', {
          type: 'grid',
          cards: [
            {
              type: 'heading',
              heading_style: 'title',
              icon: 'mdi:power-plug-battery',
              heading: upsDevice.name,
            },
            {
              type: 'gauge',
              entity: upsDevice.batteryId,
              name: localize('ups.battery'),
              min: 0,
              max: 100,
              needle: false,
              severity: { red: 0, yellow: critThreshold, green: lowThreshold },
            },
            ...sortedSensors.map((entityId) =>
              buildAdaptiveTileCardConfig(hass, entityId, {
                vertical: false,
              })
            ),
          ],
        });
      }
    }

    if (dashboardConfig.show_energy_in_rooms !== false && roomEntities.energy.length > 0) {
      const energyEntities = roomEntities.energy
        .map((entityId) => {
          const deviceClass = hass.states[entityId]?.attributes?.device_class as string | undefined;
          return {
            entityId,
            order: ROOM_ENERGY_SENSOR_CLASSES.indexOf(deviceClass as (typeof ROOM_ENERGY_SENSOR_CLASSES)[number]),
          };
        })
        .sort((a, b) => a.order - b.order || a.entityId.localeCompare(b.entityId))
        .map((entry) => entry.entityId);

      pushStack('energy', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('sections.energy'), heading_style: 'title', icon: 'mdi:lightning-bolt' },
          ...energyEntities.map((entityId) =>
            buildAdaptiveTileCardConfig(hass, entityId, {
              name: stripAreaName(entityId, area, hass),
              vertical: false,
              state_content: 'state',
              tap_action: { action: 'more-info' },
            })
          ),
        ],
      });
    }

    // Cameras
    if (roomEntities.cameras.length > 0) {
      const cameraCards: LovelaceCardConfig[] = [];
      const cameraRenderer = dashboardConfig.camera_renderer ?? 'native';
      const cameraWebrtcStreams = dashboardConfig.camera_webrtc_streams as CameraWebrtcStreamsConfig | undefined;
      const cameraLiveToggle = dashboardConfig.camera_live_toggle === true;
      for (const cameraId of roomEntities.cameras) {
        if (!hass.states[cameraId]) continue;
        const cameraName = stripAreaName(cameraId, area, hass);

        if (cameraRenderer === 'webrtc') {
          cameraCards.push(buildWebrtcCameraCard(cameraId, cameraName, cameraWebrtcStreams));
          continue;
        }

        const camEntity = Registry.getEntity(cameraId);
        const deviceId = camEntity?.device_id;

        let isReolink = false;
        let isAqara = false;
        if (deviceId) {
          const device = Registry.getDevice(deviceId);
          if (device) {
            const mfr = (device.manufacturer || '').toLowerCase();
            const model = (device.model || '').toLowerCase();
            isReolink = mfr.includes('reolink') || model.includes('reolink');
            isAqara = mfr.includes('aqara') || model.includes('aqara');
          }
        }

        if ((isReolink || isAqara) && deviceId) {
          const devEntities = Registry.getEntityIdsForDevice(deviceId);

          // Reolink-specific entities
          const spotlight = devEntities.find(
            (id) => id.startsWith('light.') && hass.states[id] && !Registry.isEntityExcluded(id)
          );
          const motion = devEntities.find(
            (id) =>
              id.startsWith('binary_sensor.') &&
              hass.states[id]?.attributes?.device_class === 'motion' &&
              !Registry.isEntityExcluded(id)
          );
          const siren = devEntities.find(
            (id) => id.startsWith('siren.') && hass.states[id] && !Registry.isEntityExcluded(id)
          );

          // Aqara-specific entities
          const battery = devEntities.find(
            (id) =>
              id.startsWith('sensor.') &&
              hass.states[id]?.attributes?.device_class === 'battery' &&
              !Registry.isEntityExcluded(id)
          );
          const doorbell = devEntities.find(
            (id) =>
              id.startsWith('event.') &&
              hass.states[id]?.attributes?.device_class === 'doorbell' &&
              !Registry.isEntityExcluded(id)
          );

          const glanceEntities: any[] = [];
          if (isReolink) {
            if (spotlight) glanceEntities.push({ entity: spotlight });
            if (motion) glanceEntities.push({ entity: motion });
            if (siren) glanceEntities.push({ entity: siren });
          }
          if (isAqara) {
            if (battery) glanceEntities.push({ entity: battery });
            if (doorbell) glanceEntities.push({ entity: doorbell });
          }

          cameraCards.push(buildNativeCameraCard(cameraId, cameraName, cameraLiveToggle, glanceEntities, isAqara));
        } else {
          cameraCards.push(buildNativeCameraCard(cameraId, cameraName, cameraLiveToggle));
        }
      }
      if (cameraCards.length > 0) {
        pushStack('cameras', {
          type: 'grid',
          cards: [{ type: 'heading', heading: localize('room.cameras'), heading_style: 'title', icon: 'mdi:cctv' }, ...cameraCards],
        });
      }
    }

    // Sort lights by last_changed (unless custom order)
    if (!groupsOptions.lights?.order) {
      roomEntities.lights.sort((a, b) =>
        sortLights(a, b, hass, dashboardConfig.lights_sort_by, (entityId) => stripAreaName(entityId, area, hass))
      );
    }

    // Helper: create a domain section
    const domainSection = (
      key: StackKey,
      entities: string[],
      heading: string,
      icon: string,
      tileConfig: (e: string) => LovelaceCardConfig
    ): void => {
      if (entities.length === 0) return;
      pushStack(key, {
        type: 'grid',
        cards: [{ type: 'heading', heading, heading_style: 'title', icon }, ...entities.map(tileConfig)],
      });
    };

    if (roomEntities.lights.length > 0) {
      pushStack('lights', {
        type: 'grid',
        cards: [
          {
            type: 'custom:dashboard-strategy-lights-group-card',
            entities: roomEntities.lights,
            config: dashboardConfig,
            group_type: 'all',
            heading_label: localize('room.lighting'),
            heading_icon: 'mdi:lightbulb',
            area,
            default_expanded: true,
            nested_groups: dashboardConfig.nested_light_groups === true,
          },
        ],
      });
    }

    domainSection('locks', roomEntities.locks, localize('room.locks'), 'mdi:lock', (e) =>
      buildAdaptiveTileCardConfig(hass, e, {
        name: stripAreaName(e, area, hass),
        vertical: false,
        state_content: 'last_changed',
      })
    );

    const climateCards: LovelaceCardConfig[] = [];
    for (const e of roomEntities.climate)
      climateCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: ['hvac_action', 'current_temperature'],
        })
      );
    for (const e of roomEntities.fan) {
      climateCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: 'last_changed',
        })
      );
    }
    if (climateCards.length > 0) {
      pushStack('climate', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.climate'), heading_style: 'title', icon: 'mdi:thermostat' },
          ...climateCards,
        ],
      });
    }

    domainSection('covers', [...roomEntities.covers, ...roomEntities.covers_curtain], localize('room.covers'), 'mdi:window-shutter', (e) =>
      buildAdaptiveTileCardConfig(hass, e, {
        name: stripAreaName(e, area, hass),
        vertical: false,
        state_content: ['current_position', 'last_changed'],
      })
    );

    domainSection('covers_window', roomEntities.covers_window, localize('room.windows'), 'mdi:window-open-variant', (e) =>
      buildAdaptiveTileCardConfig(hass, e, {
        name: stripAreaName(e, area, hass),
        vertical: false,
        state_content: ['current_position', 'last_changed'],
      })
    );

    domainSection('media', roomEntities.media_player, localize('room.media'), 'mdi:speaker', (e) =>
      buildAdaptiveTileCardConfig(hass, e, {
        name: stripAreaName(e, area, hass),
        vertical: false,
        state_content: ['media_title', 'media_artist'],
      })
    );

    const sceneAutomationCards: LovelaceCardConfig[] = [];
    for (const e of roomEntities.scenes)
      sceneAutomationCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: 'last_changed',
        })
      );
    for (const e of roomEntities.automations)
      sceneAutomationCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: 'last_changed',
        })
      );
    for (const e of roomEntities.scripts)
      sceneAutomationCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
        })
      );

    if (sceneAutomationCards.length > 0) {
      pushStack('scenes', {
        type: 'grid',
        cards: [
          {
            type: 'heading',
            heading: localize('room.scenes_automations'),
            heading_style: 'title',
            icon: 'mdi:script-text-play',
          },
          ...sceneAutomationCards,
        ],
      });
    }

    const vacuumCards: LovelaceCardConfig[] = [];
    for (const e of roomEntities.vacuum)
      vacuumCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: 'last_changed',
        })
      );
    const ownVacuumSection = dashboardConfig.show_vacuums_section_in_rooms === true;
    if (ownVacuumSection && vacuumCards.length > 0) {
      pushStack('misc', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.vacuums'), heading_style: 'title', icon: 'mdi:robot-vacuum' },
          ...vacuumCards,
        ],
      });
    }

    // Switches and outlets stay under Misc by default. The opt-in keeps
    // existing dashboards unchanged while allowing a dedicated room block.
    const switchCards: LovelaceCardConfig[] = [];
    for (const e of roomEntities.switches)
      switchCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: 'last_changed',
        })
      );

    const ownSwitchSection = dashboardConfig.show_switches_section_in_rooms === true;
    if (ownSwitchSection && switchCards.length > 0) {
      pushStack('switches', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.switches'), heading_style: 'title', icon: 'mdi:toggle-switch' },
          ...switchCards,
        ],
      });
    }

    const miscCards: LovelaceCardConfig[] = ownVacuumSection ? [] : [...vacuumCards];
    if (!ownSwitchSection) miscCards.push(...switchCards);
    for (const e of roomEntities.humidifier)
      miscCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          preferFeaturePosition: 'inline',
          state_content: ['action', 'current_humidity'],
        })
      );
    for (const e of roomEntities.valve)
      miscCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          preferFeaturePosition: 'inline',
          state_content: 'last_changed',
        })
      );
    for (const e of roomEntities.water_heater)
      miscCards.push(
        buildAdaptiveTileCardConfig(hass, e, {
          name: stripAreaName(e, area, hass),
          vertical: false,
          state_content: ['current_operation', 'current_temperature'],
        })
      );

    miscCards.sort((a, b) => {
      const sA = hass.states[a.entity];
      const sB = hass.states[b.entity];
      if (!sA || !sB) return 0;
      return new Date(sB.last_changed).getTime() - new Date(sA.last_changed).getTime();
    });

    if (miscCards.length > 0) {
      pushStack('misc', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.misc'), heading_style: 'title', icon: 'mdi:light-switch' },
          ...miscCards,
        ],
      });
    }

    // Room Pins
    const roomPinEntities: string[] = dashboardConfig.room_pin_entities || [];
    const pinsForArea = roomPinEntities.filter((entityId) => {
      const entity = Registry.getEntity(entityId);
      if (!entity) return false;
      if (entity.area_id === area.area_id) return true;
      if (entity.device_id) {
        const device = Registry.getDevice(entity.device_id);
        if (device?.area_id === area.area_id) return true;
      }
      return false;
    });

    if (pinsForArea.length > 0) {
      pushStack('room_pins', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.room_pins'), heading_style: 'title', icon: 'mdi:pin' },
          ...pinsForArea.map((e) => {
            const pinStateContent: string[] = [];
            if (dashboardConfig.room_pins_show_state === true) pinStateContent.push('state');
            if (dashboardConfig.room_pins_hide_last_changed !== true) pinStateContent.push('last_changed');
            return buildAdaptiveTileCardConfig(hass, e, {
              name: stripAreaName(e, area, hass),
              vertical: false,
              ...(pinStateContent.length > 0 ? { state_content: pinStateContent } : {}),
            });
          }),
        ],
      });
    }

    // Emit all collected auto-stacks in the per-area configured order.
    for (const key of stacksOrder) {
      const blocks = stacks.get(key);
      if (blocks) sections.push(...blocks);
    }

    sections.push(...buildAreaCustomCardSection(customCards, hass, 'bottom'));

    debugLog(
      `Room ${area.area_id}: ${visibleEntities.length} visible entities, ${sections.length} sections, ${badges.length} badges`
    );
    timeEnd(`room-generate-${area.area_id}`);
    return createSectionsView(sections, dashboardConfig, {
      header: { badges_position: 'bottom' },
      badges,
    });
  }
}

customElements.define('ll-strategy-dashboard-strategy-view-room', Simon42ViewRoomStrategy);
