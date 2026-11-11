// ====================================================================
// Media — every media player that is currently active
// ====================================================================
// The strategy only regenerates on registry changes, so "is playing" must
// not be decided here. Every visible player gets a card with a live
// Lovelace visibility condition; the section itself hides while idle.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceCondition, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export const ACTIVE_MEDIA_STATES = ['playing', 'paused', 'buffering'] as const;

function activeCondition(entityId: string): LovelaceCondition {
  return { condition: 'state', entity: entityId, state: [...ACTIVE_MEDIA_STATES] };
}

export function createMediaSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const playerIds = Registry.getVisibleEntityIdsForDomain('media_player').filter((id) => hass.states[id] !== undefined);
  if (playerIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.media'),
      icon: 'mdi:play-circle-outline',
    });
  }

  for (const entityId of playerIds) {
    cards.push({
      type: 'media-control',
      entity: entityId,
      visibility: [activeCondition(entityId)],
      grid_options: { columns: 'full' },
    });
  }

  return {
    type: 'grid',
    cards,
    visibility:
      playerIds.length === 1
        ? [activeCondition(playerIds[0])]
        : [{ condition: 'or', conditions: playerIds.map((id) => activeCondition(id)) }],
  };
}
