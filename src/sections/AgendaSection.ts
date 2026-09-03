import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { localize } from '../utils/localize';
import { getCalendarEntitiesWithUpcomingEvents } from '../utils/feature-availability';

export function createAgendaSection(
  hass: HomeAssistant,
  enabled: boolean,
  calendarEntities?: string[],
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const selected = getCalendarEntitiesWithUpcomingEvents(hass, calendarEntities);

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
