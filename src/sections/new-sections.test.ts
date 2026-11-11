import { beforeEach, describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import { Registry } from '../Registry';
import { withEnabledOptionalBlocks } from '../utils/weather-start-defaults';
import { createActivitySection, MAX_ACTIVITY_ENTITIES } from './ActivitySection';
import { createMediaSection } from './MediaSection';
import { createSummaryCards } from './OverviewSection';
import { createQuickActionsSection } from './QuickActionsSection';

beforeEach(() => Registry.resetForTesting());

describe('quick actions', () => {
  it('runs scenes/scripts/buttons on tap, toggles everything else and skips missing entities', () => {
    const hass = makeHass({
      entities: [{ entity_id: 'scene.movie' }, { entity_id: 'light.lamp' }, { entity_id: 'button.bell' }],
    });
    const section = createQuickActionsSection(hass, {
      quick_action_entities: ['scene.movie', 'light.lamp', 'button.bell', 'scene.movie', 'script.gone'],
    });
    const tiles = section?.cards?.filter((card) => card.type === 'tile') ?? [];
    expect(tiles.map((card) => card.entity)).toEqual(['scene.movie', 'light.lamp', 'button.bell']);
    expect(tiles[0].tap_action).toEqual({
      action: 'perform-action',
      perform_action: 'scene.turn_on',
      target: { entity_id: 'scene.movie' },
    });
    expect(tiles[1].tap_action).toEqual({ action: 'toggle' });
    expect(tiles[2].tap_action.perform_action).toBe('button.press');
  });

  it('is absent without usable entities and honors hidden headings', () => {
    const hass = makeHass({ entities: [{ entity_id: 'scene.movie' }] });
    expect(createQuickActionsSection(hass, {})).toBeNull();
    expect(createQuickActionsSection(hass, { quick_action_entities: ['scene.gone'] })).toBeNull();
    const noHeading = createQuickActionsSection(hass, { quick_action_entities: ['scene.movie'] }, true);
    expect(noHeading?.cards?.some((card) => card.type === 'heading')).toBe(false);
  });
});

describe('media section', () => {
  it('stays opt-in and hides itself live while no player is active', () => {
    const hass = makeHass({ entities: [{ entity_id: 'media_player.tv' }, { entity_id: 'media_player.radio' }] });
    Registry.initialize(hass, {});
    expect(createMediaSection(hass, false)).toBeNull();
    const section = createMediaSection(hass, true);
    const players = section?.cards?.filter((card) => card.type === 'media-control') ?? [];
    expect(players).toHaveLength(2);
    expect(players[0].visibility?.[0]).toMatchObject({ condition: 'state', entity: 'media_player.tv' });
    expect(section?.visibility?.[0]).toMatchObject({ condition: 'or' });
  });

  it('uses a plain state condition for a single player', () => {
    const hass = makeHass({ entities: [{ entity_id: 'media_player.tv' }] });
    Registry.initialize(hass, {});
    expect(createMediaSection(hass, true)?.visibility?.[0]).toMatchObject({
      condition: 'state',
      entity: 'media_player.tv',
    });
  });
});

describe('activity section', () => {
  const sensor = (id: string, deviceClass: string, extra: Record<string, unknown> = {}) => ({
    entity_id: id,
    attributes: { device_class: deviceClass },
    ...extra,
  });

  it('needs the logbook integration and opt-in', () => {
    const entities = [sensor('binary_sensor.motion', 'motion')];
    const withoutLogbook = makeHass({ entities });
    Registry.initialize(withoutLogbook, {});
    expect(createActivitySection(withoutLogbook, true)).toBeNull();

    const hass = makeHass({ entities, components: ['logbook'] });
    Registry.resetForTesting();
    Registry.initialize(hass, {});
    expect(createActivitySection(hass, false)).toBeNull();
    expect(createActivitySection(hass, true)?.cards?.some((card) => card.type === 'logbook')).toBe(true);
  });

  it('only logs relevant device classes and respects the no_seclog label', () => {
    const hass = makeHass({
      components: ['logbook'],
      entities: [
        sensor('binary_sensor.motion', 'motion'),
        sensor('binary_sensor.smoke', 'smoke'),
        sensor('binary_sensor.private_door', 'door', { labels: ['no_seclog'] }),
        { entity_id: 'lock.front' },
      ],
    });
    Registry.initialize(hass, {});
    const logbook = createActivitySection(hass, true)?.cards?.find((card) => card.type === 'logbook');
    expect([...(logbook?.entities as string[])].sort()).toEqual(['binary_sensor.motion', 'lock.front']);
  });

  it('bounds the logbook subscription', () => {
    const entities = Array.from({ length: MAX_ACTIVITY_ENTITIES + 20 }, (_, index) =>
      sensor(`binary_sensor.door_${index}`, 'door')
    );
    const hass = makeHass({ components: ['logbook'], entities });
    Registry.initialize(hass, {});
    const logbook = createActivitySection(hass, true)?.cards?.find((card) => card.type === 'logbook');
    expect(logbook?.entities).toHaveLength(MAX_ACTIVITY_ENTITIES);
  });
});

describe('optional layout blocks', () => {
  it('appends enabled late blocks once and never re-adds placed ones', () => {
    const items = [{ id: 'clock', type: 'clock' as const }];
    expect(withEnabledOptionalBlocks(items, {})).toBe(items);
    const config = { quick_action_entities: ['scene.a'], show_media_section: true };
    const result = withEnabledOptionalBlocks(items, config);
    expect(result.map((item) => item.type)).toEqual(['clock', 'quick_actions', 'media']);
    expect(withEnabledOptionalBlocks(result, config)).toBe(result);
  });
});

describe('windows summary card', () => {
  it('is opt-in, informational without the security view and linked with it', () => {
    expect(createSummaryCards({}).some((card) => card.summary_type === 'windows')).toBe(false);
    const withView = createSummaryCards({ show_windows_summary: true }).find((card) => card.summary_type === 'windows');
    expect(withView?.navigation_path).toBe('security');
    const withoutView = createSummaryCards({ show_windows_summary: true, show_security_summary: false }).find(
      (card) => card.summary_type === 'windows'
    );
    expect(withoutView?.navigation_path).toBe('');
  });
});
