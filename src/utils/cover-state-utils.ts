export type CoverGroupType = 'open' | 'closed' | 'partially_open';

import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { isEntityCurrentlyAvailable } from './availability-utils';

const KNOWN_COVER_STATES = new Set(['open', 'opening', 'closing', 'closed']);

export function isIndeterminateCoverState(state: string): boolean {
  return state !== 'unavailable' && !KNOWN_COVER_STATES.has(state);
}

export function countOpenCoverEntities(
  hass: HomeAssistant,
  entityIds: Set<string> | null,
  config: Simon42StrategyConfig
): number {
  let count = 0;
  if (!entityIds) return count;
  for (const id of entityIds) {
    if (!isEntityCurrentlyAvailable(hass, id, config)) continue;
    const state = hass.states[id]?.state;
    if (state === 'open' || state === 'opening' || (state && isIndeterminateCoverState(state))) count++;
  }
  return count;
}

export function isCoverRelevantForGroup(
  state: string,
  position: unknown,
  groupType: CoverGroupType,
  showPartiallyOpen: boolean
): boolean {
  const hasPosition = typeof position === 'number';
  const isMoving = state === 'opening' || state === 'closing';

  // Keep indeterminate states in the open bucket, including during a partial
  // position report, so room views and summaries agree.
  if (isIndeterminateCoverState(state)) return groupType === 'open';

  if (groupType === 'partially_open') {
    if (state !== 'open' && !isMoving) return false;
    if (!hasPosition) return false;
    const betweenEndpoints = position > 0 && position < 100;
    const openingAtClosedEndpoint = state === 'opening' && position === 0;
    const closingAtOpenEndpoint = state === 'closing' && position === 100;
    return betweenEndpoints || openingAtClosedEndpoint || closingAtOpenEndpoint;
  }

  if (groupType === 'open') {
    if (state !== 'open' && state !== 'opening' && !isIndeterminateCoverState(state)) return false;
    if (!showPartiallyOpen) return true;
    return !hasPosition || position >= 100;
  }

  if (state === 'closed') return true;
  if (state !== 'closing') return false;
  if (showPartiallyOpen && hasPosition && position > 0) return false;
  return true;
}
