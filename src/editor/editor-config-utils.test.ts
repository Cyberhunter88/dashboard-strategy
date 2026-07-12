import { describe, expect, it } from 'vitest';

import { stripLegacyAreaWebrtcCameras, stripLegacyOverviewLayoutConfig } from './editor-config-utils';

describe('stripLegacyAreaWebrtcCameras', () => {
  it('removes legacy go2rtc entries and drops areas left empty', () => {
    const result = stripLegacyAreaWebrtcCameras({
      driveway: {
        webrtc_cameras: [{ id: 'legacy', url: 'driveway' }],
      },
      living_room: {
        webrtc_cameras: [{ id: 'legacy', url: 'living_room' }],
        stacks_order: ['cameras', 'lights'],
      },
    });

    expect(result).toEqual({
      living_room: {
        stacks_order: ['cameras', 'lights'],
      },
    });
  });
});

describe('stripLegacyOverviewLayoutConfig', () => {
  it('removes obsolete layout fields while preserving weather-start configuration', () => {
    expect(
      stripLegacyOverviewLayoutConfig({
        overview_layout: 'default',
        sections_order: ['areas', 'weather'],
        weather_start_order: ['clock', 'areas'],
        show_energy: false,
      })
    ).toEqual({
      weather_start_order: ['clock', 'areas'],
      show_energy: false,
    });
  });
});
