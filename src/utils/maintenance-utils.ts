import type { HomeAssistant } from '../types/homeassistant';
import { Registry } from '../Registry';

export interface MaintenanceEntities {
  updates: string[];
  unavailable: string[];
}

export function collectMaintenanceEntities(hass: HomeAssistant): MaintenanceEntities {
  const updates = Registry.getEntityIdsForDomain('update').filter((id) => {
    if (Registry.isExcludedByLabel(id) || Registry.isHiddenByConfig(id)) return false;
    return hass.states[id]?.state === 'on';
  });
  const unavailable = Object.keys(hass.states).filter((id) => {
    if (!Registry.getEntity(id) || Registry.isEntityExcluded(id)) return false;
    return hass.states[id]?.state === 'unavailable';
  });
  return { updates, unavailable };
}
