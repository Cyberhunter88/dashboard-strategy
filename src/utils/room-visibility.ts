import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';

export function isRoomViewVisible(config: Simon42StrategyConfig, hass: HomeAssistant, areaId: string): boolean {
  const rule = config.room_visibility?.[areaId];
  if (!rule?.entity || !rule.state) return true;
  return hass.states[rule.entity]?.state === rule.state;
}
