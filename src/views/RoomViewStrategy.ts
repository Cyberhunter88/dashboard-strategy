// ====================================================================
// VIEW STRATEGY — ROOM (Room detail with sensor badges + cameras)
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceViewConfig, LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { AreaRegistryEntry } from '../types/registries';
import type {
  RoomEntities,
  SensorEntities,
  AreaCustomCard,
  StackKey,
  CameraWebrtcStreamsConfig,
  CameraWebrtcStreamConfig,
  GroupOptions,
  Simon42StrategyConfig,
} from '../types/strategy';
import { stripAreaName, sortLights, mergeStacksOrder } from '../utils/name-utils';
import { Registry } from '../Registry';
import { timeStart, timeEnd, debugLog } from '../utils/debug';
import { localize } from '../utils/localize';
import {
  BADGE_COLOR_MAP,
  ROOM_ENERGY_SENSOR_CLASSES,
  buildRoomBadges,
  classifyBadgeSensor,
  isCriticalBatteryBadge,
  resolveAreaPrimarySensor,
  type BadgeCandidate,
  isDefaultShowName,
  selectBadgeEntitiesOfType,
} from '../utils/badge-utils';
import { createHeadingCard, parsedConfigToCards } from '../utils/lovelace-utils';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import { createSectionsView } from '../utils/view-builder';
import { createRoomEntities, findUpsEntityGroups, getVisibleAreaEntities } from '../utils/area-entity-utils';
import { buildCoverControlBadges } from '../utils/cover-controls';

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

/**
 * Defaults for smooth live playback: prefer WebRTC with an MSE fallback (no slow HLS),
 * start muted (required for autoplay), and only stream while the card is at least half visible
 * and the tab is in the foreground. Per-camera options in `camera_webrtc_streams` override them.
 */
const WEBRTC_CARD_DEFAULTS = {
  mode: 'webrtc,mse',
  media: 'video',
  muted: true,
  intersection: 0.5,
  background: false,
} as const;

function omitKeys<T extends object>(source: T, keys: string[]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key)));
}

