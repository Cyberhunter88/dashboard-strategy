import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export function createMaintenanceSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const pending = Registry.getVisibleEntityIdsForDomain('update').filter((id) => hass.states[id]?.state === 'on');
  if (pending.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.maintenance'),
      icon: 'mdi:update',
    });
  }

  for (const entityId of pending) {
    cards.push({
      type: 'tile',
      entity: entityId,
      vertical: false,
      state_content: ['state', 'installed_version'],
      color: 'orange',
    });
  }

  return { type: 'grid', cards };
}
