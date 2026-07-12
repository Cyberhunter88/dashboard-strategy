import type { AreaOptions, Simon42StrategyConfig } from '../types/strategy';

type LegacyAreaOptions = AreaOptions & { webrtc_cameras?: unknown };

export function stripLegacyAreaWebrtcCameras(
  areasOptions: Record<string, LegacyAreaOptions> | undefined
): Record<string, AreaOptions> | undefined {
  if (!areasOptions) return undefined;

  const cleanedAreasOptions: Record<string, AreaOptions> = {};
  for (const [areaId, areaOptions] of Object.entries(areasOptions)) {
    const cleanAreaOptions = { ...areaOptions } as LegacyAreaOptions;
    delete cleanAreaOptions.webrtc_cameras;
    if (Object.keys(cleanAreaOptions).length > 0) cleanedAreasOptions[areaId] = cleanAreaOptions;
  }

  return Object.keys(cleanedAreasOptions).length > 0 ? cleanedAreasOptions : undefined;
}

export function stripLegacyOverviewLayoutConfig(config: Simon42StrategyConfig): Simon42StrategyConfig {
  const cleaned = { ...config };
  delete cleaned.overview_layout;
  delete cleaned.sections_order;
  return cleaned;
}
