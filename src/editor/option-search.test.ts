import { beforeAll, describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { loadLanguage, setupLocalize } from '../utils/localize';
import { OPTION_METADATA } from '../utils/option-metadata';
import { isOptionChanged, OPTION_PANELS, searchOptions } from './option-search';

const english = { language: 'en', locale: { language: 'en' } } as HomeAssistant;

beforeAll(() => setupLocalize(english));

const keys = (results: ReturnType<typeof searchOptions>): string[] => results.map((result) => result.key);

describe('option panel mapping', () => {
  it('names a panel (or YAML-only) for exactly the options that have metadata', () => {
    expect(Object.keys(OPTION_PANELS).sort()).toEqual(Object.keys(OPTION_METADATA).sort());
  });
});

describe('isOptionChanged', () => {
  it('ignores unset values and values equal to the default', () => {
    expect(isOptionChanged({}, 'show_windows_summary')).toBe(false);
    expect(isOptionChanged({ show_windows_summary: false }, 'show_windows_summary')).toBe(false);
    expect(isOptionChanged({ show_ups_in_rooms: true }, 'show_ups_in_rooms')).toBe(false);
  });

  it('detects values that differ from the default', () => {
    expect(isOptionChanged({ show_windows_summary: true }, 'show_windows_summary')).toBe(true);
    expect(isOptionChanged({ show_ups_in_rooms: false }, 'show_ups_in_rooms')).toBe(true);
    expect(isOptionChanged({ alarm_entity: 'alarm_control_panel.home' }, 'alarm_entity')).toBe(true);
  });

  it('counts options without a default as changed once set explicitly', () => {
    expect(isOptionChanged({}, 'show_maintenance_view')).toBe(false);
    expect(isOptionChanged({ show_maintenance_view: false }, 'show_maintenance_view')).toBe(true);
  });

  it('resolves legacy aliases', () => {
    const legacy = { show_camera_view: true } as Simon42StrategyConfig;
    expect(isOptionChanged(legacy, 'show_cctv_view')).toBe(true);
  });

  it('treats lists and objects as changed only when they have content', () => {
    expect(isOptionChanged({ favorite_entities: [] }, 'favorite_entities')).toBe(false);
    expect(isOptionChanged({ favorite_entities: ['light.a'] }, 'favorite_entities')).toBe(true);
    expect(isOptionChanged({ areas_options: {} }, 'areas_options')).toBe(false);
    expect(isOptionChanged({ areas_options: { garden: {} } }, 'areas_options')).toBe(true);
  });
});

describe('searchOptions', () => {
  it('lists nothing for an empty query unless only changed options are requested', () => {
    expect(searchOptions({}, '', false)).toEqual([]);
    expect(searchOptions({}, '   ', false)).toEqual([]);
    expect(searchOptions({}, '', true)).toEqual([]);
  });

  it('matches by configuration key, ignoring case', () => {
    expect(keys(searchOptions({}, 'SHOW_WINDOWS_SUMMARY', false))).toContain('show_windows_summary');
  });

  it('matches by label and panel name and requires every word', () => {
    const found = searchOptions({}, 'windows summary', false);
    expect(keys(found)).toContain('show_windows_summary');
    expect(found.find((result) => result.key === 'show_windows_summary')?.panel).toBe('summaries');
    expect(searchOptions({}, 'windows summary zzzunknown', false)).toEqual([]);
  });

  it('ranks label matches before description-only matches', () => {
    const found = searchOptions({}, 'thresholds', false);
    expect(found.length).toBeGreaterThan(0);
    const labelMatches = found.filter((result) => result.label.toLowerCase().includes('thresholds'));
    expect(found.slice(0, labelMatches.length).every((result) => labelMatches.includes(result))).toBe(true);
  });

  it('lists only changed options and combines the switch with a query', () => {
    const config: Simon42StrategyConfig = {
      show_windows_summary: true,
      hide_unavailable_entities: false,
      favorite_entities: ['light.a'],
    };
    expect(keys(searchOptions(config, '', true)).sort()).toEqual(['favorite_entities', 'show_windows_summary']);
    expect(keys(searchOptions(config, 'summary', true))).toEqual(['show_windows_summary']);
    expect(keys(searchOptions(config, 'unavailable', true))).toEqual([]);
  });

  it('marks YAML-only options without a panel', () => {
    const found = searchOptions({ camera_renderer: 'webrtc' }, 'camera_renderer', false);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ key: 'camera_renderer', panel: null, changed: true });
  });

  it('ignores accents in labels and queries', async () => {
    await loadLanguage({ language: 'de', locale: { language: 'de' } } as HomeAssistant);
    setupLocalize({ language: 'de', locale: { language: 'de' } } as HomeAssistant);
    try {
      const umlaut = searchOptions({}, 'uebersicht', false).length;
      const plain = searchOptions({}, 'ubersicht', false);
      expect(plain.length).toBeGreaterThan(0);
      expect(umlaut).toBeLessThanOrEqual(plain.length);
    } finally {
      setupLocalize(english);
    }
  });
});
