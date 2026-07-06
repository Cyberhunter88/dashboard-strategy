import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export function createPlantsSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const plantIds = Registry.getVisibleEntityIdsForDomain('plant').filter((id) => hass.states[id] !== undefined);
  if (plantIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.plants'),
      icon: 'mdi:flower-tulip',
    });
  }

  for (const entityId of plantIds) {
    cards.push({
      type: 'tile',
      entity: entityId,
      vertical: false,
      state_content: ['state'],
    });
  }

  return { type: 'grid', cards };
}
