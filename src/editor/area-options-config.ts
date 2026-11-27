// ====================================================================
// Area options config helpers (editor)
// ====================================================================
// Pure read and immutable update helpers for `areas_options` and
// `areas_display`. Every update returns a new config and prunes empty
// levels from the inside out (group → groups_options → area entry →
// areas_options / areas_display), so the stored config stays minimal.
// The editor host only assigns the result and fires config-changed.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { AreaCameraStream, AreaOptions, GroupOptions, Simon42StrategyConfig } from '../types/strategy';
import { isDefaultShowName } from '../utils/badge-utils';

type AreasDisplay = NonNullable<Simon42StrategyConfig['areas_display']>;

const isEmpty = (value: object): boolean => Object.keys(value).length === 0;

/** Add or remove one id; keeps the order and never duplicates. */
export function toggleListEntry(list: readonly string[] | undefined, id: string, include: boolean): string[] {
  const current = [...(list ?? [])];
  if (!include) return current.filter((entry) => entry !== id);
  return current.includes(id) ? current : [...current, id];
}

/** Set a list property, or delete it when the list is empty. */
function withList<T extends object>(target: T, key: keyof T & string, list: string[]): T {
  const next = { ...target } as Record<string, unknown>;
  if (list.length > 0) next[key] = list;
  else delete next[key];
  return next as T;
}

// -- areas_options ----------------------------------------------------

const streamUrl = (stream: AreaCameraStream): string =>
  (typeof stream === 'string' ? stream : typeof stream?.url === 'string' ? stream.url : '').trim();

