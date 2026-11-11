// ====================================================================
// Quick actions — one-tap bar for scenes, scripts and buttons
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';
import { localize } from '../utils/localize';

/** Domains that run on tap instead of opening the more-info dialog. */
const TAP_ACTIONS: Readonly<Record<string, string>> = {
  scene: 'scene.turn_on',
  script: 'script.turn_on',
  button: 'button.press',
  input_button: 'input_button.press',
  automation: 'automation.trigger',
};

function quickActionTapAction(entityId: string): Record<string, unknown> {
  const action = TAP_ACTIONS[entityId.split('.')[0]];
  // Everything else (lights, switches, input_boolean, ...) simply toggles.
  if (!action) return { action: 'toggle' };
  return { action: 'perform-action', perform_action: action, target: { entity_id: entityId } };
}

export function createQuickActionsSection(
  hass: HomeAssistant,
  config: Pick<Simon42StrategyConfig, 'quick_action_entities'>,
  hideHeading = false
): LovelaceSectionConfig | null {
  const entityIds = [...new Set(config.quick_action_entities ?? [])].filter(
    (entityId) => hass.states[entityId] !== undefined
  );
  if (entityIds.length === 0) return null;

  const cards: LovelaceCardConfig[] = [];
  if (!hideHeading) {
    cards.push({
      type: 'heading',
      heading_style: 'title',
      heading: localize('sections.quick_actions'),
      icon: 'mdi:gesture-tap-button',
    });
  }

  for (const entityId of entityIds) {
    const tapAction = quickActionTapAction(entityId);
    cards.push({
      type: 'tile',
      entity: entityId,
      vertical: true,
      hide_state: true,
      tap_action: tapAction,
      icon_tap_action: tapAction,
      // Three compact buttons per row in the 12-column section grid.
      grid_options: { columns: 4 },
    });
  }

  return { type: 'grid', cards };
}
