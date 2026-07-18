import { describe, expect, it } from 'vitest';

import { resolveAreaDisplayType } from '../../src/sections/AreasSection';
import type { AreaRegistryEntry } from '../../src/types/registries';

function area(picture: string | null = null): AreaRegistryEntry {
  return { area_id: 'living_room', name: 'Living room', picture } as AreaRegistryEntry;
}

describe('area card display type', () => {
  it('keeps compact as the backwards-compatible default', () => {
    expect(resolveAreaDisplayType(area('/local/living.jpg'), {})).toBe('compact');
  });

  it('uses picture mode only when the area has a picture', () => {
    expect(resolveAreaDisplayType(area('/local/living.jpg'), { area_display_type: 'picture' })).toBe('picture');
    expect(resolveAreaDisplayType(area(), { area_display_type: 'picture' })).toBe('compact');
  });

  it('allows a per-area override in both directions', () => {
    expect(
      resolveAreaDisplayType(area('/local/living.jpg'), {
        areas_options: { living_room: { display_type: 'picture' } },
      })
    ).toBe('picture');
    expect(
      resolveAreaDisplayType(area('/local/living.jpg'), {
        area_display_type: 'picture',
        areas_options: { living_room: { display_type: 'compact' } },
      })
    ).toBe('compact');
  });
});
