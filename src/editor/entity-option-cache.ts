import type { HomeAssistant } from '../types/homeassistant';

/** Ignore telemetry changes; picker labels and membership still invalidate. */
export function haveEntityOptionSourcesChanged(previous: HomeAssistant['states'], next: HomeAssistant['states']): boolean {
  if (previous === next) return false;
  const ids = Object.keys(next);
  if (ids.length !== Object.keys(previous).length) return true;
  return ids.some((id) => !previous[id] || previous[id].attributes.friendly_name !== next[id].attributes.friendly_name);
}
