import type { HomeAssistant } from '../types/homeassistant';

/** hass.config.version >= major.minor (e.g. 2026.11 for the native alert badge). */
export function haVersionAtLeast(
  hass: Pick<HomeAssistant, 'config'> | undefined,
  major: number,
  minor: number
): boolean {
  const raw = hass?.config?.version;
  if (typeof raw !== 'string') return false;
  const match = /^(\d+)\.(\d+)/.exec(raw);
  if (!match) return false;
  const maj = Number(match[1]);
  const min = Number(match[2]);
  return maj > major || (maj === major && min >= minor);
}
