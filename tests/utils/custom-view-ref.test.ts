import { describe, expect, it, vi } from 'vitest';

import { insertCustomViews, isRefView, resolveCustomViews } from '../../src/utils/custom-view-ref';
import type { HomeAssistant } from '../../src/types/homeassistant';
import type { LovelaceViewConfig } from '../../src/types/lovelace';
import type { CustomView } from '../../src/types/strategy';

function makeHass(dashboards: Record<string, unknown>): HomeAssistant {
  const callWS = vi.fn((msg: { type: string; url_path?: string | null }) => {
    const key = msg.url_path === null ? 'lovelace' : (msg.url_path ?? 'lovelace');
    const config = dashboards[key];
    return config === undefined ? Promise.reject(new Error('config_not_found')) : Promise.resolve(config);
  });
  return { callWS } as unknown as HomeAssistant;
}

const SOURCE = {
  views: [
    { title: 'Energy', path: 'energy', icon: 'mdi:flash', sections: [{ type: 'grid', cards: [] }] },
    { title: 'No path', cards: [{ type: 'markdown', content: 'hi' }] },
  ],
};

describe('isRefView', () => {
  it('requires a non-empty dashboard reference', () => {
    expect(isRefView({ ref_dashboard: 'dash-a' })).toBe(true);
    expect(isRefView({ ref_dashboard: '' })).toBe(false);
    expect(isRefView({ yaml: 'type: sections' })).toBe(false);
  });
});

describe('resolveCustomViews', () => {
  it('keeps existing YAML views', async () => {
    const views: CustomView[] = [{ title: 'Mine', path: 'mine', parsed_config: { sections: [] } }];
    expect(await resolveCustomViews(views, makeHass({}))).toEqual([
      { sections: [], title: 'Mine', path: 'mine', icon: 'mdi:card-text-outline' },
    ]);
  });

  it('resolves by path and applies the local navigation metadata', async () => {
    const views: CustomView[] = [{
      title: 'Energy ref', path: 'energy-ref', icon: 'mdi:flash', ref_dashboard: 'dash-a', ref_view: 'energy',
    }];
    expect(await resolveCustomViews(views, makeHass({ 'dash-a': SOURCE }))).toEqual([{
      title: 'Energy ref', path: 'energy-ref', icon: 'mdi:flash', sections: [{ type: 'grid', cards: [] }],
    }]);
  });

  it('resolves path-less views by stringified index', async () => {
    const views: CustomView[] = [{ title: 'Second', path: 'second', ref_dashboard: 'dash-a', ref_view: '1' }];
    const resolved = await resolveCustomViews(views, makeHass({ 'dash-a': SOURCE }));
    expect(resolved[0].cards).toEqual([{ type: 'markdown', content: 'hi' }]);
  });

  it('maps the default dashboard sentinel to null and fetches a source once', async () => {
    const hass = makeHass({ lovelace: SOURCE });
    const views: CustomView[] = [
      { title: 'One', path: 'one', ref_dashboard: 'lovelace', ref_view: 'energy' },
      { title: 'Two', path: 'two', ref_dashboard: 'lovelace', ref_view: '1' },
    ];
    expect(await resolveCustomViews(views, hass)).toHaveLength(2);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(hass.callWS).toHaveBeenCalledWith({ type: 'lovelace/config', url_path: null });
  });

  it('degrades broken, strategy, and missing-view references to readable views', async () => {
    const cases: Array<[CustomView, Record<string, unknown>]> = [
      [{ title: 'A', path: 'a', ref_dashboard: 'missing', ref_view: 'x' }, {}],
      [{ title: 'B', path: 'b', ref_dashboard: 'strategy', ref_view: 'x' }, { strategy: { strategy: {} } }],
      [{ title: 'C', path: 'c', ref_dashboard: 'dash-a', ref_view: 'missing' }, { 'dash-a': SOURCE }],
    ];
    for (const [view, dashboards] of cases) {
      const resolved = await resolveCustomViews([view], makeHass(dashboards));
      expect(JSON.stringify(resolved[0].sections)).toContain('markdown');
    }
  });

  it('skips incomplete references without fetching', async () => {
    const hass = makeHass({ 'dash-a': SOURCE });
    const views: CustomView[] = [{ title: 'x', path: 'x', ref_dashboard: 'dash-a', ref_view: '' }];
    expect(await resolveCustomViews(views, hass)).toEqual([]);
    expect(hass.callWS).not.toHaveBeenCalled();
  });
});

describe('insertCustomViews', () => {
  const view = (path: string): LovelaceViewConfig => ({ title: path, path });

  it('preserves append-at-end behavior without an anchor', () => {
    const generated = [view('home'), view('kitchen')];
    insertCustomViews(generated, [{ title: 'Extra', path: 'extra' }], [view('extra')]);
    expect(generated.map((item) => item.path)).toEqual(['home', 'kitchen', 'extra']);
  });

  it('inserts after anchors and preserves same-anchor config order', () => {
    const generated = [view('home'), view('kitchen')];
    insertCustomViews(generated, [
      { title: 'A', path: 'a', after_view: 'home' },
      { title: 'B', path: 'b', after_view: 'home' },
    ], [view('a'), view('b')]);
    expect(generated.map((item) => item.path)).toEqual(['home', 'a', 'b', 'kitchen']);
  });

  it('appends when an anchor is stale', () => {
    const generated = [view('home')];
    insertCustomViews(generated, [{ title: 'A', path: 'a', after_view: 'missing' }], [view('a')]);
    expect(generated.map((item) => item.path)).toEqual(['home', 'a']);
  });
});
