import type { Simon42StrategyConfig } from '../types/strategy';
import { CONFIG_ALIASES } from './config-aliases';

export interface UpstreamCompatibleStrategyConfig extends Simon42StrategyConfig {
  /** Upstream compatibility alias for show_cctv_view. */
  show_camera_view?: boolean;
  /** Upstream compatibility alias for show_maintenance_view. */
  show_maintenance_summary?: boolean;
}

/**
 * Normalize supported upstream option names to the fork's public contract.
 * Explicit fork options always win, including an explicit false value.
 */
export function normalizeStrategyConfig(config: UpstreamCompatibleStrategyConfig): Simon42StrategyConfig {
  const normalized: UpstreamCompatibleStrategyConfig = { ...config };

  const values = normalized as Record<string, unknown>;
  for (const [key, aliases] of Object.entries(CONFIG_ALIASES)) {
    for (const alias of aliases) {
      if (values[key] === undefined && values[alias] !== undefined) values[key] = values[alias];
      delete values[alias];
    }
  }
  return normalized;
}
