import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceBadgeConfig } from '../types/lovelace';

export const COVER_SUPPORT_OPEN = 1;
export const COVER_SUPPORT_CLOSE = 2;
export const COVER_SUPPORT_STOP = 8;

export function coversSupportingFeature(entities: string[], hass: HomeAssistant, feature: number): string[] {
  return entities.filter((entityId) => {
    const supported = Number(hass.states[entityId]?.attributes?.supported_features ?? 0);
    return (supported & feature) !== 0;
  });
}

/** Native heading badges for safe room-level shading batch actions. */
export function buildCoverControlBadges(entities: string[], hass: HomeAssistant): LovelaceBadgeConfig[] {
  const actions = [
    { feature: COVER_SUPPORT_OPEN, icon: 'mdi:arrow-up', service: 'cover.open_cover' },
    { feature: COVER_SUPPORT_STOP, icon: 'mdi:stop', service: 'cover.stop_cover' },
    { feature: COVER_SUPPORT_CLOSE, icon: 'mdi:arrow-down', service: 'cover.close_cover' },
  ];
  return actions.flatMap(({ feature, icon, service }) => {
    const targets = coversSupportingFeature(entities, hass, feature);
    return targets.length === 0
      ? []
      : [{
          type: 'button',
          icon,
          tap_action: {
            action: 'perform-action',
            perform_action: service,
            target: { entity_id: targets },
          },
        } as LovelaceBadgeConfig];
  });
}