export function buildWebrtcCameraCard(
  cameraId: string,
  name: string,
  streams: CameraWebrtcStreamsConfig | undefined
): LovelaceCardConfig {
  const mapping = streams?.[cameraId];
  const card: LovelaceCardConfig = {
    type: 'custom:webrtc-camera',
    title: name,
    ...WEBRTC_CARD_DEFAULTS,
  };

  if (typeof mapping === 'string' && mapping.trim()) {
    return { ...card, url: mapping.trim() };
  }

  if (mapping && typeof mapping === 'object' && !Array.isArray(mapping)) {
    const streamConfig = mapping as CameraWebrtcStreamConfig;
    // `hd_url` belongs to the strategy (grid/HD split), not to the webrtc-camera card.
    const { url, entity } = streamConfig;
    const options = omitKeys(streamConfig, ['url', 'entity', 'hd_url']);
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

/**
 * Optional "HD" button below a grid stream: the grid keeps the light stream (`url`), a tap opens the
 * heavy one (`hd_url`, e.g. the 4K main stream) in a browser_mod popup, so only one 4K stream decodes
 * at a time. Needs the browser_mod integration; without it the button is omitted.
 */
export function buildWebrtcHdButton(
  cameraId: string,
  name: string,
  streams: CameraWebrtcStreamsConfig | undefined,
  hass: HomeAssistant
): LovelaceCardConfig | undefined {
  const mapping = streams?.[cameraId];
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return undefined;
  const hdUrl = (mapping as CameraWebrtcStreamConfig).hd_url;
  if (typeof hdUrl !== 'string' || !hdUrl.trim()) return undefined;
  if (!hass.services?.browser_mod?.popup) return undefined;

  const options = omitKeys(mapping as CameraWebrtcStreamConfig, ['url', 'entity', 'hd_url']);
  return {
    type: 'tile',
    entity: cameraId,
    name: `${name} HD`,
    icon: 'mdi:fullscreen',
    vertical: false,
    tap_action: {
      action: 'fire-dom-event',
      browser_mod: {
        service: 'browser_mod.popup',
        data: {
          title: name,
          size: 'wide',
          dismissable: true,
          content: {
            type: 'custom:webrtc-camera',
            title: name,
            ...WEBRTC_CARD_DEFAULTS,
            ...options,
            url: hdUrl.trim(),
          },
        },
      },
    },
  };
}

function buildNativeCameraCard(
  cameraId: string,
  name: string,
  liveToggle: boolean,
  entities?: Array<string | Record<string, unknown>>,
  isAqara: boolean = false,
  pauseWhenHidden: boolean = false
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
    camera_pause_when_hidden: pauseWhenHidden,
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
      const validSections = parsedSections.filter(
        (section) => section && typeof section === 'object' && Array.isArray((section as LovelaceSectionConfig).cards)
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

interface RoomViewStrategyConfig {
  area: AreaRegistryEntry;
  dashboardConfig?: Simon42StrategyConfig;
  groups_options?: Record<string, GroupOptions>;
  custom_cards?: AreaCustomCard[];
}

class Simon42ViewRoomStrategy extends HTMLElement {
  static async generate(config: RoomViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const area: AreaRegistryEntry = config.area;
    debugLog(`room-generate-${area.area_id}: called at ${performance.now().toFixed(1)}ms after page load`);
    timeStart(`room-generate-${area.area_id}`);
    const dashboardConfig: Simon42StrategyConfig = config.dashboardConfig || {};

    const groupsOptions: Record<string, GroupOptions> = config.groups_options || {};
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
      includeCameras: dashboardConfig.show_cameras_in_rooms !== false,
    });
    const usedByUps = new Set(upsGroups.flatMap(({ batteryId, sensorIds }) => [batteryId, ...sensorIds]));
    const upsDevices: UpsDeviceRender[] = [];

    for (const { deviceId, batteryId, sensorIds } of upsGroups) {
      const device = Registry.getDevice(deviceId);
      const name = device?.name_by_user ?? device?.name ?? 'UPS';
      upsDevices.push({ name, batteryId, sensorIds });
    }

    // Sort sensors into badge buckets with the classifier shared with the editor.
    // Temperature and humidity are never auto-detected (see area settings below).
    const criticalBattery = dashboardConfig.battery_critical_threshold;
    for (const entity of visibleEntities) {
      const entityId = entity.entity_id;
      if (usedByUps.has(entityId)) continue;

      const state = hass.states[entityId];
      if (!state) continue;

      const type = classifyBadgeSensor(
        entityId.split('.')[0],
        state.attributes?.device_class as string | undefined,
        state.attributes?.unit_of_measurement as string | undefined,
        entityId
      );
      if (!type) continue;
      if (type === 'battery' && !isCriticalBatteryBadge(state.state, criticalBattery)) continue;
      sensorEntities[type].push(entityId);
    }

    // Apply groups_options filters
    const applyGroupFilter = (groupKey: keyof RoomEntities): string[] => {
      const groupOpts = groupsOptions[groupKey];
      if (!groupOpts) return roomEntities[groupKey];
      let filtered = roomEntities[groupKey];
      const hidden = groupOpts.hidden ?? [];
      if (hidden.length > 0) {
        const hiddenSet = new Set<string>(hidden);
        filtered = filtered.filter((e: string) => !hiddenSet.has(e));
      }
      const order = groupOpts.order ?? [];
      if (order.length > 0) {
        const orderMap = new Map<string, number>(order.map((id: string, i: number) => [id, i]));
        filtered.sort((a: string, b: string) => (orderMap.get(a) ?? 9999) - (orderMap.get(b) ?? 9999));
      }
      return filtered;
    };

    for (const key of Object.keys(roomEntities) as (keyof RoomEntities)[]) {
      roomEntities[key] = applyGroupFilter(key);
    }

    // === BADGES ===

    // Primary temp/humidity from the HA area settings. no_dboard is strict;
    // when the assigned sensor cannot be shown, a visible room sensor of the
    // same kind replaces it. See resolveAreaPrimarySensor().
    const primaryTemp = resolveAreaPrimarySensor(area, 'temperature', hass, visibleEntities);
    const primaryHumidity = resolveAreaPrimarySensor(area, 'humidity', hass, visibleEntities);

    // Build auto-detected badge candidates
    const badgeOpts = groupsOptions.badges;

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

    // Single-match sensor types; motion and occupancy keep one badge per device
    // so rooms spanning several floors (e.g. a stairwell hallway) show every
    // physical sensor, while multi-entity devices such as cameras stay at one.
    const perDevice = (entityId: string) => Registry.getEntity(entityId)?.device_id;
    const singleTypes: Array<[string[], string, boolean?]> = [
      [sensorEntities.pm25, 'pm25'],
      [sensorEntities.pm10, 'pm10'],
      [sensorEntities.co2, 'carbon_dioxide'],
      [sensorEntities.voc, 'volatile_organic_compounds'],
      [sensorEntities.illuminance, 'illuminance'],
      [sensorEntities.battery, 'battery'],
      [sensorEntities.motion, 'motion', true],
      [sensorEntities.occupancy, 'occupancy', true],
      [sensorEntities.absolute_humidity, 'moisture'],
      [sensorEntities.smoke, 'smoke'],
      [sensorEntities.gas, 'gas'],
    ];
    const hiddenBadgeSet = new Set<string>(badgeOpts?.hidden || []);
    for (const [entities, colorKey, oncePerDevice] of singleTypes) {
      for (const entityId of selectBadgeEntitiesOfType(
        entities,
        hiddenBadgeSet,
        oncePerDevice ? perDevice : undefined
      )) {
        addCandidate(entityId, colorKey);
      }
    }

    if (dashboardConfig.show_window_contacts_in_rooms === true) {
      for (const id of sensorEntities.window) addCandidate(id, 'window', 'window');
    }
    if (dashboardConfig.show_door_contacts_in_rooms === true) {
      for (const id of sensorEntities.door) addCandidate(id, 'door', 'door');
    }

    const badges = buildRoomBadges(
      [
        { entity: primaryTemp, color: 'red' },
        { entity: primaryHumidity, color: 'indigo' },
      ],
      candidates,
      badgeOpts,
      hass
    );

    // === SECTIONS ===
    // Custom cards (position 'top') always come first, before all auto-stacks.
    const sections: LovelaceSectionConfig[] = [...buildAreaCustomCardSection(customCards, hass, 'top')];

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

        const sortedSensors = [...upsDevice.sensorIds]
          .sort((a, b) => upsSensorRole(a, hass) - upsSensorRole(b, hass) || a.localeCompare(b))
          .filter((entityId) => !hiddenUpsEntities.has(entityId));

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
      const devicesWithCompanions = new Set<string>();
      for (const cameraId of roomEntities.cameras) {
        if (!hass.states[cameraId]) continue;
        const cameraName = stripAreaName(cameraId, area, hass);

        if (cameraRenderer === 'webrtc') {
          cameraCards.push(buildWebrtcCameraCard(cameraId, cameraName, cameraWebrtcStreams));
          const hdButton = buildWebrtcHdButton(cameraId, cameraName, cameraWebrtcStreams, hass);
          if (hdButton) cameraCards.push(hdButton);
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
          const firstOfDevice = !devicesWithCompanions.has(deviceId);
          devicesWithCompanions.add(deviceId);
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

          const glanceEntities: Array<{ entity: string }> = [];
          if (isReolink) {
            if (spotlight) glanceEntities.push({ entity: spotlight });
            if (motion) glanceEntities.push({ entity: motion });
            if (siren) glanceEntities.push({ entity: siren });
          }
          if (isAqara) {
            if (battery) glanceEntities.push({ entity: battery });
            if (doorbell) glanceEntities.push({ entity: doorbell });
          }

          cameraCards.push(
            buildNativeCameraCard(
              cameraId,
              cameraName,
              cameraLiveToggle,
              firstOfDevice ? glanceEntities : [],
              isAqara,
              dashboardConfig.camera_pause_when_hidden === true
            )
          );
        } else {
          cameraCards.push(
            buildNativeCameraCard(
              cameraId,
              cameraName,
              cameraLiveToggle,
              undefined,
              false,
              dashboardConfig.camera_pause_when_hidden === true
            )
          );
        }
      }
      if (cameraCards.length > 0) {
        pushStack('cameras', {
          type: 'grid',
          cards: [
            { type: 'heading', heading: localize('room.cameras'), heading_style: 'title', icon: 'mdi:cctv' },
            ...cameraCards,
          ],
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

    const roomShadingCovers = [...roomEntities.covers, ...roomEntities.covers_curtain];
    if (roomShadingCovers.length > 0) {
      const heading: LovelaceCardConfig = {
        type: 'heading',
        heading: localize('room.covers'),
        heading_style: 'title',
        icon: 'mdi:window-shutter',
      };
      // Conservative fork default: opt-in, unlike upstream's opt-out default.
      if (dashboardConfig.show_cover_controls_in_rooms === true) {
        const controls = buildCoverControlBadges(roomShadingCovers, hass);
        if (controls.length > 0) heading.badges = controls;
      }
      pushStack('covers', {
        type: 'grid',
        cards: [
          heading,
          ...roomShadingCovers.map((e) =>
            buildAdaptiveTileCardConfig(hass, e, {
              name: stripAreaName(e, area, hass),
              vertical: false,
              state_content: ['current_position', 'last_changed'],
            })
          ),
        ],
      });
    }

    domainSection(
      'covers_window',
      roomEntities.covers_window,
      localize('room.windows'),
      'mdi:window-open-variant',
      (e) =>
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

    // Helpers and user-facing controls (input_*, timer, counter, select,
    // number, button, siren, remote) are opt-in so existing rooms stay unchanged.
    if (dashboardConfig.show_helpers_section_in_rooms === true && roomEntities.helpers.length > 0) {
      pushStack('helpers', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.helpers'), heading_style: 'title', icon: 'mdi:tune-variant' },
          ...roomEntities.helpers.map((e) =>
            buildAdaptiveTileCardConfig(hass, e, {
              name: stripAreaName(e, area, hass),
              vertical: false,
            })
          ),
        ],
      });
    }

    // Motion, presence, leak, smoke and similar binary sensors as tiles.
    // Badges are unaffected; doors and windows keep their own badge options.
    if (dashboardConfig.show_sensors_section_in_rooms === true && roomEntities.binary_sensors.length > 0) {
      const sensorIds = [...roomEntities.binary_sensors].sort(
        (a, b) =>
          new Date(hass.states[b]?.last_changed ?? 0).getTime() - new Date(hass.states[a]?.last_changed ?? 0).getTime()
      );
      pushStack('sensors', {
        type: 'grid',
        cards: [
          { type: 'heading', heading: localize('room.sensors'), heading_style: 'title', icon: 'mdi:motion-sensor' },
          ...sensorIds.map((e) =>
            buildAdaptiveTileCardConfig(hass, e, {
              name: stripAreaName(e, area, hass),
              vertical: false,
              state_content: ['state', 'last_changed'],
            })
          ),
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
      // Parent-aware device area, consistent with the Registry area index.
      return !!entity.device_id && Registry.getDeviceAreaId(entity.device_id) === area.area_id;
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
