import { beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';
import { buildBackupSection, buildMaintenanceView, buildTechnicalStatusSection } from './MaintenanceViewStrategy';

function createHass(): HomeAssistant {
  const states = {
    'sensor.backup_backup_manager_zustand': {
      entity_id: 'sensor.backup_backup_manager_zustand',
      state: 'idle',
      attributes: { friendly_name: 'Backup Manager Zustand' },
    },
    'sensor.backup_letztes_erfolgreiches_automatisches_backup': {
      entity_id: 'sensor.backup_letztes_erfolgreiches_automatisches_backup',
      state: '2026-09-03T01:00:00+00:00',
      attributes: { friendly_name: 'Letztes erfolgreiches Backup' },
    },
    'sensor.proxmox_disk_temperature': {
      entity_id: 'sensor.proxmox_disk_temperature',
      state: '37',
      attributes: { friendly_name: 'Proxmox Disk Temperatur', unit_of_measurement: '°C' },
    },
    'sensor.controlroom_memory_usage': {
      entity_id: 'sensor.controlroom_memory_usage',
      state: '41',
      attributes: { friendly_name: 'ControlRoom Speicher', unit_of_measurement: '%' },
    },
    'sensor.fritz_box_ip_address': {
      entity_id: 'sensor.fritz_box_ip_address',
      state: '192.0.2.1',
      attributes: { friendly_name: 'Fritz Box IP-Adresse' },
    },
    'sensor.public_ipv4': {
      entity_id: 'sensor.public_ipv4',
      state: '198.51.100.1',
      attributes: { friendly_name: 'Öffentliche IPv4-Adresse' },
    },
  };
  const entities = Object.fromEntries(
    Object.keys(states).map((entityId) => [
      entityId,
      { entity_id: entityId, labels: [], hidden: false } as EntityRegistryEntry,
    ])
  );
  return {
    states,
    entities,
    devices: {},
    areas: {},
    floors: {},
    config: { version: '2026.9.0' },
    locale: { language: 'de' },
  } as unknown as HomeAssistant;
}

beforeEach(() => Registry.resetForTesting());

describe('maintenance view technical discovery', () => {
  it('renders backup and safe technical sensors without sensitive network values', () => {
    const hass = createHass();
    Registry.initialize(hass, {});

    expect(buildBackupSection(hass)?.cards?.some((card) => card.entity?.includes('backup_'))).toBe(true);
    expect(buildBackupSection(hass)?.cards?.some((card) => card.entity?.includes('manager_zustand'))).toBe(false);
    expect(buildTechnicalStatusSection(hass)?.cards?.some((card) => card.entity?.includes('proxmox'))).toBe(true);
    expect(buildTechnicalStatusSection(hass)?.cards?.some((card) => card.entity?.includes('controlroom'))).toBe(true);
    expect(buildTechnicalStatusSection(hass)?.cards?.some((card) => card.entity?.includes('ip_address'))).toBe(false);
    expect(buildTechnicalStatusSection(hass)?.cards?.some((card) => card.entity?.includes('public_ipv4'))).toBe(false);
  });

  it('includes discovered technical sections in the generated view', () => {
    const hass = createHass();
    Registry.initialize(hass, {});

    const view = buildMaintenanceView(hass, {});
    expect(view.sections?.some((section) => section.cards?.some((card) => card.entity?.includes('backup_')))).toBe(true);
    expect(view.sections?.some((section) => section.cards?.some((card) => card.entity?.includes('proxmox')))).toBe(true);
  });
});
