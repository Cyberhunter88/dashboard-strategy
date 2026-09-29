import type { DeviceRegistryEntry } from '../types/registries';

export type DeviceLookup = (deviceId: string) => DeviceRegistryEntry | undefined;

/** Resolves an HA child device to its assigned area, falling back to its parent. */
export function getEffectiveDeviceAreaId(device: DeviceRegistryEntry | undefined, lookup: DeviceLookup): string | null {
  if (!device) return null;
  if (device.area_id) return device.area_id;
  const parentId = device.parent_device_id;
  return parentId ? (lookup(parentId)?.area_id ?? null) : null;
}

export function deviceLookupFromRecord(devices: Record<string, DeviceRegistryEntry>): DeviceLookup {
  return (deviceId) => Reflect.get(devices, deviceId) as DeviceRegistryEntry | undefined;
}
