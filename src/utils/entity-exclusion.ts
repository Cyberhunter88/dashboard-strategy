// ====================================================================
// Registry-based exclusion reasons
// ====================================================================
// Pure helpers that explain why Home Assistant data alone already keeps an
// entity off the dashboard. They deliberately ignore the strategy's own
// "hidden" lists, so the editor can tell users which list entries are
// redundant. The runtime filter lives in Registry.ts.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import { getClimateGroupMembers } from './climate-group-utils';

export type RegistryExclusionReason = 'label' | 'disabled' | 'hidden' | 'category' | 'climate_member';

const EXCLUSION_LABELS: readonly string[] = ['no_dboard', 'no-dboard'];

/** Whether registry labels contain the dashboard exclusion label (`no_dboard`, upstream `no-dboard`). */
export function hasDashboardExclusionLabel(labels: readonly string[] | undefined): boolean {
  return !!labels?.some((label) => EXCLUSION_LABELS.includes(label));
}

interface LabeledEntityEntry {
  labels?: readonly string[];
  device_id?: string | null;
}

/**
 * Strict dashboard exclusion: the entity itself or its device carries the
 * `no_dboard` label. A labeled device hides every entity it provides.
 */
export function isEntityDashboardLabelExcluded(
  entry: LabeledEntityEntry | undefined,
  devices: Readonly<Record<string, { labels?: readonly string[] }>> | undefined
): boolean {
  if (!entry) return false;
  if (hasDashboardExclusionLabel(entry.labels)) return true;
  return !!entry.device_id && hasDashboardExclusionLabel(devices?.[entry.device_id]?.labels);
}

/** Whether Home Assistant labels this entity or its device with the dashboard exclusion label. */
export function isDashboardLabelExcluded(hass: HomeAssistant, entityId: string): boolean {
  return isEntityDashboardLabelExcluded(hass.entities[entityId], hass.devices);
}

/**
 * Returns the first registry rule that already excludes the entity, or
 * undefined when only the strategy configuration could hide it.
 *
 * `groupedClimateMembers` comes from {@link getGroupedClimateMembers}; pass it
 * only when the climate-member rule should be considered.
 */
export function getRegistryExclusionReason(
  hass: HomeAssistant,
  entityId: string,
  groupedClimateMembers?: ReadonlySet<string>
): RegistryExclusionReason | undefined {
  const entry = hass.entities[entityId];
  if (!entry) return undefined;
  if (isEntityDashboardLabelExcluded(entry, hass.devices)) return 'label';
  if (entry.disabled_by) return 'disabled';
  if (entry.hidden === true || entry.hidden_by != null) return 'hidden';
  if (entry.entity_category === 'config' || entry.entity_category === 'diagnostic') return 'category';
  if (groupedClimateMembers?.has(entityId)) return 'climate_member';
  return undefined;
}

/**
 * Physical thermostats that a still-visible wrapper (Better Thermostat,
 * climate group) controls. A wrapper that is excluded by the registry or by
 * `configExcluded` does not hide its members, matching the runtime Registry.
 */
export function getGroupedClimateMembers(
  hass: HomeAssistant,
  configExcluded: ReadonlySet<string> = new Set()
): Set<string> {
  const members = new Set<string>();
  for (const [entityId, entry] of Object.entries(hass.entities)) {
    if (!entityId.startsWith('climate.')) continue;
    if (configExcluded.has(entityId) || getRegistryExclusionReason(hass, entityId)) continue;
    for (const member of getClimateGroupMembers(entityId, entry.platform, hass.states[entityId]?.attributes)) {
      members.add(member);
    }
  }
  return members;
}
