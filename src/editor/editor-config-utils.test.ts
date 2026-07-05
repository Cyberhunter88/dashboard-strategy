import { describe, expect, it } from 'vitest';

import { stripLegacyAreaWebrtcCameras } from './editor-config-utils';

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
