import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { getVisibleAreasFromHass } from './name-utils';

export interface EntityAreaGroup {
  areaId: string | null;
  areaName: string;
  entityIds: string[];
}

/** Group entity IDs in dashboard area order and append unassigned entities. */
export function groupEntityIdsByAreas(
  hass: HomeAssistant,
  config: Simon42StrategyConfig,
  entityIds: string[],
  resolveAreaId: (entityId: string) => string | null,
  noAreaName: string
): EntityAreaGroup[] {
  const byArea = new Map<string, string[]>();
  const noArea: string[] = [];
  for (const entityId of entityIds) {
    const areaId = resolveAreaId(entityId);
    if (areaId) byArea.set(areaId, [...(byArea.get(areaId) || []), entityId]);
    else noArea.push(entityId);
  }
  const groups: EntityAreaGroup[] = getVisibleAreasFromHass(
    hass,
    config.areas_display,
    config.use_default_area_sort
  ).flatMap((area) => {
    const ids = byArea.get(area.area_id) || [];
    return ids.length ? [{ areaId: area.area_id, areaName: area.name, entityIds: ids }] : [];
  });
  if (noArea.length) groups.push({ areaId: null, areaName: noAreaName, entityIds: noArea });
  return groups;
}
