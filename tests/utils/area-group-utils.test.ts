import { describe, expect, it } from 'vitest';
import { groupEntityIdsByAreas } from '../../src/utils/area-group-utils';
import { makeHass } from '../fixtures/hass';

describe('groupEntityIdsByAreas', () => {
  it('uses configured area order and appends an unassigned bucket', () => {
    const hass = makeHass({ areas: [
      { area_id: 'kitchen', name: 'Kitchen' },
      { area_id: 'living', name: 'Living room' },
    ] });
    const areaByEntity: Record<string, string | null> = { a: 'living', b: null, c: 'kitchen' };
    const groups = groupEntityIdsByAreas(
      hass,
      { areas_display: { order: ['living', 'kitchen'] } },
      ['a', 'b', 'c'],
      (id) => areaByEntity[id],
      'No area'
    );
    expect(groups).toEqual([
      { areaId: 'living', areaName: 'Living room', entityIds: ['a'] },
      { areaId: 'kitchen', areaName: 'Kitchen', entityIds: ['c'] },
      { areaId: null, areaName: 'No area', entityIds: ['b'] },
    ]);
  });
});
