import type { HomeAssistant, HassEntity } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import { Registry } from '../Registry';
import { localize } from '../utils/localize';

function getState(hass: HomeAssistant, entityId: string): HassEntity | undefined {
  return Reflect.get(hass.states as Record<string, unknown>, entityId) as HassEntity | undefined;
}

function findBatterySensorForPerson(hass: HomeAssistant, personEntityId: string): string | undefined {
  const state = getState(hass, personEntityId);
  const sources = state?.attributes?.source as string[] | string | undefined;
  const sourceList = Array.isArray(sources) ? sources : sources ? [sources] : [];
  if (sourceList.length === 0) return undefined;

  for (const src of sourceList) {
    if (typeof src !== 'string') continue;
    const trackerEntity = Registry.getEntity(src);
    if (!trackerEntity?.device_id) continue;

    for (const siblingId of Registry.getEntityIdsForDevice(trackerEntity.device_id)) {
      if (!siblingId.startsWith('sensor.')) continue;
      const sibling = getState(hass, siblingId);
      if (!sibling) continue;
      if (sibling.attributes?.device_class === 'battery' && sibling.attributes?.unit_of_measurement === '%') {
        return siblingId;
      }
    }
  }

  return undefined;
}

export function createPersonsSection(
  hass: HomeAssistant,
  enabled: boolean,
  hideHeading = false
): LovelaceSectionConfig | null {
  if (!enabled) return null;

  const personIds = Registry.getVisibleEntityIdsForDomain('person').filter((id) => getState(hass, id) !== undefined);
  if (personIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.persons'),
      icon: 'mdi:account-group',
    });
  }

  for (const entityId of personIds) {
    const battery = findBatterySensorForPerson(hass, entityId);
    cards.push({
      type: 'tile',
      entity: entityId,
      show_entity_picture: true,
      vertical: false,
      state_content: ['state', 'last_changed'],
    });
    if (battery) {
      cards.push({
        type: 'tile',
        entity: battery,
        vertical: false,
        state_content: ['state'],
        color: 'red',
      });
    }
  }

  return { type: 'grid', cards };
}
