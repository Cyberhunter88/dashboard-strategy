import type { Simon42StrategyConfig } from '../types/strategy';

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
export function normalizeStrategyConfig(
  config: UpstreamCompatibleStrategyConfig
): Simon42StrategyConfig {
  const normalized: UpstreamCompatibleStrategyConfig = { ...config };

  if (normalized.show_cctv_view === undefined && normalized.show_camera_view !== undefined) {
    normalized.show_cctv_view = normalized.show_camera_view;
  }
  if (
    normalized.show_maintenance_view === undefined &&
    normalized.show_maintenance_summary !== undefined
  ) {
    normalized.show_maintenance_view = normalized.show_maintenance_summary;
  }

  delete normalized.show_camera_view;
  delete normalized.show_maintenance_summary;
  return normalized;
}
