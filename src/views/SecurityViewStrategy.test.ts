import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Registry } from '../Registry';
import type { HomeAssistant } from '../types/homeassistant';
import type { EntityRegistryEntry } from '../types/registries';

let buildSecurityActivitySection: typeof import('./SecurityViewStrategy').buildSecurityActivitySection;

beforeAll(async () => {
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: () => undefined },
  });
  ({ buildSecurityActivitySection } = await import('./SecurityViewStrategy'));
});

beforeEach(() => Registry.resetForTesting());

function hass(withLogbook: boolean): HomeAssistant {
  const entities = {
    'binary_sensor.door': { entity_id: 'binary_sensor.door', labels: [], hidden: false },
    'binary_sensor.private': { entity_id: 'binary_sensor.private', labels: ['no_seclog'], hidden: false },
  } as unknown as Record<string, EntityRegistryEntry>;
  const instance = {
    states: {
      'binary_sensor.door': { entity_id: 'binary_sensor.door', state: 'on', attributes: {} },
      'binary_sensor.private': { entity_id: 'binary_sensor.private', state: 'on', attributes: {} },
    },
    entities, devices: {}, areas: {}, floors: {},
    config: { components: withLogbook ? ['logbook'] : [] }, locale: { language: 'en' },
  } as unknown as HomeAssistant;
  Registry.initialize(instance, {});
  return instance;
}

describe('security activity', () => {
  it('is opt-in and requires logbook', () => {
    expect(buildSecurityActivitySection(hass(true), ['binary_sensor.door'], {})).toBeNull();
    expect(buildSecurityActivitySection(hass(false), ['binary_sensor.door'], { show_security_activity: true })).toBeNull();
  });

  it('excludes entities labelled no_seclog', () => {
    const section = buildSecurityActivitySection(
      hass(true), ['binary_sensor.door', 'binary_sensor.private'], { show_security_activity: true }
    );
    const logbook = section?.cards?.find((card) => card.type === 'logbook');
    expect(logbook?.entities).toEqual(['binary_sensor.door']);
  });
});
