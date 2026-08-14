import { describe, expect, it } from 'vitest';
import {
  buildCoverControlBadges,
  coversSupportingFeature,
  COVER_SUPPORT_CLOSE,
  COVER_SUPPORT_OPEN,
  COVER_SUPPORT_STOP,
} from '../../src/utils/cover-controls';
import { makeHass } from '../fixtures/hass';

const ALL = COVER_SUPPORT_OPEN | COVER_SUPPORT_CLOSE | COVER_SUPPORT_STOP;

describe('cover batch controls', () => {
  const hass = makeHass({ entities: [
    { entity_id: 'cover.full', state: 'open', attributes: { supported_features: ALL } },
    { entity_id: 'cover.no_stop', state: 'closed', attributes: { supported_features: 3 } },
    { entity_id: 'cover.tilt_only', state: 'open', attributes: { supported_features: 16 | 32 | 64 } },
  ] });

  it('filters every service by supported_features', () => {
    const ids = ['cover.full', 'cover.no_stop', 'cover.tilt_only'];
    expect(coversSupportingFeature(ids, hass, COVER_SUPPORT_OPEN)).toEqual(['cover.full', 'cover.no_stop']);
    expect(coversSupportingFeature(ids, hass, COVER_SUPPORT_STOP)).toEqual(['cover.full']);
  });

  it('builds safe open/stop/close targets and omits unsupported actions', () => {
    const badges = buildCoverControlBadges(['cover.full', 'cover.no_stop', 'cover.tilt_only'], hass);
    expect(badges.map((badge) => badge.tap_action?.perform_action)).toEqual([
      'cover.open_cover', 'cover.stop_cover', 'cover.close_cover',
    ]);
    expect(badges[1].tap_action?.target).toEqual({ entity_id: ['cover.full'] });
    expect(buildCoverControlBadges(['cover.tilt_only'], hass)).toEqual([]);
  });
});
