import { describe, expect, it } from 'vitest';

import type { HomeAssistant } from '../types/homeassistant';
import { buildAdaptiveTileCardConfig } from './tile-card-utils';

describe('buildAdaptiveTileCardConfig', () => {
  it('uses the native lawn mower commands feature for lawn mower entities', () => {
    const hass = {
      states: {
        'lawn_mower.garden': { attributes: {} },
      },
    } as unknown as HomeAssistant;

    const card = buildAdaptiveTileCardConfig(hass, 'lawn_mower.garden');

    expect(card.features).toEqual([{ type: 'lawn-mower-commands' }]);
    expect(card.features_position).toBe('inline');
  });
});
