import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export function createVacuumsSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const vacuumIds = Registry.getVisibleEntityIdsForDomain('vacuum').filter((id) => hass.states[id] !== undefined);
  const mowerIds = Registry.getVisibleEntityIdsForDomain('lawn_mower').filter((id) => hass.states[id] !== undefined);
  const entityIds = [...vacuumIds, ...mowerIds];
  if (entityIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.vacuums'),
      icon: 'mdi:robot-vacuum',
    });
  }

  for (const entityId of entityIds) {
    cards.push({
      type: 'tile',
      entity: entityId,
      vertical: false,
      state_content: ['state', 'last_changed'],
    });
  }

  return { type: 'grid', cards };
}
