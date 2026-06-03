// ====================================================================
// Availability helpers
// ====================================================================
// Adds live Lovelace visibility rules for entities that should disappear
// while Home Assistant reports them as unavailable/unknown.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceCondition, LovelaceViewConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';

const HIDDEN_AVAILABILITY_STATES = ['unavailable', 'unknown'] as const;

export function shouldHideUnavailableEntities(config?: Pick<Simon42StrategyConfig, 'hide_unavailable_entities'>): boolean {
  return config?.hide_unavailable_entities === true;
}

export function isUnavailableState(state: string | undefined): boolean {
  return state === 'unavailable' || state === 'unknown';
}

function availabilityVisibility(entity: string): LovelaceCondition[] {
  return HIDDEN_AVAILABILITY_STATES.map((state) => ({
    condition: 'state',
    entity,
    state_not: state,
  }));
}

function withAvailabilityVisibility<T extends Record<string, any>>(config: T): T {
  const entity = config.entity;
  if (typeof entity !== 'string' || entity.length === 0) return config;

  return {
    ...config,
    visibility: [
      ...((Array.isArray(config.visibility) ? config.visibility : []) as LovelaceCondition[]),
      ...availabilityVisibility(entity),
    ],
  };
}

function applyToCard(card: LovelaceCardConfig): LovelaceCardConfig {
  let next: LovelaceCardConfig = withAvailabilityVisibility(card);

  if (Array.isArray(next.cards)) {
    next = {
      ...next,
      cards: next.cards.map((child: LovelaceCardConfig) => applyToCard(child)),
    };
  }

  if (Array.isArray(next.badges)) {
    next = {
      ...next,
      badges: next.badges.map((badge: any) => {
        if (!badge || typeof badge !== 'object' || Array.isArray(badge)) return badge;
        return withAvailabilityVisibility(badge);
      }),
    };
  }

  return next;
}

export function withUnavailableEntitiesHidden(
  view: LovelaceViewConfig,
  config: Simon42StrategyConfig
): LovelaceViewConfig {
  if (!shouldHideUnavailableEntities(config)) return view;

  return {
    ...view,
    ...(Array.isArray(view.badges)
      ? {
          badges: view.badges.map((badge) => {
            if (!badge || typeof badge !== 'object') return badge;
            return withAvailabilityVisibility(badge);
          }),
        }
      : {}),
    ...(Array.isArray(view.sections)
      ? {
          sections: view.sections.map((section) => ({
            ...section,
            cards: Array.isArray(section.cards)
              ? section.cards.map((card) => applyToCard(card))
              : section.cards,
          })),
        }
      : {}),
    ...(Array.isArray(view.cards)
      ? {
          cards: view.cards.map((card) => applyToCard(card)),
        }
      : {}),
  };
}

export function isEntityCurrentlyAvailable(
  hass: HomeAssistant | undefined,
  entityId: string,
  config?: Pick<Simon42StrategyConfig, 'hide_unavailable_entities'>
): boolean {
  const state = hass?.states[entityId]?.state;
  return !shouldHideUnavailableEntities(config) || !isUnavailableState(state);
}
