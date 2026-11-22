import { describe, expect, it } from 'vitest';
import {
  getEntityOrdersForArea,
  getHiddenEntitiesForArea,
  setAreaNavPinned,
  setAreaOrder,
  setAreaVisible,
  setBadgeAdditional,
  setBadgeShowName,
  setGroupEntitiesVisible,
  setGroupEntityVisible,
  toggleListEntry,
  updateAreaOptions,
} from './area-options-config';
import type { Simon42StrategyConfig } from '../types/strategy';

describe('area options config updates', () => {
  it('toggles list entries without duplicates', () => {
    expect(toggleListEntry(['a'], 'b', true)).toEqual(['a', 'b']);
    expect(toggleListEntry(['a', 'b'], 'b', true)).toEqual(['a', 'b']);
    expect(toggleListEntry(['a', 'b'], 'a', false)).toEqual(['b']);
    expect(toggleListEntry(undefined, 'a', false)).toEqual([]);
  });

  it('hides and shows group entities and prunes every empty level', () => {
    const base: Simon42StrategyConfig = { show_clock_card: false };
    const hidden = setGroupEntityVisible(base, 'kitchen', 'lights', 'light.a', false);
    expect(hidden.areas_options).toEqual({ kitchen: { groups_options: { lights: { hidden: ['light.a'] } } } });
    expect(base).toEqual({ show_clock_card: false });

    const shown = setGroupEntityVisible(hidden, 'kitchen', 'lights', 'light.a', true);
    expect(shown).toEqual({ show_clock_card: false });
    expect('areas_options' in shown).toBe(false);
  });

  it('keeps sibling options when pruning a group', () => {
    const config: Simon42StrategyConfig = {
      areas_options: {
        kitchen: { stacks_order: ['lights'], groups_options: { lights: { hidden: ['light.a'], order: ['light.b'] } } },
        hall: { stacks_order: ['covers'] },
      },
    };
    const next = setGroupEntityVisible(config, 'kitchen', 'lights', 'light.a', true);
    expect(next.areas_options).toEqual({
      kitchen: { stacks_order: ['lights'], groups_options: { lights: { order: ['light.b'] } } },
      hall: { stacks_order: ['covers'] },
    });
    expect(next.areas_options?.hall).toBe(config.areas_options?.hall);
  });

  it('sets several group entities at once', () => {
    const hidden = setGroupEntitiesVisible({}, 'kitchen', 'badges', ['sensor.a', 'sensor.b'], false);
    expect(getHiddenEntitiesForArea('kitchen', hidden)).toEqual({ badges: ['sensor.a', 'sensor.b'] });
    const again = setGroupEntitiesVisible(hidden, 'kitchen', 'badges', ['sensor.b', 'sensor.c'], false);
    expect(getHiddenEntitiesForArea('kitchen', again)).toEqual({ badges: ['sensor.a', 'sensor.b', 'sensor.c'] });
    expect(setGroupEntitiesVisible(again, 'kitchen', 'badges', ['sensor.a', 'sensor.b', 'sensor.c'], true)).toEqual({});
  });

  it('adds and removes extra badges', () => {
    const added = setBadgeAdditional({}, 'kitchen', 'sensor.x', true);
    expect(added.areas_options?.kitchen.groups_options?.badges).toEqual({ additional: ['sensor.x'] });
    expect(setBadgeAdditional(added, 'kitchen', 'sensor.x', true)).toEqual(added);
    expect(setBadgeAdditional(added, 'kitchen', 'sensor.x', false)).toEqual({});
  });

  it('stores badge name overrides only when they differ from the default', () => {
    const shown = setBadgeShowName({}, 'kitchen', 'binary_sensor.motion', true, false);
    expect(shown.areas_options?.kitchen.groups_options?.badges).toEqual({ names_visible: ['binary_sensor.motion'] });
    const hiddenName = setBadgeShowName(shown, 'kitchen', 'binary_sensor.motion', false, false);
    expect(hiddenName).toEqual({});
    const windowHidden = setBadgeShowName({}, 'kitchen', 'binary_sensor.window', false, true);
    expect(windowHidden.areas_options?.kitchen.groups_options?.badges).toEqual({
      names_hidden: ['binary_sensor.window'],
    });
    expect(setBadgeShowName(windowHidden, 'kitchen', 'binary_sensor.window', true, true)).toEqual({});
  });

  it('updates area display lists and prunes areas_display', () => {
    const hidden = setAreaVisible({}, 'garage', false);
    expect(hidden.areas_display).toEqual({ hidden: ['garage'] });
    expect(setAreaVisible(hidden, 'garage', true)).toEqual({});
    const pinned = setAreaNavPinned({ areas_display: { order: ['a'] } }, 'garage', true);
    expect(pinned.areas_display).toEqual({ order: ['a'], nav_items: ['garage'] });
    expect(setAreaNavPinned(pinned, 'garage', false).areas_display).toEqual({ order: ['a'] });
    expect(setAreaOrder({}, []).areas_display).toEqual({ order: [] });
  });

  it('updates and prunes a whole area entry', () => {
    const withCards = updateAreaOptions({}, 'kitchen', (options) => ({ ...options, stacks_order: ['lights'] }));
    expect(withCards.areas_options).toEqual({ kitchen: { stacks_order: ['lights'] } });
    expect(
      updateAreaOptions(withCards, 'kitchen', (options) => {
        delete options.stacks_order;
        return options;
      })
    ).toEqual({});
  });

  it('reads group lists per area', () => {
    const config: Simon42StrategyConfig = {
      areas_options: { kitchen: { groups_options: { lights: { hidden: ['l1'], order: ['l2'] }, covers: {} } } },
    };
    expect(getHiddenEntitiesForArea('kitchen', config)).toEqual({ lights: ['l1'] });
    expect(getEntityOrdersForArea('kitchen', config)).toEqual({ lights: ['l2'] });
    expect(getHiddenEntitiesForArea('missing', config)).toEqual({});
  });
});
