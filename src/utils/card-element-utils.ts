// ====================================================================
// Home Assistant child-card helpers
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';

export interface LovelaceCardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: Record<string, unknown>): void;
}

export function createHuiCardElement(tagName: string): LovelaceCardElement {
  return document.createElement(tagName) as LovelaceCardElement;
}

export function createHeadingCardElement(): LovelaceCardElement {
  return createHuiCardElement('hui-heading-card');
}

export function createTileCardElement(): LovelaceCardElement {
  return createHuiCardElement('hui-tile-card');
}

export function propagateHassToCards(
  hass: HomeAssistant,
  ...cardGroups: Array<LovelaceCardElement | null | undefined | Iterable<LovelaceCardElement>>
): void {
  for (const group of cardGroups) {
    if (!group) continue;
    if (Symbol.iterator in Object(group)) {
      for (const card of group as Iterable<LovelaceCardElement>) {
        card.hass = hass;
      }
      continue;
    }
    (group as LovelaceCardElement).hass = hass;
  }
}
