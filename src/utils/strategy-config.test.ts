import { describe, expect, it } from 'vitest';

import { normalizeStrategyConfig } from './strategy-config';

describe('normalizeStrategyConfig', () => {
  it('maps upstream view options to the fork option names', () => {
    expect(
      normalizeStrategyConfig({
        show_camera_view: true,
        show_maintenance_summary: true,
      })
    ).toEqual({
      show_cctv_view: true,
      show_maintenance_view: true,
    });
  });

  it('keeps explicit fork values authoritative', () => {
    expect(
      normalizeStrategyConfig({
        show_cctv_view: false,
        show_camera_view: true,
        show_maintenance_view: false,
        show_maintenance_summary: true,
      })
    ).toEqual({
      show_cctv_view: false,
      show_maintenance_view: false,
    });
  });

  it('does not change fork defaults when options are absent', () => {
    expect(normalizeStrategyConfig({})).toEqual({});
  });
});
