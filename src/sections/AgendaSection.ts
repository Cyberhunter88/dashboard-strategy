import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

export function createAgendaSection(
  hass: HomeAssistant,
  enabled: boolean,
  calendarEntities?: string[],
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const visible = Registry.getVisibleEntityIdsForDomain('calendar').filter((id) => hass.states[id] !== undefined);
  const selected =
    Array.isArray(calendarEntities) && calendarEntities.length > 0
      ? calendarEntities.filter((id) => visible.includes(id))
      : visible;

  if (selected.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.agenda'),
      icon: 'mdi:calendar',
    });
  }

  cards.push({
    type: 'calendar',
    entities: selected,
    initial_view: 'listWeek',
  });

  return { type: 'grid', cards };
}
