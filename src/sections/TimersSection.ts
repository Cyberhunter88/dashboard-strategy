// ====================================================================
// Timers — every timer that is currently running or paused
// ====================================================================
// The strategy only regenerates on registry changes, so "is running" must
// not be decided here. Every visible timer gets a tile with a live
// Lovelace visibility condition; the section itself hides while idle.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceCondition, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export const ACTIVE_TIMER_STATES = ['active', 'paused'] as const;

function activeCondition(entityId: string): LovelaceCondition {
  return { condition: 'state', entity: entityId, state: [...ACTIVE_TIMER_STATES] };
}

export function createTimersSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const timerIds = Registry.getVisibleEntityIdsForDomain('timer').filter((id) => hass.states[id] !== undefined);
  if (timerIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.timers'),
      icon: 'mdi:timer-outline',
    });
  }

  for (const entityId of timerIds) {
    cards.push({
      type: 'tile',
      entity: entityId,
      vertical: false,
      visibility: [activeCondition(entityId)],
    });
  }

  return {
    type: 'grid',
    cards,
    visibility:
      timerIds.length === 1
        ? [activeCondition(timerIds[0])]
        : [{ condition: 'or', conditions: timerIds.map((id) => activeCondition(id)) }],
  };
}
