import { describe, expect, it } from 'vitest';

import { setAreaDisplayTypeOverride, setGlobalAreaDisplayType } from '../../src/editor/area-display-options';

describe('area display editor config', () => {
  it('stores picture globally and prunes the compact default', () => {
    const picture = setGlobalAreaDisplayType({ show_switches_on_areas: true }, 'picture');
    expect(picture).toEqual({ show_switches_on_areas: true, area_display_type: 'picture' });
    expect(setGlobalAreaDisplayType(picture, 'compact')).toEqual({ show_switches_on_areas: true });
  });

  it('sets and removes one area override without losing sibling options', () => {
    const configured = setAreaDisplayTypeOverride(
      { areas_options: { kitchen: { stacks_order: ['lights', 'misc'] } } },
      'living_room',
      'picture'
    );
    expect(configured.areas_options).toEqual({
      kitchen: { stacks_order: ['lights', 'misc'] },
      living_room: { display_type: 'picture' },
    });

    expect(setAreaDisplayTypeOverride(configured, 'living_room')).toEqual({
      areas_options: { kitchen: { stacks_order: ['lights', 'misc'] } },
    });
  });
});