/** Editor text for `camera_streams`: one `stream` or `stream | Name` per line. */
export function formatCameraStreamLines(streams: readonly AreaCameraStream[] | undefined): string {
  return (streams ?? [])
    .map((stream) => {
      const url = streamUrl(stream);
      const name = typeof stream === 'object' && typeof stream?.name === 'string' ? stream.name.trim() : '';
      return name && name !== url ? `${url} | ${name}` : url;
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Parse the editor text back into `camera_streams`. Options that only YAML can set (`hd_url`, `mode`, ...)
 * are kept for streams whose URL is still listed; plain entries stay plain strings.
 */
export function parseCameraStreamLines(
  text: string,
  existing: readonly AreaCameraStream[] | undefined
): AreaCameraStream[] {
  const previous = new Map((existing ?? []).map((stream) => [streamUrl(stream), stream] as const));
  const seen = new Set<string>();
  const result: AreaCameraStream[] = [];
  for (const line of text.split(/\r?\n/)) {
    const separator = line.indexOf('|');
    const url = (separator >= 0 ? line.slice(0, separator) : line).trim();
    const name = separator >= 0 ? line.slice(separator + 1).trim() : '';
    if (!url || seen.has(url)) continue;
    seen.add(url);

    const before = previous.get(url);
    const base = before && typeof before === 'object' ? { ...before } : { url };
    if (name) base.name = name;
    else delete base.name;
    result.push(Object.keys(base).length === 1 ? url : base);
  }
  return result;
}

/** Set an area's `camera_streams` from the editor text; an empty text removes the option. */
export function setAreaCameraStreams(
  config: Simon42StrategyConfig,
  areaId: string,
  text: string
): Simon42StrategyConfig {
  return updateAreaOptions(config, areaId, (options) => {
    const streams = parseCameraStreamLines(text, options.camera_streams);
    if (streams.length > 0) options.camera_streams = streams;
    else delete options.camera_streams;
    return options;
  });
}

/** Replace one area's options; drops the area entry and areas_options when they become empty. */
export function updateAreaOptions(
  config: Simon42StrategyConfig,
  areaId: string,
  update: (options: AreaOptions) => AreaOptions
): Simon42StrategyConfig {
  const areaOptions = update({ ...(config.areas_options?.[areaId] ?? {}) });
  const areasOptions: Record<string, AreaOptions> = { ...config.areas_options, [areaId]: areaOptions };
  if (isEmpty(areaOptions)) delete areasOptions[areaId];

  const next: Simon42StrategyConfig = { ...config, areas_options: areasOptions };
  if (isEmpty(areasOptions)) delete next.areas_options;
  return next;
}

/** Replace one group's options inside an area; drops empty group and groups_options levels. */
export function updateGroupOptions(
  config: Simon42StrategyConfig,
  areaId: string,
  group: string,
  update: (options: GroupOptions) => GroupOptions
): Simon42StrategyConfig {
  return updateAreaOptions(config, areaId, (areaOptions) => {
    const groupOptions = update({ ...(areaOptions.groups_options?.[group] ?? {}) });
    const groupsOptions: Record<string, GroupOptions> = { ...areaOptions.groups_options, [group]: groupOptions };
    if (isEmpty(groupOptions)) delete groupsOptions[group];

    const next: AreaOptions = { ...areaOptions, groups_options: groupsOptions };
    if (isEmpty(groupsOptions)) delete next.groups_options;
    return next;
  });
}

/** Set the hidden entities of a room group. */
export function setGroupHiddenEntities(
  config: Simon42StrategyConfig,
  areaId: string,
  group: string,
  hidden: string[]
): Simon42StrategyConfig {
  return updateGroupOptions(config, areaId, group, (options) => withList(options, 'hidden', hidden));
}

/** Show or hide several entities of a room group at once. */
export function setGroupEntitiesVisible(
  config: Simon42StrategyConfig,
  areaId: string,
  group: string,
  entities: readonly string[],
  visible: boolean
): Simon42StrategyConfig {
  const current = config.areas_options?.[areaId]?.groups_options?.[group]?.hidden ?? [];
  const hidden = visible
    ? current.filter((entityId) => !entities.includes(entityId))
    : [...new Set([...current, ...entities])];
  return setGroupHiddenEntities(config, areaId, group, hidden);
}

/** Show or hide one entity of a room group. */
export function setGroupEntityVisible(
  config: Simon42StrategyConfig,
  areaId: string,
  group: string,
  entityId: string,
  visible: boolean
): Simon42StrategyConfig {
  const current = config.areas_options?.[areaId]?.groups_options?.[group]?.hidden;
  return setGroupHiddenEntities(config, areaId, group, toggleListEntry(current, entityId, !visible));
}

/** Add or remove an explicitly added room badge. */
export function setBadgeAdditional(
  config: Simon42StrategyConfig,
  areaId: string,
  entityId: string,
  add: boolean
): Simon42StrategyConfig {
  return updateGroupOptions(config, areaId, 'badges', (options) =>
    withList(options, 'additional', toggleListEntry(options.additional, entityId, add))
  );
}

/**
 * Set whether a room badge shows its name. A value equal to the default
 * removes the override; otherwise the entity moves to names_visible or
 * names_hidden.
 */
export function setBadgeShowName(
  config: Simon42StrategyConfig,
  areaId: string,
  entityId: string,
  showName: boolean,
  defaultShowName: boolean
): Simon42StrategyConfig {
  return updateGroupOptions(config, areaId, 'badges', (options) => {
    const isOverride = showName !== defaultShowName;
    const visible = toggleListEntry(options.names_visible, entityId, isOverride && showName);
    const hidden = toggleListEntry(options.names_hidden, entityId, isOverride && !showName);
    return withList(withList(options, 'names_visible', visible), 'names_hidden', hidden);
  });
}

// -- areas_display ----------------------------------------------------

function updateAreasDisplay(
  config: Simon42StrategyConfig,
  update: (display: AreasDisplay) => AreasDisplay
): Simon42StrategyConfig {
  const display = update({ ...config.areas_display });
  const next: Simon42StrategyConfig = { ...config, areas_display: display };
  if (isEmpty(display)) delete next.areas_display;
  return next;
}

/** Hide an area from the overview or show it again. */
export function setAreaVisible(config: Simon42StrategyConfig, areaId: string, visible: boolean): Simon42StrategyConfig {
  return updateAreasDisplay(config, (display) =>
    withList(display, 'hidden', toggleListEntry(display.hidden, areaId, !visible))
  );
}

/** Pin an area to the navigation or unpin it. */
export function setAreaNavPinned(
  config: Simon42StrategyConfig,
  areaId: string,
  pinned: boolean
): Simon42StrategyConfig {
  return updateAreasDisplay(config, (display) =>
    withList(display, 'nav_items', toggleListEntry(display.nav_items, areaId, pinned))
  );
}

/** Store the area order (kept even when empty, matching the previous behavior). */
export function setAreaOrder(config: Simon42StrategyConfig, order: string[]): Simon42StrategyConfig {
  return { ...config, areas_display: { ...config.areas_display, order } };
}

// -- Reads ------------------------------------------------------------

export function getAdditionalBadgesForArea(areaId: string, config: Simon42StrategyConfig): string[] {
  return config.areas_options?.[areaId]?.groups_options?.badges?.additional || [];
}

export function getDefaultShowNameEntities(badgeCandidates: string[], hass: HomeAssistant): Set<string> {
  const result = new Set<string>();
  for (const entityId of badgeCandidates) {
    const stateObj = hass.states[entityId];
    if (!stateObj) continue;
    if (isDefaultShowName(stateObj.attributes?.device_class as string | undefined)) result.add(entityId);
  }
  return result;
}

export function getBadgeNamesConfig(
  areaId: string,
  config: Simon42StrategyConfig
): { namesVisible: string[]; namesHidden: string[] } {
  const options = config.areas_options?.[areaId]?.groups_options?.badges;
  return { namesVisible: options?.names_visible || [], namesHidden: options?.names_hidden || [] };
}

function collectGroupLists(
  areaId: string,
  config: Simon42StrategyConfig,
  key: 'hidden' | 'order'
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [group, options] of Object.entries(config.areas_options?.[areaId]?.groups_options ?? {})) {
    const list = options[key];
    if (list) result[group] = list;
  }
  return result;
}

export function getHiddenEntitiesForArea(areaId: string, config: Simon42StrategyConfig): Record<string, string[]> {
  return collectGroupLists(areaId, config, 'hidden');
}

export function getEntityOrdersForArea(areaId: string, config: Simon42StrategyConfig): Record<string, string[]> {
  return collectGroupLists(areaId, config, 'order');
}
