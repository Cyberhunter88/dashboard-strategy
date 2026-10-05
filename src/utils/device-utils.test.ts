import { describe, expect, it } from 'vitest';
import type { DeviceRegistryEntry } from '../types/registries';
import { getEffectiveDeviceAreaId } from './device-utils';

function device(id: string, areaId: string | null, parentDeviceId?: string | null): DeviceRegistryEntry {
  return { id, area_id: areaId, parent_device_id: parentDeviceId } as DeviceRegistryEntry;
}

describe('getEffectiveDeviceAreaId', () => {
  it('uses the child device area when assigned', () => {
    expect(
      getEffectiveDeviceAreaId(device('child', 'child-room', 'parent'), () => device('parent', 'parent-room'))
    ).toBe('child-room');
  });

  it('inherits the parent device area when the child has none', () => {
    expect(getEffectiveDeviceAreaId(device('child', null, 'parent'), () => device('parent', 'parent-room'))).toBe(
      'parent-room'
    );
  });

  it('returns null when no device or parent area exists', () => {
    expect(getEffectiveDeviceAreaId(undefined, () => undefined)).toBeNull();
    expect(getEffectiveDeviceAreaId(device('child', null, 'missing'), () => undefined)).toBeNull();
  });
});
