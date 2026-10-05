// ====================================================================
// Home Assistant child-card helpers
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import { trackOperation } from './debug';

export interface LovelaceCardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: Record<string, unknown>): void;
}

export function createHuiCardElement(tagName: string): LovelaceCardElement {
  trackOperation(`create-${tagName}`);
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

export function haveEntityStatesChanged(
  oldHass: HomeAssistant | undefined,
  hass: HomeAssistant,
  entityIds: Iterable<string>
): boolean {
  if (!oldHass) return true;
  if (oldHass.states === hass.states) return false;

  for (const entityId of entityIds) {
    if (oldHass.states[entityId] !== hass.states[entityId]) return true;
  }

  return false;
}

const cardConfigKeys = new WeakMap<LovelaceCardElement, string>();
export function setPooledCardConfig(card: LovelaceCardElement, config: Record<string, unknown>): void {
  const key = JSON.stringify(config);
  if (cardConfigKeys.get(card) === key) return;
  card.setConfig(config);
  cardConfigKeys.set(card, key);
  trackOperation('configure-native-card');
}

export function hasHassPresentationChanged(oldHass: HomeAssistant | undefined, hass: HomeAssistant): boolean {
  return !oldHass || oldHass.entities !== hass.entities || oldHass.devices !== hass.devices
    || oldHass.areas !== hass.areas || oldHass.floors !== hass.floors
    || oldHass.language !== hass.language || oldHass.locale !== hass.locale;
}

/** State metadata can change group membership even for an entity not yet rendered. */
export function haveEntityMembershipChanged(oldHass: HomeAssistant | undefined, hass: HomeAssistant, ids: Iterable<string>): boolean {
  if (!oldHass) return true;
  if (oldHass.states === hass.states) return false;
  for (const id of ids) {
    const before = oldHass.states[id];
    const after = hass.states[id];
    if (!!before !== !!after || before?.attributes.device_class !== after?.attributes.device_class
      || before?.attributes.unit_of_measurement !== after?.attributes.unit_of_measurement) return true;
  }
  return false;
}
