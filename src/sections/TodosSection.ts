import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export function createTodosSection(
  hass: HomeAssistant,
  enabled: boolean,
  todoEntities?: string[],
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const visible = Registry.getVisibleEntityIdsForDomain('todo').filter((id) => hass.states[id] !== undefined);
  const selected =
    Array.isArray(todoEntities) && todoEntities.length > 0
      ? todoEntities.filter((id) => visible.includes(id))
      : visible;

  if (selected.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.todos'),
      icon: 'mdi:format-list-checks',
    });
  }

  for (const entityId of selected) {
    cards.push({
      type: 'todo-list',
      entity: entityId,
    });
  }

  return { type: 'grid', cards };
}
